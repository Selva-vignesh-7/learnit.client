import React from "react";
import ReactMarkdown from "react-markdown";
import { FiSend, FiZap, FiBarChart2 } from "react-icons/fi";
import styles from "../Ai.module.css";

export function ChatPanel({
  messages,
  loading,
  input,
  onInputChange,
  onSend,
  onQuickSend,
}) {
  return (
    <div className={styles.chatPanel}>
      <div className={styles.chatCard}>
        <div className={styles.messages}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`${styles.message} ${
                m.role === "assistant" ? styles.assistant : styles.user
              }`}
            >
              <ReactMarkdown className={styles.markdown}>
                {m.content}
              </ReactMarkdown>
            </div>
          ))}
          {loading && (
            <div className={`${styles.message} ${styles.assistant}`}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span style={{ marginLeft: '8px' }}>Thinking...</span>
            </div>
          )}
        </div>
        <div className={styles.inputRow}>
          <div className={styles.quickActions}>
            <button
              type="button"
              className={styles.pill}
              onClick={() =>
                onQuickSend("Give me 3 schedule tweaks for this week")
              }
              disabled={loading}
            >
              <FiZap /> Schedule tips
            </button>
            <button
              type="button"
              className={styles.pill}
              onClick={() =>
                onQuickSend(
                  "Give me 3 quick progress insights and next actions"
                )
              }
              disabled={loading}
            >
              <FiBarChart2 /> Progress tips
            </button>
          </div>
          <div className={styles.inputFlex}>
            <input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Ask anything about your study plan..."
            />
            <button onClick={onSend} disabled={loading || !input.trim()}>
              <FiSend /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
