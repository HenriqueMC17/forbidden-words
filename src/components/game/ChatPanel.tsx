import React, { useRef, useEffect } from "react";
import { SendHorizontal } from "lucide-react";

interface Message {
  _id: string;
  playerId?: string;
  playerName: string;
  text: string;
  type: "chat" | "guess" | "system" | "buzz" | "correct";
  createdAt: number;
}

interface ChatPanelProps {
  messages: Message[];
  status: "LOBBY" | "IN_PROGRESS" | "ROUND_END";
  isSpeaker: boolean;
  inputText: string;
  onChangeInput: (text: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  errorMsg?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  status,
  isSpeaker,
  inputText,
  onChangeInput,
  onSendMessage,
  errorMsg,
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Rolagem automática ao receber novas mensagens
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section
      className="glass-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1.5,
        minHeight: 0,
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 18px",
          borderBottom: "1px solid var(--border-light)",
          background: "rgba(255, 255, 255, 0.01)",
        }}
      >
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {status === "IN_PROGRESS" && !isSpeaker ? "Guessing Chat (Palpites)" : "Room Chat"}
        </span>
      </div>

      {/* Messages Scroll Box */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {messages.map((msg) => {
          let msgBg = "transparent";
          let borderCol = "transparent";
          let txtCol = "var(--text-primary)";
          let prefix = "";

          if (msg.type === "system") {
            msgBg = "rgba(255, 255, 255, 0.02)";
            borderCol = "rgba(255, 255, 255, 0.05)";
            txtCol = "var(--text-secondary)";
            prefix = "📢";
          } else if (msg.type === "correct") {
            msgBg = "rgba(16, 185, 129, 0.12)";
            borderCol = "rgba(16, 185, 129, 0.25)";
            txtCol = "#10b981";
            prefix = "🎉";
          } else if (msg.type === "buzz") {
            msgBg = "rgba(244, 63, 94, 0.1)";
            borderCol = "rgba(244, 63, 94, 0.2)";
            txtCol = "rgba(244, 63, 94, 1)";
            prefix = "⚠️";
          } else if (msg.type === "guess") {
            msgBg = "rgba(6, 182, 212, 0.06)";
            borderCol = "rgba(6, 182, 212, 0.12)";
            prefix = "🔮";
          }

          return (
            <div
              key={msg._id}
              className="fade-in"
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: msgBg,
                border: `1px solid ${borderCol}`,
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem" }}>
                <span>{prefix}</span>
                <strong
                  style={{
                    color:
                      msg.type === "correct"
                        ? "#10b981"
                        : msg.type === "buzz"
                        ? "rgba(244, 63, 94, 1)"
                        : "var(--text-primary)",
                  }}
                >
                  {msg.playerName}
                </strong>
                <span className="tabular-nums" style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.92rem",
                  color: txtCol,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  paddingLeft: "18px",
                }}
              >
                {msg.text}
              </span>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Error message alert */}
      {errorMsg && (
        <div
          style={{
            padding: "8px 16px",
            background: "rgba(244, 63, 94, 0.15)",
            color: "rgba(244, 63, 94, 1)",
            fontSize: "0.8rem",
            fontWeight: 500,
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={onSendMessage}
        style={{
          display: "flex",
          gap: "10px",
          padding: "12px 16px",
          borderTop: "1px solid var(--border-light)",
          background: "rgba(13, 13, 13, 0.3)",
        }}
      >
        <input
          type="text"
          className="input-field"
          placeholder={
            status !== "IN_PROGRESS"
              ? "Digite uma mensagem..."
              : isSpeaker
              ? "Descreva a palavra-alvo sem usar as proibidas..."
              : "Digite seu palpite de palavra..."
          }
          value={inputText}
          onChange={(e) => onChangeInput(e.target.value)}
          maxLength={100}
          style={{ padding: "10px 14px", fontSize: "0.95rem" }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: "10px 16px", borderRadius: "10px" }}
          title="Enviar Mensagem"
        >
          <SendHorizontal size={18} />
        </button>
      </form>
    </section>
  );
};
