import api from '../../settings/axios.ts';
import type { PlanningRoomResponse } from '../planning-room/model.ts';
import type { NewPlanningRoom } from './model.ts';

const BASE_URL = import.meta.env.VITE_API_URL;

export async function createNewRoom(
  request: NewPlanningRoom,
): Promise<PlanningRoomResponse> {
  const { data } = await api.post(`${BASE_URL}/api/planning-rooms`, request);
  return data;
}
