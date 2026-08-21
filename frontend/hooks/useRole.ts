import { useWorkspace } from "@/context/WorkspaceContext";
import { useUser } from "@/context/UserContext";

/**
 * Role-based access control hook.
 * Derives permissions from the current user's workspace role.
 *
 * Roles: OWNER > ADMIN > MEMBER
 */
export function useRole() {
  const { myRole } = useWorkspace();
  const { user } = useUser();

  const isOwner = myRole === "OWNER";
  const isAdmin = myRole === "ADMIN" || myRole === "OWNER";
  const isMember = myRole === "MEMBER";

  return {
    myRole,
    isOwner,
    isAdmin,
    isMember,

    /** Can create/edit/delete projects */
    canManageProjects: true,

    /** Can invite new members to the workspace */
    canInviteMembers: isOwner || isAdmin,

    /** Can create tasks (all roles, but backend may enforce project membership) */
    canCreateTasks: true,

    /**
     * Can delete a specific task.
     * OWNER/ADMIN can delete any task.
     * MEMBER can only delete their own tasks.
     */
    canDeleteTask: (taskCreatedById?: string) =>
      isOwner || isAdmin || (!!taskCreatedById && taskCreatedById === user?.id),

    /**
     * Can edit a specific task.
     * OWNER/ADMIN can edit any task.
     * MEMBER can only edit their own tasks.
     */
    canEditTask: (taskCreatedById?: string) =>
      isOwner || isAdmin || (!!taskCreatedById && taskCreatedById === user?.id),

    /**
     * Can delete a specific project.
     * OWNER can delete any project.
     * ADMIN can only delete projects they created.
     * MEMBER cannot delete projects.
     */
    canDeleteProject: (projectCreatedById?: string) =>
      isOwner || (isAdmin && !!projectCreatedById && projectCreatedById === user?.id),
  };
}
