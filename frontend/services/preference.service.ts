import { apiClient } from '@/lib/api-client';

export const preferenceService = {
  async getViewPreference(workspaceId: string, entityType: 'PROJECT' | 'TASK' = 'PROJECT') {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}/view-preferences`, {
      params: { entityType },
    });
    return data;
  },

  async updateViewPreference(
    workspaceId: string,
    payload: { entityType: 'PROJECT' | 'TASK'; viewType?: 'LIST' | 'BOARD'; visibleFields?: string[] }
  ) {
    const { data } = await apiClient.put(`/workspaces/${workspaceId}/view-preferences`, payload);
    return data;
  },
};
