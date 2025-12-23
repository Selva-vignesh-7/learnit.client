import React from "react";
import styles from "../Ai.module.css";

export function AiTabs({ activeTab, onChange }) {
  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${activeTab === "chat" ? styles.active : ""}`}
        onClick={() => onChange("chat")}
      >
        Chat
      </button>
      <button
        className={`${styles.tab} ${
          activeTab === "compare" ? styles.active : ""
        }`}
        onClick={() => onChange("compare")}
      >
        Insights & Friends
      </button>
    </div>
  );
}
