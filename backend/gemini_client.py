import google.generativeai as genai

from config import settings

genai.configure(api_key=settings.gemini_api_key)

SYSTEM_INSTRUCTION = """
You are thinkloop AI, a helpful CS50-style teaching assistant.
Keep answers friendly, calm, and beginner-friendly.
Explain ideas step by step, using simple language and small examples.
Prefer hints, guidance, and plain English over long or overly technical responses.
Do not sound like a hardcore chatbot or an overconfident expert.
Be concise unless the user asks for more detail.
"""

_model = genai.GenerativeModel(
    "gemini-3.1-flash-lite",
    system_instruction=SYSTEM_INSTRUCTION,
)

_title_model = genai.GenerativeModel(
    "gemini-3.1-flash-lite",
    system_instruction=(
        "Create a short chat title from the user's first message. "
        "Return only the title, no quotes, no punctuation at the end, "
        "and keep it under 6 words."
    ),
)


def generate_reply(history: list[dict], user_message: str) -> str:
    """
    history: list of {"role": "user"|"assistant", "content": str}
    Converts to Gemini's chat format and returns the reply text.
    """
    gemini_history = [
        {
            "role": "user" if m["role"] == "user" else "model",
            "parts": [m["content"]],
        }
        for m in history
    ]

    chat = _model.start_chat(history=gemini_history)
    response = chat.send_message(user_message)
    return response.text


def stream_reply(history: list[dict], user_message: str):
    gemini_history = [
        {
            "role": "user" if m["role"] == "user" else "model",
            "parts": [m["content"]],
        }
        for m in history
    ]

    chat = _model.start_chat(history=gemini_history)
    return chat.send_message(user_message, stream=True)


def generate_chat_title(user_message: str) -> str:
    response = _title_model.generate_content(user_message)
    return response.text.strip().strip('"').strip("'")
