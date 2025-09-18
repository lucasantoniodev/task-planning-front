import api from '../../settings/axios.ts';
import type {
  NewPlanningRoom,
  NewPlanningRoomResponse,
} from './new-planning-room.interface.ts';

const BASE_URL = import.meta.env.VITE_API_URL;

export async function createNewRoom(
  request: NewPlanningRoom,
): Promise<NewPlanningRoomResponse> {
  const { data } = await api.post(`${BASE_URL}/planning-rooms`, request);
  return data;
}
