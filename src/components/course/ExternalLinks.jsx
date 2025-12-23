import { useState } from "react";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaTrash,
  FaExternalLinkAlt,
} from "react-icons/fa";
import styles from "./ExternalLinks.module.css";

const PLATFORMS = [
  "Udemy",
  "Coursera",
  "YouTube",
  "Website",
  "GitHub",
  "Documentation",
];

const ICONS = {
  udemy: "🎓",
  coursera: "📚",
  youtube: "▶️",
  github: "💻",
  documentation: "📖",
  website: "🔗",
};

function ExternalLinks({ links, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState({});

  const startEdit = (link) => {
    setEditing(link.id);
    setValues({ platform: link.platform, title: link.title, url: link.url });
  };

  const saveEdit = () => {
    onUpdate(editing, values);
    setEditing(null);
  };

  if (links.length === 0) {
    return <div className={styles.empty}>No external links</div>;
  }

  return (
    <div className={styles.list}>
      {links.map((link) => (
        <div key={link.id} className={styles.item}>
          {editing === link.id ? (
            <div className={styles.form}>
              <select
                value={values.platform}
                onChange={(e) =>
                  setValues({ ...values, platform: e.target.value })
                }
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                value={values.title}
                onChange={(e) =>
                  setValues({ ...values, title: e.target.value })
                }
                placeholder="Title"
              />
              <input
                value={values.url}
                onChange={(e) => setValues({ ...values, url: e.target.value })}
                placeholder="https://..."
              />
              <div className={styles.actions}>
                <button onClick={saveEdit}>
                  <FaSave />
                </button>
                <button onClick={() => setEditing(null)}>
                  <FaTimes />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.content}>
                <span className={styles.icon}>
                  {ICONS[link.platform.toLowerCase()] || "🔗"}
                </span>
                <div className={styles.info}>
                  <span className={styles.platform}>{link.platform}</span>
                  <span className={styles.title}>
                    {link.title || "Untitled"}
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.url}
                  >
                    {link.url} <FaExternalLinkAlt />
                  </a>
                </div>
              </div>
              <div className={styles.actions}>
                <button onClick={() => startEdit(link)}>
                  <FaEdit />
                </button>
                <button onClick={() => onDelete(link.id)}>
                  <FaTrash />
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ExternalLinks;
