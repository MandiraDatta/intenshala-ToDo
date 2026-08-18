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

  async getWorkspaceDetails(workspaceId: string) {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}`);
    return data;
  },

  async leaveWorkspace(workspaceId: string) {
    const { data } = await apiClient.post(`/workspaces/${workspaceId}/leave`);
    return data;
  },

  async getMembers(workspaceId: string, search?: string) {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}/members`, {
      params: search ? { search } : undefined,
    });
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
