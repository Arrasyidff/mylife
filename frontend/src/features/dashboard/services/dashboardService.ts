import { api } from '@/lib/api';
import type { DashboardApiResponse } from '../types';

export async function getDashboard(month?: number, year?: number): Promise<DashboardApiResponse> {
  return api.get<DashboardApiResponse>('/dashboard', { params: { month, year } });
}
