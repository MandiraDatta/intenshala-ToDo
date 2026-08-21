import { apiClient } from '@/lib/api-client';

export const inviteService = {
  async sendInvite(workspaceId: string, email: string, role: string = 'MEMBER', taskId?: string, projectId?: string) {
    const { data } = await apiClient.post(`/workspaces/${workspaceId}/invites`, { email, role, taskId, projectId });
    return data;
  },

  async getInvite(token: string) {
    const { data } = await apiClient.get(`/invites/${token}`);
    return data;
  },

  async acceptInvite(token: string) {
    const { data } = await apiClient.post('/invites/accept', { token });
    return data;
  },

  async getWorkspaceMembers(workspaceId: string) {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}/members`);
    return data;
  },

  async getMyPendingInvites() {
    const { data } = await apiClient.get('/invites/pending/me');
    return data;
  },
};
