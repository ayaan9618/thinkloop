export default function Sidebar({
  sessions,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  onLogout,
  userEmail,
  mobileOpen = true,
  onCloseMobile,
}) {
  return (
    <>
      <button
        className={`mobile-sidebar-backdrop ${mobileOpen ? "show" : ""}`}
        aria-label="Close sidebar"
        onClick={onCloseMobile}
      />
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <img src="/logo.jpg" alt="Thinkloop AI" className="sidebar-logo" />
          <span>Thinkloop AI</span>
          <button
            className="sidebar-close-btn"
            onClick={onCloseMobile}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <button className="new-chat-btn" onClick={onNewChat}>
          <span className="plus-icon">+</span> New chat
        </button>

        <div className="session-list">
          {sessions.length === 0 && (
            <p className="session-empty">No chats yet</p>
          )}
          {sessions.map((s) => (
            <div
              key={s.id}
              className={`session-item ${s.id === activeId ? "active" : ""}`}
              onClick={() => onSelect(s.id)}
            >
              <span className="session-title">{s.title}</span>
              <button
                className="delete-btn"
                title="Delete chat"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(s.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          {userEmail && (
            <div className="user-chip">
              <span className="user-avatar">
                {userEmail.charAt(0).toUpperCase()}
              </span>
              <span className="user-email">{userEmail}</span>
            </div>
          )}
          <button className="logout-btn" onClick={onLogout}>
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
