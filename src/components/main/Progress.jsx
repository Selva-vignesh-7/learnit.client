import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { progressApi } from "../../services";
import { Loading, ErrorMessage } from "../ui/index";
import styles from "./Progress.module.css";

function Progress() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProgressData();
    
    // Refresh data every 30 seconds to show updated streaks
    const interval = setInterval(() => {
      loadProgressData();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await progressApi.getProgressDashboard();

      const weeklyData = (data.weeklyData || data.WeeklyData || []).map(
        (d) => ({
          day: d.day || d.Day || "",
          scheduled: Number(d.scheduled ?? d.Scheduled ?? 0),
          completed: Number(d.completed ?? d.Completed ?? 0),
        })
      );
      
      // Debug logging (can be removed in production)
      if (weeklyData.length > 0) {
        console.log('[Progress] Weekly data loaded:', weeklyData);
        console.log('[Progress] Weekly totals - Scheduled:', weeklyData.reduce((sum, d) => sum + d.scheduled, 0), 'Completed:', weeklyData.reduce((sum, d) => sum + d.completed, 0));
        // Check if today's data is included
        const todayData = weeklyData.find(d => d.day === 'Today' || d.day.toLowerCase().includes('today'));
        if (todayData) {
          console.log('[Progress] Today\'s data:', todayData);
        } else {
          console.warn('[Progress] ⚠️ Today\'s data not found in weekly data. Last day:', weeklyData[weeklyData.length - 1]);
        }
      }

      const derivedTotals = weeklyData.reduce(
        (acc, d) => {
          acc.scheduled += d.scheduled;
          acc.completed += d.completed;
          return acc;
        },
        { scheduled: 0, completed: 0 }
      );

      const stats = {
        currentStreak: Number(
          data.stats?.currentStreak ?? data.Stats?.CurrentStreak ?? 0
        ),
        longestStreak: Number(
          data.stats?.longestStreak ?? data.Stats?.LongestStreak ?? 0
        ),
        totalScheduledHours:
          Number(
            data.stats?.totalScheduledHours ??
              data.Stats?.TotalScheduledHours ??
              0
          ) || derivedTotals.scheduled,
        totalCompletedHours:
          Number(
            data.stats?.totalCompletedHours ??
              data.Stats?.TotalCompletedHours ??
              0
          ) || derivedTotals.completed,
        completionRate: Number(
          data.stats?.completionRate ?? data.Stats?.CompletionRate ?? 0
        ),
        overallProgress: Number(
          data.stats?.overallProgress ?? data.Stats?.OverallProgress ?? 0
        ),
      };

      const courseProgress = (
        data.courseProgress ||
        data.CourseProgress ||
        []
      ).map((c) => ({
        id: c.id ?? c.Id,
        title: c.title ?? c.Title,
        progressPercentage: Number(
          c.progressPercentage ?? c.ProgressPercentage ?? 0
        ),
      }));

      const activityHeatmap =
        data.activityHeatmap || data.ActivityHeatmap || [];

      // Debug logging for streaks and heatmap
      console.log('[Progress] Streaks - Current:', stats.currentStreak, 'Longest:', stats.longestStreak);
      console.log('[Progress] Heatmap data:', activityHeatmap.length, 'days', activityHeatmap);
      
      if (activityHeatmap.length === 0) {
        console.warn('[Progress] ⚠️ Heatmap data is empty!');
      }
      if (stats.currentStreak === 0 && stats.longestStreak === 0) {
        console.warn('[Progress] ⚠️ Both streaks are 0 - check if StudySessions exist');
      }

      setDashboardData({ stats, weeklyData, courseProgress, activityHeatmap });
    } catch (err) {
      setError("Failed to load progress data");
      console.error("Progress data error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <section className={styles.page}>Loading progress data...</section>;
  }

  if (error || !dashboardData) {
    return (
      <section className={styles.page}>
        <div style={{ textAlign: "center", padding: "40px", color: "#c33" }}>
          {error || "Failed to load progress data"}
        </div>
      </section>
    );
  }

  const { stats, weeklyData, courseProgress, activityHeatmap } = dashboardData;

  const weeklyScheduledTotal = weeklyData.reduce(
    (sum, d) => sum + d.scheduled,
    0
  );
  const weeklyCompletedTotal = weeklyData.reduce(
    (sum, d) => sum + d.completed,
    0
  );
  const weeklyCompletionRate = weeklyScheduledTotal
    ? Math.round((weeklyCompletedTotal / weeklyScheduledTotal) * 100)
    : 0;

  const metricsData = [
    {
      icon: "🔥",
      label: "Current Streak",
      value: `${stats.currentStreak} days`,
    },
    {
      icon: "🏆",
      label: "Longest Streak",
      value: `${stats.longestStreak} days`,
    },
    {
      icon: "📅",
      label: "Week Target",
      value: `${Math.round(weeklyScheduledTotal * 10) / 10} hrs`,
    },
    {
      icon: "⏳",
      label: "Completed",
      value: `${Math.round(weeklyCompletedTotal * 10) / 10} hrs`,
    },
    {
      icon: "📊",
      label: "Completion Rate",
      value: `${weeklyCompletionRate}%`,
    },
  ];

  if (loading && !dashboardData) {
    return (
      <section className={styles.page}>
        <Loading message="Loading progress data..." />
      </section>
    );
  }

  if (error && !dashboardData) {
    return (
      <section className={styles.page}>
        <ErrorMessage
          error={error}
          onRetry={loadProgressData}
          title="Failed to load progress data"
        />
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <ErrorMessage
        error={error}
        onRetry={loadProgressData}
        onDismiss={() => setError("")}
        title="Error loading data"
        variant="banner"
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ margin: 0 }}>Progress Dashboard</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={loadProgressData}
            style={{
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>
      <div className={styles.topGrid}>
        <div className={styles.leftStack}>
          <div className={styles.section}>
            <h2>Overall Progress</h2>
            <div className={styles.progressBarOuter}>
              <div
                className={styles.progressBarInner}
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>
            <p className={styles.progressLabel}>
              {stats.overallProgress}% Completed
            </p>
          </div>

          <div className={styles.section}>
            <h2>Study Activity Heatmap</h2>
            {activityHeatmap && activityHeatmap.length > 0 ? (
              <>
                <div className={styles.heatmap}>
                  {activityHeatmap.map((val, i) => {
                    const date = new Date();
                    // Show 3 months (approximately 90 days)
                    date.setDate(date.getDate() - (89 - i));
                    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const hours = val === 0 ? 'No activity' : 
                                 val === 1 ? '< 2 hours' : 
                                 val === 2 ? '2-4 hours' : 
                                 '4+ hours';
                    
                    return (
                      <div
                        key={i}
                        className={styles.heatBox}
                        style={{
                          background:
                            val === 0
                              ? "#e0e0e0"
                              : val === 1
                              ? "#b6e0ff"
                              : val === 2
                              ? "#64c0f0"
                              : "#008dd0",
                        }}
                        title={`${dateStr}: ${hours}`}
                      />
                    );
                  })}
                </div>
            <div className={styles.heatmapLegend}>
              <span className={styles.legendLabel}>Less</span>
              <div className={styles.legendBoxes}>
                <div className={styles.legendBox} style={{ background: "#e0e0e0" }} title="No activity" />
                <div className={styles.legendBox} style={{ background: "#b6e0ff" }} title="< 2 hours" />
                <div className={styles.legendBox} style={{ background: "#64c0f0" }} title="2-4 hours" />
                <div className={styles.legendBox} style={{ background: "#008dd0" }} title="4+ hours" />
              </div>
              <span className={styles.legendLabel}>More</span>
            </div>
              </>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                No activity data available yet. Start studying to see your activity heatmap!
              </div>
            )}
          </div>
        </div>

        <div className={styles.metricsColumn}>
          <div className={styles.metricsRow}>
            {metricsData.map((metric) => (
              <div className={styles.metric} key={metric.label}>
                <span className={styles.metricIcon}>{metric.icon}</span>
                <div className={styles.metricText}>
                  <span className={styles.metricLabel}>{metric.label}</span>
                  <strong className={styles.metricValue}>{metric.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className={styles.chartsRow}>
        <div className={styles.chartBox}>
          <h2>Scheduled vs Completed</h2>
          {weeklyData && weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`${value} hrs`, name === 'scheduled' ? 'Scheduled' : 'Completed']}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Bar dataKey="scheduled" fill="#007bff" name="Scheduled" />
                <Bar dataKey="completed" fill="#00b894" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              No weekly data available yet
            </div>
          )}
        </div>

        <div className={styles.chartBox}>
          <h2>Weekly Trend</h2>
          {weeklyData && weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `${value} hrs`}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Line
                  dataKey="completed"
                  stroke="#00b894"
                  strokeWidth={2}
                  dot={{ fill: "#00b894", r: 4 }}
                  name="Completed Hours"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              No weekly data available yet
            </div>
          )}
        </div>
      </div>

      {/* COURSE PROGRESS */}
      <div className={styles.section}>
        <h2>Course Progress</h2>
        <div className={styles.courseGrid}>
          {courseProgress && courseProgress.length > 0 ? (
            courseProgress.map((course) => (
              <div className={styles.courseCard} key={course.id}>
                <span className={styles.courseName}>{course.title}</span>
                <div className={styles.courseProgressBarOuter}>
                  <div
                    className={styles.courseProgressBarInner}
                    style={{ width: `${course.progressPercentage}%` }}
                  />
                </div>
                <span className={styles.coursePercent}>
                  {course.progressPercentage}%
                </span>
              </div>
            ))
          ) : (
            <p className={styles.noData}>No courses in progress</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Progress;
