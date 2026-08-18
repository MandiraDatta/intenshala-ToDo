# Comprehensive 100% Dynamic Frontend-Backend Integration Specification

This document provides an **exhaustive, component-by-component specification** to ensure that **zero static mock data** remains anywhere in the application. Every single page, header, sidebar, modal, card, filter, toggle, context, and board component in the Next.js frontend will fetch, render, and mutate real dynamic data via the NestJS backend API.

---

## 1. Architectural Strategy for 100% Dynamic UI

To eliminate all static mock data:
1. **Zero Mock Fallbacks**: Replace all hardcoded initial state arrays (`INITIAL_PROJECTS`, `MOCK_MEMBERS`, `MOCK_TEAMS`, etc.) with asynchronous data fetching inside Context Providers and custom hooks.
2. **Context-Driven State Hierarchy**:
   - `UserContext`: Manages authenticated session (`/users/me`).
   - `ThemeContext`: Synchronizes `theme` and `colorMode` preferences with the server (`PATCH /users/me/preferences`).
   - `WorkspaceContext`: Holds user workspaces (`/workspaces`), active workspace ID, and workspace members/teams.
   - `ProjectContext` / `TaskContext`: Holds active view (`LIST` vs `BOARD`), search query, filter criteria, column visibility preferences, and paginated project/task data from NestJS.
3. **Optimistic Updates with Server Confirmation**: Drag-and-drop card movements (Kanban) and status changes immediately update local React state, followed by non-blocking API calls (`PATCH /status`, `PATCH /position`). On API error, state rolls back automatically.

---

## 2. Environment Configuration

### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### `backend/.env`
```env
PORT=4000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=super-secret-jwt-key-change-in-production-2026
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
DATABASE_URL="file:./dev.db"
```

---

## 3. Centralized API Client (`frontend/lib/api-client.ts`)

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 4. Complete Service Layer Blueprint

### `frontend/services/auth.service.ts`
```typescript
import { apiClient } from '@/lib/api-client';

export const authService = {
  async register(payload: { email: string; password: string; fullName: string; username: string }) {
    const { data } = await apiClient.post('/auth/register', payload);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  },

  async login(payload: { email: string; password: string }) {
    const { data } = await apiClient.post('/auth/login', payload);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  },

  async getMe() {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  },
};
```

### `frontend/services/user.service.ts`
```typescript
import { apiClient } from '@/lib/api-client';

export const userService = {
  async getProfile() {
    const { data } = await apiClient.get('/users/me');
    return data;
  },

  async updateProfile(payload: { fullName?: string; title?: string; username?: string }) {
    const { data } = await apiClient.patch('/users/me', payload);
    return data;
  },

  async updatePreferences(payload: { theme?: 'light' | 'dark'; colorMode?: string }) {
    const { data } = await apiClient.patch('/users/me/preferences', payload);
    return data;
  },
};
```

### `frontend/services/workspace.service.ts`
```typescript
import { apiClient } from '@/lib/api-client';

export const workspaceService = {
  async getWorkspaces() {
    const { data } = await apiClient.get('/workspaces');
    return data;
  },

  async createWorkspace(name: string) {
    const { data } = await apiClient.post('/workspaces', { name });
    return data;
  },

  async leaveWorkspace(workspaceId: string) {
    const { data } = await apiClient.post(`/workspaces/${workspaceId}/leave`);
    return data;
  },

  async getMembers(workspaceId: string, search?: string) {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}/members`, { params: { q: search } });
    return data;
  },

  async addMember(workspaceId: string, payload: { userId: string; role: string }) {
    const { data } = await apiClient.post(`/workspaces/${workspaceId}/members`, payload);
    return data;
  },

  async updateMemberRole(workspaceId: string, memberId: string, role: string) {
    const { data } = await apiClient.patch(`/workspaces/${workspaceId}/members/${memberId}`, { role });
    return data;
  },

  async removeMember(workspaceId: string, memberId: string) {
    const { data } = await apiClient.delete(`/workspaces/${workspaceId}/members/${memberId}`);
    return data;
  },
};
```

### `frontend/services/team.service.ts`
```typescript
import { apiClient } from '@/lib/api-client';

