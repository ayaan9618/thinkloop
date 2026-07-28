from fastapi import APIRouter, Depends, HTTPException

from auth import get_current_user
from database import supabase
from schemas import SessionCreate, SessionOut, MessageOut, SessionUpdate

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("", response_model=list[SessionOut])
def list_sessions(user_id: str = Depends(get_current_user)):
    res = (
        supabase.table("sessions")
        .select("id, title, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return res.data


@router.post("", response_model=SessionOut)
def create_session(body: SessionCreate, user_id: str = Depends(get_current_user)):
    res = (
        supabase.table("sessions")
        .insert({"user_id": user_id, "title": body.title})
        .execute()
    )
    return res.data[0]


@router.get("/{session_id}/messages", response_model=list[MessageOut])
def get_messages(session_id: str, user_id: str = Depends(get_current_user)):
    owner_check = (
        supabase.table("sessions")
        .select("id")
        .eq("id", session_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not owner_check.data:
        raise HTTPException(status_code=404, detail="Session not found")

    res = (
        supabase.table("messages")
        .select("id, role, content, created_at")
        .eq("session_id", session_id)
        .order("created_at")
        .execute()
    )
    return res.data


@router.patch("/{session_id}", response_model=SessionOut)
def update_session(
    session_id: str, body: SessionUpdate, user_id: str = Depends(get_current_user)
):
    res = (
        supabase.table("sessions")
        .update({"title": body.title})
        .eq("id", session_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=404, detail="Session not found")
    return res.data[0]


@router.delete("/{session_id}")
def delete_session(session_id: str, user_id: str = Depends(get_current_user)):
    supabase.table("sessions").delete().eq("id", session_id).eq(
        "user_id", user_id
    ).execute()
    return {"status": "deleted"}
