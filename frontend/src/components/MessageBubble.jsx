import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`message-row ${role}`}>
      {!isUser && (
        <img src="/logo.jpg" alt="" className="message-avatar" />
      )}
      <div className="message-bubble">
        {isUser ? (
          content
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
              code: ({ inline, className, children, ...props }) =>
                inline ? (
                  <code className="inline-code" {...props}>
                    {children}
                  </code>
                ) : (
                  <pre className="code-block">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ),
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
      {isUser && <div className="message-avatar user-avatar-sm">You</div>}
    </div>
  );
}