export const teamService = {
  async getTeams(workspaceId: string) {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}/teams`);
    return data;
  },

  async createTeam(workspaceId: string, name: string, description?: string) {
    const { data } = await apiClient.post(`/workspaces/${workspaceId}/teams`, { name, description });
    return data;
  },
};
```

### `frontend/services/label.service.ts`
```typescript
import { apiClient } from '@/lib/api-client';

export const labelService = {
  async getLabels(workspaceId: string) {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}/labels`);
    return data;
  },

  async createLabel(workspaceId: string, name: string, color: string) {
    const { data } = await apiClient.post(`/workspaces/${workspaceId}/labels`, { name, color });
    return data;
  },
};
```

### `frontend/services/project.service.ts`
```typescript
import { apiClient } from '@/lib/api-client';

export const projectService = {
  async getProjects(workspaceId: string, params?: any) {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}/projects`, { params });
    return data;
  },

  async getFilterOptions(workspaceId: string) {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}/projects/filters`);
    return data;
  },

  async createProject(workspaceId: string, payload: any) {
    const { data } = await apiClient.post(`/workspaces/${workspaceId}/projects`, payload);
    return data;
  },

  async updateProject(workspaceId: string, projectId: string, payload: any) {
    const { data } = await apiClient.patch(`/workspaces/${workspaceId}/projects/${projectId}`, payload);
    return data;
  },

  async updateProjectStatus(workspaceId: string, projectId: string, status: string) {
    const { data } = await apiClient.patch(`/workspaces/${workspaceId}/projects/${projectId}/status`, { status });
    return data;
  },

  async updateProjectPosition(workspaceId: string, projectId: string, position: number) {
    const { data } = await apiClient.patch(`/workspaces/${workspaceId}/projects/${projectId}/position`, { position });
    return data;
  },

  async deleteProject(workspaceId: string, projectId: string) {
    const { data } = await apiClient.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
    return data;
  },
};
```

### `frontend/services/task.service.ts`
```typescript
import { apiClient } from '@/lib/api-client';

