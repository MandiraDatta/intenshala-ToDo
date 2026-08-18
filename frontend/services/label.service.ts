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
