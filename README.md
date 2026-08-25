# 🔺 Pyramid - Dynamic Kanban Task & Project Management System

Pyramid is a modern, enterprise-grade task and project management application built with **Next.js 16 (Turbopack)**, **React 19**, **NestJS**, **Prisma ORM**, and **Tailwind CSS**. It features full multi-workspace isolation, Role-Based Access Control (RBAC), Google OAuth 2.0, dynamic Kanban board/list views, interactive subtask creation modals, customizable theme/color mode tokens, and automated email invitations.

---

## 🌟 Key Features

### 🔐 Authentication & Access Control
- **Google OAuth 2.0 & Guest Login**: Seamless one-click authentication using Google OAuth or instant Guest access.
- **JWT Session Security**: Secure access token and refresh token rotation.
- **Role-Based Access Control (RBAC)**: Enforces `OWNER`, `ADMIN`, and `MEMBER` workspace permission levels across all actions and UI views.

### 🏢 Multi-Tenant Workspace Management
- **Organization & Workspace Hierarchy**: `Workspace ➔ Project ➔ Task ➔ Subtasks`.
- **Dynamic Workspace Switcher**: Seamlessly create, switch between, and manage multiple team workspaces.
- **Email Invites**: Invite team members via direct email or generated invitation tokens (powered by Resend API).

### 📋 Interactive Kanban Board & Task System
- **Dual View Modes**: Switch between dynamic **Kanban Board** grid view and **List Accordion** view.
- **Popup Subtask Modal**: Create subtasks with title, priority (`Low`, `Medium`, `High`, `Urgent`), assignee, and due date pickers inside a polished dialog overlay.
- **Dynamic Header & Auto-Sync**: Instant URL state binding (`/task?id=...&title=...`) ensuring zero header title flicker and background auto-save on blur.
- **Drag-and-Drop Column Organization**: Group tasks by `To Do`, `In Progress`, `Completed`, `On Hold`, and `Backlog`.

### 🎨 Design System & Customization
- **Theme Support**: Independent Light and Dark mode themes.
- **Color Accent Modes**: Centralized custom CSS color mode tokens (`Amber`, `Blue`, `Pink`, `Rose`, `Emerald`, `Black`).
- **Modern Typography & Micro-Animations**: Smooth glassmorphic backdrop overlays and interactive transitions.
- **Icon Libraries**: Styled using Lucide React, Phosphor Icons (`@phosphor-icons/react`), Remix Icons (`@remixicon/react`), and Tabler Icons.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 16.3](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: Lucide React, Phosphor Icons, Remix Icons, Tabler Icons
- **HTTP Client**: Axios with centralized request/response interceptors

### Backend
- **Framework**: [NestJS](https://nestjs.com/)
- **ORM & Database**: [Prisma ORM](https://www.prisma.io/) with PostgreSQL / SQLite
- **Authentication**: Passport JWT, Google OAuth 2.0 Strategy
- **Email Service**: Resend API (`@resend/node`)
- **Validation**: `class-validator`, `class-transformer`

---

## 📁 Repository Structure

```text
internshala-project/
├── backend/                  # NestJS API Server
│   ├── prisma/               # Database schema & migrations
│   ├── src/
│   │   ├── auth/             # Authentication & Google OAuth controller/services
│   │   ├── users/            # User profile management
│   │   ├── workspaces/       # Workspace & membership management
│   │   ├── projects/         # Project management
│   │   ├── tasks/            # Tasks & subtasks management
│   │   ├── invites/          # Workspace email invitations
│   │   └── common/           # RBAC Guards, Decorators, and Filters
│   └── .env                  # Backend environment variables
│
├── frontend/                 # Next.js Frontend Web Application
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Login & Google OAuth landing page
│   │   ├── dashboard/        # Main Kanban Board & List dashboard
│   │   ├── task/             # Dynamic Task Detail page & subtask modal
│   │   ├── projects/         # Project overview page
│   │   └── profile/          # User profile & workspace settings page
│   ├── components/           # UI components (KanbanColumn, TaskCard, Sidebar, Navbar)
│   ├── context/              # React Context (UserContext, WorkspaceContext, ThemeContext)
│   ├── services/             # API Service Clients (auth, task, workspace, project)
│   └── .env.local            # Frontend environment variables
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js `v18.x` or higher
- npm `v9.x` or higher





### 2. Installation & Running Locally

#### Step A: Start Backend Server
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```
*The NestJS backend will start on **`http://localhost:4000/api/v1`**.*

#### Step B: Start Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
*The Next.js frontend application will start on **`http://localhost:3000`**.*



---

## 👤 Profile Page - Added Features & Key Modifications

Compared to the baseline Figma specification, the following functional enhancements were implemented on the Profile & Settings page (`app/profile/page.tsx`):

1. **Workspace Member Invitation Integration**:
   - Integrated an interactive **Invite Members** modal trigger directly within the workspace settings view to send email invitations and token links.

2. **Workspace Departure & Role-Based Actions**:
   - Functional **Leave Workspace** modal in the workspace Danger Zone allowing non-owner members to safely depart a workspace with confirmation prompts and RBAC role validation.

---

## 📜 License
This project is created for internal project & assessment specifications. All rights reserved.
