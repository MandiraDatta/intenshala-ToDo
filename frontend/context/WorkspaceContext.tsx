"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { workspaceService } from "@/services/workspace.service";
import { authService } from "@/services/auth.service";

export interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  avatarUrl?: string;
  role: string;
  memberCount: number;
  isOwner: boolean;
}

interface WorkspaceContextType {
  workspaces: WorkspaceItem[];
  activeWorkspace: WorkspaceItem | null;
  /** Current user's role in the active workspace: 'OWNER' | 'ADMIN' | 'MEMBER' */
  myRole: 'OWNER' | 'ADMIN' | 'MEMBER' | null;
  loading: boolean;
  setActiveWorkspace: (workspace: WorkspaceItem) => void;
  refreshWorkspaces: () => Promise<void>;
  createWorkspace: (name: string) => Promise<WorkspaceItem>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState<WorkspaceItem | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = useCallback(async () => {
    let token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    // Auto-authenticate guest session if no token exists yet
    if (!token) {
      try {
        const guestId = Math.floor(Math.random() * 100000);
        await authService.register({
          email: `guest_${guestId}@pyramid.app`,
          password: 'GuestPassword123!',
          fullName: 'Guest User',
          username: `guest_${guestId}`,
        });
        token = localStorage.getItem('accessToken');
      } catch (err) {
        console.error("Auto guest session initialization failed", err);
      }
    }

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await workspaceService.getWorkspaces();
      setWorkspaces(data);
      if (data && data.length > 0) {
        const savedId = localStorage.getItem("active_workspace_id");
        const found = data.find((w: WorkspaceItem) => w.id === savedId);
        const selected = found || data[0];
        setActiveWorkspaceState(selected);
        localStorage.setItem("active_workspace_id", selected.id);
      }
    } catch (e) {
      console.error("Failed to fetch workspaces from server", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const setActiveWorkspace = (workspace: WorkspaceItem) => {
    setActiveWorkspaceState(workspace);
    localStorage.setItem("active_workspace_id", workspace.id);
  };

  const createWorkspace = async (name: string) => {
    const created = await workspaceService.createWorkspace(name);
    await fetchWorkspaces();
    return created;
  };

  const myRole = (activeWorkspace?.role ?? null) as 'OWNER' | 'ADMIN' | 'MEMBER' | null;

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        myRole,
        loading,
        setActiveWorkspace,
        refreshWorkspaces: fetchWorkspaces,
        createWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
