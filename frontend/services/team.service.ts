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
