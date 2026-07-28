import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  listSessions,
  createSession,
  getMessages,
  streamMessage,
  deleteSession,
} from "../api";
import Sidebar from "../components/Sidebar";
import MessageBubble from "../components/MessageBubble";

const SUGGESTIONS = [
  "Explain a concept simply",
  "Help me debug some code",
  "Draft an email for me",
  "Brainstorm ideas with me",
];

export default function Chat() {
  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  async function init() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserEmail(user?.email || "");

    const existing = await listSessions();
    if (existing.length === 0) {
      const created = await createSession();
      setSessions([created]);
      setActiveId(created.id);
    } else {
      setSessions(existing);
      setActiveId(existing[0].id);
      setMessages(await getMessages(existing[0].id));
    }
  }

  async function handleSelect(id) {
    setActiveId(id);
    setMessages(await getMessages(id));
    setSidebarOpen(false);
  }

  async function handleNewChat() {
    const created = await createSession();
    setSessions([created, ...sessions]);
    setActiveId(created.id);
    setMessages([]);
    setSidebarOpen(false);
  }

  async function handleDelete(id) {
    await deleteSession(id);
    const remaining = sessions.filter((s) => s.id !== id);
    setSessions(remaining);
    if (id === activeId) {
      if (remaining.length > 0) {
        setActiveId(remaining[0].id);
        setMessages(await getMessages(remaining[0].id));
      } else {
        handleNewChat();
      }
    }
  }

  async function handleSend(e) {
    e?.preventDefault();
    if (!input.trim() || !activeId || sending) return;

    const text = input.trim();
    const isFirstMessage = messages.length === 0;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setSending(true);

    const assistantIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const reply = await streamMessage(activeId, text, (partial) => {
        setMessages((prev) =>
          prev.map((msg, index) =>
            index === assistantIndex ? { ...msg, content: partial } : msg
          )
        );
      });

      if (isFirstMessage) {
        const refreshed = await listSessions();
        setSessions(refreshed);
      }

      setMessages((prev) =>
        prev.map((msg, index) =>
          index === assistantIndex ? { ...msg, content: reply } : msg
        )
      );
    } catch (err) {
      setMessages((prev) => {
        const next = [...prev];
        next[assistantIndex] = {
          role: "assistant",
          content: "Something went wrong reaching the server. Try again.",
        };
        return next;
      });
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  const activeSession = sessions.find((s) => s.id === activeId);

  return (
    <div className="chat-page">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={handleSelect}
        onNewChat={handleNewChat}
        onDelete={handleDelete}
        onLogout={handleLogout}
        userEmail={userEmail}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />
      <main className="chat-main">
        <header className="chat-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="chat-header-title">
            {activeSession?.title || "New chat"}
          </span>
          <button
            className="theme-toggle-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </header>

        <div className="message-list">
          {messages.length === 0 && !sending && (
            <div className="empty-state">
              <img src="/logo.jpg" alt="" className="empty-logo" />
              <h2>How can I help you today?</h2>
              <div className="suggestion-grid">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="suggestion-chip" onClick={() => setInput(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} />
          ))}

          <div ref={bottomRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSend}>
          <div className="chat-input-wrap">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Message thinkloop AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={sending || !input.trim()}
              aria-label="Send message"
            >
              ↑
            </button>
          </div>
          <p className="chat-disclaimer">
            thinkloop AI can make mistakes. Check important info.
          </p>
        </form>
      </main>
    </div>
  );
}
