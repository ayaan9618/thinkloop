from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
import json

from auth import get_current_user
from database import supabase
from gemini_client import generate_chat_title, generate_reply, stream_reply
from schemas import ChatRequest, ChatResponse

router = APIRouter(tags=["chat"])


def _load_session_context(session_id: str, user_id: str):
    owner_check = (
        supabase.table("sessions")
        .select("id")
        .eq("id", session_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not owner_check.data:
        raise HTTPException(status_code=404, detail="Session not found")

    session_res = (
        supabase.table("sessions")
        .select("title")
        .eq("id", session_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    history_res = (
        supabase.table("messages")
        .select("role, content")
        .eq("session_id", session_id)
        .order("created_at")
        .execute()
    )
    return session_res.data["title"], history_res.data


def _maybe_rename_session(
    session_id: str, user_id: str, current_title: str, history, first_message: str
):
    if current_title == "New chat" and len(history) == 0:
        try:
            title = generate_chat_title(first_message)
            if title:
                supabase.table("sessions").update({"title": title}).eq(
                    "id", session_id
                ).eq("user_id", user_id).execute()
        except Exception:
            pass


@router.post("/chat", response_model=ChatResponse)
def chat(body: ChatRequest, user_id: str = Depends(get_current_user)):
    current_title, history = _load_session_context(body.session_id, user_id)

    supabase.table("messages").insert(
        {"session_id": body.session_id, "role": "user", "content": body.message}
    ).execute()

    reply_text = generate_reply(history, body.message)

    supabase.table("messages").insert(
        {"session_id": body.session_id, "role": "assistant", "content": reply_text}
    ).execute()

    _maybe_rename_session(
        body.session_id, user_id, current_title, history, body.message
    )

    return ChatResponse(reply=reply_text)


@router.post("/chat/stream")
def chat_stream(body: ChatRequest, user_id: str = Depends(get_current_user)):
    current_title, history = _load_session_context(body.session_id, user_id)

    supabase.table("messages").insert(
        {"session_id": body.session_id, "role": "user", "content": body.message}
    ).execute()

    def event_stream():
        chunks = []
        try:
            for chunk in stream_reply(history, body.message):
                text = getattr(chunk, "text", "") or ""
                if text:
                    chunks.append(text)
                    yield text
        finally:
            reply_text = "".join(chunks).strip()
            if reply_text:
                supabase.table("messages").insert(
                    {
                        "session_id": body.session_id,
                        "role": "assistant",
                        "content": reply_text,
                    }
                ).execute()
            _maybe_rename_session(
                body.session_id, user_id, current_title, history, body.message
            )

    return StreamingResponse(event_stream(), media_type="text/plain")
