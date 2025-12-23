import { FaPlay, FaEdit, FaTrash } from "react-icons/fa";
import styles from "./CourseCard.module.css";

function CourseCard({ course, onNavigate, onEdit, onDelete }) {
  const {
    id,
    title,
    description,
    hoursRemaining,
    totalEstimatedHours,
    progressPercentage,
    completedModules,
    totalModules,
    completedHours,
    priority,
    difficulty,
  } = course;

  const safeTotalHours = totalEstimatedHours ?? 0;
  const safeHoursRemaining =
    hoursRemaining ?? Math.max(0, safeTotalHours - (completedHours ?? 0));

  const derivedFromHours =
    safeTotalHours > 0
      ? ((safeTotalHours - safeHoursRemaining) / safeTotalHours) * 100
      : 0;

  const hasServerProgress =
    progressPercentage !== null && progressPercentage !== undefined;

  const progress = hasServerProgress
    ? progressPercentage === 0 && derivedFromHours > 0
      ? derivedFromHours
      : progressPercentage
    : derivedFromHours;

  const moduleLabel =
    totalModules !== undefined
      ? `${completedModules ?? 0}/${totalModules} modules`
      : `${Math.round(progress)}%`;

  const hoursDone =
    completedHours ?? Math.max(0, safeTotalHours - safeHoursRemaining);

  const handlePlay = (e) => {
    e.stopPropagation();
    onNavigate(id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm("Delete this course?")) {
      onDelete(id);
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.hero}>
        <div className={styles.initial}>{title.charAt(0).toUpperCase()}</div>
        <div className={styles.heroMeta}>
          {priority && (
            <span
              className={`${styles.pill} ${
                styles[`pill_${priority.toLowerCase()}`]
              }`}
            >
              {priority}
            </span>
          )}
          {difficulty && (
            <span
              className={`${styles.pill} ${
                styles[`pill_${difficulty.toLowerCase()}`]
              }`}
            >
              {difficulty}
            </span>
          )}
        </div>
        <button
          className={styles.playFab}
          onClick={handlePlay}
          title="Open Course"
        >
          <FaPlay />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.hours}>{totalEstimatedHours}h</span>
        </div>
        <p className={styles.description}>{description || "No description"}</p>

        <div className={styles.progress}>
          <div className={styles.bar}>
            <div className={styles.fill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.text}>
            <span className={styles.percent}>{Math.round(progress)}%</span>
            <span className={styles.remaining}>
              {moduleLabel} · {safeHoursRemaining}h left
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.primary} onClick={handlePlay}>
            <FaPlay /> Continue
          </button>
          <div className={styles.iconActions}>
            <button
              className={styles.iconBtn}
              onClick={handleEdit}
              title="Edit"
            >
              <FaEdit />
            </button>
            <button
              className={styles.iconBtn}
              onClick={handleDelete}
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
