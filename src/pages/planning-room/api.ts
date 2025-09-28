import api from '../../settings/axios.ts';
import type { PlanningRoomResponse } from './model.ts';

const BASE_URL = import.meta.env.VITE_API_URL;

export async function findPlanningRoomById(
  id: string,
): Promise<PlanningRoomResponse> {
  const { data } = await api.get(`${BASE_URL}/api/planning-rooms/${id}`);
  return data;
}
