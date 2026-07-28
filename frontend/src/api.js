import { supabase } from "./supabaseClient";

const API_URL = import.meta.env.VITE_API_URL;

async function authHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.access_token}`,
  };
}

export async function listSessions() {
  const res = await fetch(`${API_URL}/sessions`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load sessions");
  return res.json();
}

export async function createSession(title = "New chat") {
  const res = await fetch(`${API_URL}/sessions`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
}

export async function getMessages(sessionId) {
  const res = await fetch(`${API_URL}/sessions/${sessionId}/messages`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load messages");
  return res.json();
}

export async function sendMessage(sessionId, message) {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ session_id: sessionId, message }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

export async function streamMessage(sessionId, message, onChunk) {
  const res = await fetch(`${API_URL}/chat/stream`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ session_id: sessionId, message }),
  });
  if (!res.ok || !res.body) throw new Error("Failed to stream message");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;
    onChunk(fullText);
  }

  return fullText;
}

export async function renameSession(sessionId, title) {
  const res = await fetch(`${API_URL}/sessions/${sessionId}`, {
    method: "PATCH",
    headers: await authHeaders(),
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to rename session");
  return res.json();
}

export async function deleteSession(sessionId) {
  const res = await fetch(`${API_URL}/sessions/${sessionId}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete session");
  return res.json();
}
