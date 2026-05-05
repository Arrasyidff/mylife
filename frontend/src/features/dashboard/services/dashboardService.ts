import { api } from '@/lib/api';
import type { DashboardApiResponse } from '../types';

export async function getDashboard(): Promise<DashboardApiResponse> {
  return api.get<DashboardApiResponse>('/dashboard');
}
