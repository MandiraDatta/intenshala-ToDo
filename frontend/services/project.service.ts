import { apiClient } from '@/lib/api-client';

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  memberId?: string;
  teamId?: string;
  labelId?: string;
  reporterId?: string;
  dueDate?: string;
}

export const projectService = {
  async getProjects(workspaceId: string, params?: ProjectQueryParams) {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}/projects`, { params });
    return data;
  },

  async getProjectById(workspaceId: string, projectId: string) {
    const { data } = await apiClient.get(`/workspaces/${workspaceId}/projects/${projectId}`);
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
