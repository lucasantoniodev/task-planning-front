import { z } from 'zod';

export const PlanningRoomResponseSchema = z.object({
  id: z.uuid(),
  title: z.string().nonempty({ error: 'Nome da sala é obrigatório' }),
  ownerId: z.uuid(),
});

export type PlanningRoomResponse = z.infer<typeof PlanningRoomResponseSchema>;
