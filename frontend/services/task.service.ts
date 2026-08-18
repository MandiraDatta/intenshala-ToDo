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
