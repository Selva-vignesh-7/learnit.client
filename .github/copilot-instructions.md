# GitHub Copilot Instructions for Learnit

These instructions guide AI coding agents working in this repo. Focus on respecting the existing architecture and patterns instead of inventing new ones.

## Project Overview

- **Stack**: React + Vite SPA (`learnit.client`) talking to an ASP.NET Core API (`Learnit.Server`) via a `/api` proxy.
- **Routing/layout**: React Router in `src/router.jsx` with layouts in `src/layouts/` and feature pages in `src/components/main/` (course, schedule, profile, progress) plus marketing pages in `src/components/home/`.
- **Domain features**:
  - Courses: `src/components/main/Course.jsx` and `src/components/course/*` (list, details, nested modules, modals).
  - Schedule: `src/components/main/Schedule.jsx` with FullCalendar and AI-style insights.
  - Progress: `src/components/main/Progress.jsx` with Recharts dashboards.
  - Profile: `src/components/main/Profile.jsx` for user settings and theme.
  - Auth: `src/components/auth/*` with `AuthContext`/`AuthProvider` and route guards in `components/auth/RequireAuth.jsx`.

## API & Data Access

- **Central pattern**: All HTTP calls go through `src/services/http.js` and feature-specific API modules documented in `src/services/README.md`.
- **Service modules** (respect this split; do not reintroduce a monolithic `api.js`):
  - `authApi.js`, `courseApi.js`, `scheduleApi.js`, `profileApi.js`, `progressApi.js` re-exported from `src/services/index.js`.
  - Import as `import { courseApi } from "../../services";` from components (see `src/services/README.md` for examples).
- **Base URL**: Use **relative** paths (e.g. `"/api/courses"`) and let `vite.config.js` proxy to ASP.NET. Do **not** hard-code `localhost`/ports in client code.
- **Error handling**: Let `http.js` normalize errors; components typically wrap API calls in `try/catch` and surface `err.message` to local state.
- **When adding endpoints**: Follow the pattern in `src/services/README.md` → add method to the appropriate `*Api.js`, then export from `src/services/index.js`.

## Auth & Global State

- **AuthContext**: Defined in `src/context/AuthContext.js` and wired via `AuthProvider.jsx`. It stores `user`, `token`, `isAuthenticated`, and `loading`.
- **Token handling**:
  - JWT token is returned from the backend (usually `{ token }` only).
  - Stored in `localStorage`; sometimes decoded client-side to derive a minimal `user` object.
  - `http.js` attaches the `Authorization: Bearer <token>` header when present.
- **Route protection**: Use `components/auth/RequireAuth.jsx` instead of ad-hoc checks; keep redirects consistent with existing routes (e.g. `/auth/login`, `/app/course`).

## UI & Component Structure

- **CSS Modules**: All feature components use `.module.css`. When creating new components, colocate styles and import as `import styles from "./MyComponent.module.css";`.
- **Course feature**:
  - High-level page: `components/main/Course.jsx` manages filters, stats, and opening modals.
  - Reusable pieces live in `components/course/`:
    - `CourseList`, `CourseCard` for listing.
    - `CreateCourseModal`, `EditCourseModal` for CRUD.
    - `CourseDetails`, `ModuleTree`, `ExternalLinks`, `ProgressCard` for detail view and nested modules.
  - **Nested modules**: Represented as a flat list with `parentModuleId` in forms (`ModuleForm.jsx`) and rendered as a tree in `ModuleTree.jsx`. Preserve this flat→tree flow when extending modules.
- **Schedule feature**: `components/main/Schedule.jsx` is large but cohesive. When modifying it:
  - Use `scheduleApi` only.
  - Keep FullCalendar config and AI insights (`aiInsights` memo) intact unless there is a strong reason to change.
- **Progress & Profile**: Follow existing patterns for charts (`recharts`) and theme management (`ThemeContext.jsx`). Do not introduce new state libraries.

## Build, Run, and Debug

- **Frontend dev**: From `learnit.client`:
  - `npm install`
  - `npm run dev` (Vite dev server; relies on ASP.NET backend for `/api`).
- **Backend**: `Learnit.Server` is an ASP.NET Core Web API. It is typically run via Visual Studio solution startup (see `Learnit.Server/CHANGELOG.md`).
- **Vite proxy & HTTPS**:
  - `vite.config.js` generates dev HTTPS certs via `dotnet dev-certs` and proxies `/api` to the ASP.NET server.
  - Do not bypass this by using plain HTTP URLs in client code.

## Conventions & Best Practices (Repo-Specific)

- Prefer **feature-folder structure** over ad-hoc placement: add main pages to `components/main/` and reusable widgets to domain folders (e.g. `components/course/`).
- When touching API calls, first check `src/services/README.md` and mirror the existing method signatures and naming (`getX`, `createX`, `updateX`, `deleteX`, `toggleX`, etc.).
- Keep components **presentational vs. data** responsibilities aligned with current code:
  - Pages (in `components/main/`) own data fetching and high-level state.
  - Child components (e.g. `CourseCard`, `ModuleTree`) receive data/handlers via props and should not call APIs directly.
- Use React hooks already in place (`useAuth`, `useTheme`, etc.) instead of creating new global state mechanisms.
- Avoid introducing TypeScript or new major libraries unless explicitly requested.

## When Adding or Modifying Features

- Reuse existing patterns for:
  - Fetching data in `useEffect` with loading/error state.
  - Using the domain APIs (`courseApi`, `scheduleApi`, etc.) from pages.
  - Showing nested course structure via `ModuleForm` and `ModuleTree`.
- If you need a new cross-cutting concern (e.g. another API area), mirror the structure under `src/services/` and document it in `src/services/README.md`.
