import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useLogout } from "../../hooks/useLogout";
import { scheduleApi } from "../../services";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineMenuBook } from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";
import { BsGraphUp, BsChatDots } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useLogout();
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState("");
  const [weekStats, setWeekStats] = useState({ scheduled: 0, completed: 0 });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setScheduleLoading(true);
        setScheduleError("");
        const data = await scheduleApi.getScheduleEvents();

        if (!Array.isArray(data)) {
          console.warn("[Sidebar] Schedule data is not an array:", data);
          setWeekStats({ scheduled: 0, completed: 0 });
          return;
        }

        const now = new Date();
        
        // Calculate current week boundaries (Monday to Sunday)
        const today = new Date(now);
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday (0) to 6
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - daysFromMonday);
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        weekEnd.setHours(23, 59, 59, 999);

        let scheduled = 0;
        let completed = 0;

        data.forEach((e) => {
          try {
            if (!e || !e.courseModuleId) return;
            
            if (!e.startUtc) {
              console.warn("[Sidebar] Event missing startUtc:", e);
              return;
            }

            const start = new Date(e.startUtc);
            if (isNaN(start.getTime())) {
              console.warn("[Sidebar] Invalid start date:", e.startUtc);
              return;
            }

            const end = e.endUtc
              ? new Date(e.endUtc)
              : new Date(start.getTime() + 60 * 60 * 1000);
            
            if (isNaN(end.getTime())) {
              console.warn("[Sidebar] Invalid end date:", e.endUtc);
              return;
            }

            // Only count events that fall within the current week
            // Check if event overlaps with current week
            const eventEnd = end > start ? end : start;
            if (eventEnd < weekStart || start > weekEnd) {
              return; // Event is outside current week
            }

            // Calculate hours for the portion of event within the week
            const eventStartInWeek = start < weekStart ? weekStart : start;
            const eventEndInWeek = eventEnd > weekEnd ? weekEnd : eventEnd;
            
            const hours = Math.max(0.25, (eventEndInWeek - eventStartInWeek) / (1000 * 60 * 60));
            scheduled += hours;
            
            // Count as completed if module is done OR event has passed
            if (e.courseModule?.isCompleted || eventEnd <= now) {
              completed += hours;
            }
          } catch (eventErr) {
            console.error("[Sidebar] Error processing event:", eventErr, e);
            // Continue with other events
          }
        });

        setWeekStats({
          scheduled: Math.round(scheduled * 10) / 10,
          completed: Math.round(completed * 10) / 10,
        });
      } catch (err) {
        console.error("[Sidebar] Error fetching schedule:", err);
        setScheduleError(err?.message || "Failed to load schedule");
        setWeekStats({ scheduled: 0, completed: 0 });
      } finally {
        setScheduleLoading(false);
      }
    };

    fetchSchedule();
    
    // Refresh every minute to update completion status
    const interval = setInterval(fetchSchedule, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatHours = (hours) => {
    if (hours === null || hours === undefined) return "--";
    const rounded = Math.round(hours * 10) / 10;
    const display = Number.isInteger(rounded)
      ? rounded.toFixed(0)
      : rounded.toFixed(1);
    return `${display} hrs`;
  };

  const targetHours = weekStats.scheduled;
  const completedHours = weekStats.completed;
  const completionPct = targetHours
    ? Math.min(100, Math.round((completedHours / targetHours) * 100))
    : 0;

  const targetLabel = scheduleLoading ? "Loading..." : formatHours(targetHours);

  const completionLabel = scheduleLoading
    ? "Syncing schedule"
    : `${completionPct}% complete`;

  const menuItems = useMemo(
    () => [
      {
        path: "/app/course",
        label: "Courses",
        icon: <MdOutlineMenuBook size={22} />,
        activeKey: "course",
      },
      {
        path: "/app/schedule",
        label: "Schedule",
        icon: <AiOutlineSchedule size={22} />,
        activeKey: "schedule",
      },
      {
        path: "/app/progress",
        label: "Progress",
        icon: <BsGraphUp size={22} />,
        activeKey: "progress",
      },
      {
        path: "/app/profile",
        label: "Profile",
        icon: <CgProfile size={22} />,
        activeKey: "profile",
      },
      {
        path: "/app/ai",
        label: "AI",
        icon: <BsChatDots size={22} />,
        activeKey: "ai",
      },
      {
        path: "/app/classrooms",
        label: "Classrooms",
        icon: <FaUsers size={22} />,
        activeKey: "classrooms",
      },
      {
        path: "/app/awards",
        label: "Awards",
        icon: <FaTrophy size={22} />,
        activeKey: "awards",
      },
    ],
    []
  );

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      aria-label="Primary"
    >
      <button
        className={styles.toggleBtn}
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        type="button"
      >
        {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
      </button>

      <div className={styles.branding}>
        <p className={styles.brandTitle}>{collapsed ? "L" : "Learnit"}</p>
        {!collapsed && <span className={styles.brandTag}>Study hub</span>}
      </div>

      <div className={styles.sectionLabel}>Navigate</div>
      <nav className={styles.menu}>
        {menuItems.map((item) => {
          const isActive = location.pathname.includes(item.activeKey);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              {!collapsed && <span className={styles.label}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <>
          <div className={styles.sectionLabel}>Focus</div>
          <div className={styles.focusCard}>
            <p>Week target</p>
            <h3>{targetLabel}</h3>
            <div className={styles.progressTrack}>
              <span style={{ width: `${completionPct}%` }} />
            </div>
            <small>{completionLabel}</small>
            {scheduleError && (
              <small className={styles.errorText}>
                Schedule data unavailable
              </small>
            )}
          </div>
        </>
      )}

      <div className={styles.footerSection}>
        <button
          className={styles.logoutBtn}
          type="button"
          onClick={logout}
          aria-label="Logout"
        >
          <span className={styles.icon}>
            <IoIosLogOut size={20} />
          </span>
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