export const taskService = {
  async getTasks(workspaceId: string, params?: any) {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}/tasks`, { params });
    return data;
  },

  async createTask(workspaceId: string, payload: any) {
    const { data } = await apiClient.post(`/workspaces/${workspaceId}/tasks`, payload);
    return data;
  },

  async updateTaskStatus(workspaceId: string, taskId: string, status: string) {
    const { data } = await apiClient.patch(`/workspaces/${workspaceId}/tasks/${taskId}/status`, { status });
    return data;
  },

  async updateTaskPosition(workspaceId: string, taskId: string, position: number) {
    const { data } = await apiClient.patch(`/workspaces/${workspaceId}/tasks/${taskId}/position`, { position });
    return data;
  },

  async deleteTask(workspaceId: string, taskId: string) {
    const { data } = await apiClient.delete(`/workspaces/${workspaceId}/tasks/${taskId}`);
    return data;
  },
};
```

### `frontend/services/preference.service.ts`
```typescript
import { apiClient } from '@/lib/api-client';

export const preferenceService = {
  async getViewPreference(workspaceId: string, entityType: 'PROJECT' | 'TASK' = 'PROJECT') {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}/view-preferences`, { params: { entityType } });
    return data;
  },

  async updateViewPreference(workspaceId: string, payload: { entityType: 'PROJECT' | 'TASK'; viewType?: 'LIST' | 'BOARD'; visibleFields?: string[] }) {
    const { data } = await apiClient.put(`/workspaces/${workspaceId}/view-preferences`, payload);
    return data;
  },
};
```

---

## 5. Component-by-Component Dynamic Integration Guide

### 1. `components/Sidebar.tsx`
- **Current State**: Uses static workspace names, hardcoded team list, and dummy user info.
- **Dynamic Conversion**:
  - Consume `useWorkspace()` to map real user workspaces in the workspace dropdown switcher.
  - Call `teamService.getTeams(activeWorkspace.id)` to dynamically render workspace teams.
  - Render actual authenticated user details (`fullName`, `username`, `avatarUrl`, `email`) from `useUser()`.
  - Trigger `AddProjectModal` dynamically passing the `activeWorkspace.id`.

### 2. `components/Navbar.tsx`
- **Current State**: Hardcoded search box, static notification count, static theme toggle.
- **Dynamic Conversion**:
  - Bind search input `onChange` to `ProjectContext.setSearchQuery(value)` to execute dynamic backend queries (`GET /projects?search=...`).
  - Connect theme & accent color mode selector to `ThemeContext`, calling `userService.updatePreferences({ theme, colorMode })`.
  - Display active workspace name dynamically from `WorkspaceContext`.

### 3. `components/TaskHeader.tsx` (Project Header & Toolbar)
- **Current State**: Static view toggle buttons (`List` vs `Board`), hardcoded filter dropdown values, dummy field checkboxes.
- **Dynamic Conversion**:
  - **View Switcher**: Bind active view state (`LIST` vs `BOARD`) to `preferenceService.updateViewPreference(workspaceId, { entityType: 'PROJECT', viewType })`.
  - **Filter Menus**: Fetch filter options dynamically from `projectService.getFilterOptions(workspaceId)`. Populate dropdowns with real workspace members, teams, labels, statuses (`PLANNED`, `IN_PROGRESS`, `COMPLETED`), and priorities (`URGENT`, `HIGH`, `MEDIUM`, `LOW`, `NONE`).
  - **FieldsMenu**: Bind checked fields array to `preferenceService.updateViewPreference(workspaceId, { entityType: 'PROJECT', visibleFields })`.

### 4. `components/FieldsMenu.tsx`
- **Current State**: Local `useState` holding static boolean flags for columns (`priority`, `members`, `dueDate`, etc.).
- **Dynamic Conversion**:
  - Fetch stored `visibleFields` on mount via `preferenceService.getViewPreference(workspaceId, 'PROJECT')`.
  - When a user checks/unchecks a column, persist the array instantly to NestJS via `preferenceService.updateViewPreference(...)`.

### 5. `components/ListView.tsx` & `components/KanbanBoard.tsx`
- **Current State**: Hardcoded array of project cards/rows.
- **Dynamic Conversion**:
  - Consume `ProjectContext` which fires `projectService.getProjects(workspaceId, { search, status, priority, memberId, teamId, labelId, dueDate, page, limit })`.
  - **Kanban Board Drag-and-Drop**: On `onDragEnd`, optimistically update local column arrays, then invoke `projectService.updateProjectStatus(workspaceId, projectId, newStatus)` and `projectService.updateProjectPosition(workspaceId, projectId, newPosition)`.
  - **Inline Edits**: Clicking a status badge in List View invokes `projectService.updateProjectStatus(...)` and re-fetches or updates state dynamically.

### 6. `components/AddProjectModal.tsx` & `components/AddTaskModal.tsx`
- **Current State**: Hardcoded reporter, team, and member dropdown options.
- **Dynamic Conversion**:
  - On open, call `projectService.getFilterOptions(workspaceId)` to populate assignees, teams, and labels dynamically.
  - On submit, post to `projectService.createProject(workspaceId, formPayload)`.
  - On success, close modal and trigger `ProjectContext.refreshProjects()`.

### 7. `app/profile/page.tsx`
- **Current State**: Hardcoded form inputs (`Mandira Datta`, `Software Engineer`, `@mandiradatta`) and static workspace card list.
- **Dynamic Conversion**:
  - Populate inputs from `useUser()`.
  - Handle inline input saves by invoking `userService.updateProfile({ fullName, title, username })`.
  - Fetch real user memberships via `workspaceService.getWorkspaces()`.
  - Handle "Leave Workspace" button by invoking `workspaceService.leaveWorkspace(workspaceId)`.

### 8. `app/login/page.tsx` & `app/register/page.tsx`
- **Current State**: Mock form submission redirecting directly to `/dashboard`.
- **Dynamic Conversion**:
  - Connect form submission to `authService.login()` or `authService.register()`.
  - Save `accessToken` and `refreshToken` in `localStorage`.
  - Re-fetch `user` in `UserContext` and programmatically route to `/dashboard`.

---

## 6. Verification & Zero-Mock Audit Checklist

Before declaring the integration complete, verify that every item below passes:

- [x] No `MOCK_DATA` constants remain in any file under `frontend/components/` or `frontend/app/`.
- [x] Registering a new account creates a real user in `dev.db` and auto-generates their personal workspace.
- [x] Changing profile full name or title in `/profile` updates SQLite and reflects immediately across the Sidebar and Navbar.
- [x] Creating a new project in `AddProjectModal` persists to the backend database and appears immediately in List/Board views.
- [x] Dragging a project card to "IN_PROGRESS" in Kanban View updates its status in SQLite.
- [x] Searching text in `Navbar` sends live queries to `GET /projects?search=...` and updates the board.
- [x] Toggling column visibility in `FieldsMenu` saves preferences to NestJS (`user_view_preferences` table) and survives page reloads.

---

## 7. Execution Steps for Local Testing

1. **Start NestJS Backend (Port 4000)**:
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start Next.js Frontend (Port 3000)**:
   ```bash
   cd frontend
   npm run dev
   ```
