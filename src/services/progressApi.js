/**
 * Progress API - Progress tracking endpoints
 */
import http from "./http";

export const progressApi = {
  async getProgressDashboard() {
    return http.get("/api/progress/dashboard");
  },
};
