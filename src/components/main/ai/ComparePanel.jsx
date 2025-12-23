import React from "react";
import ReactMarkdown from "react-markdown";
import { FiUsers } from "react-icons/fi";
import styles from "../Ai.module.css";

export function ComparePanel({
  friends,
  selectedFriendIds,
  insights,
  loading,
  onSelectFriend,
  onCompare,
}) {
  return (
    <div className={styles.compareColumn}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Select a friend</h3>
          <small>We’ll compare them with your progress</small>
        </div>
        <ul className={styles.friendList}>
          {friends.map((f) => (
            <li key={f.id}>
              <label className={styles.friendRow}>
                <input
                  type="radio"
                  name="friendCompare"
                  checked={selectedFriendIds.includes(f.id)}
                  onChange={() => onSelectFriend(f.id)}
                  disabled={loading}
                />
                <div>
                  <strong>{f.displayName}</strong>
                  <p className={styles.muted}>
                    {f.completionRate}% · {f.weeklyHours}h/wk · {f.email}
                  </p>
                </div>
              </label>
            </li>
          ))}
          {!friends.length && (
            <li className={styles.muted}>
              No friends yet. Add them from Profile → Friends.
            </li>
          )}
        </ul>
        <button
          className={styles.primaryBtn}
          onClick={onCompare}
          disabled={!selectedFriendIds.length || loading}
        >
          <FiUsers /> Compare with AI
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Insights</h3>
          <small>User vs selected friend</small>
        </div>
        <div className={styles.insightBox}>
          {insights.length ? (
            insights.map((ins, i) => (
              <div key={i} className={styles.insightBlock}>
                <ReactMarkdown className={styles.markdown}>
                  {ins.detail}
                </ReactMarkdown>
              </div>
            ))
          ) : (
            <p className={styles.muted}>No insights yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
