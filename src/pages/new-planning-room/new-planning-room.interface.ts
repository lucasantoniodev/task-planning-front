import { z } from 'zod';

export const NewPlanningRoomSchema = z.object({
  title: z.string().nonempty({ error: 'Nome da sala é obrigatório' }),
});

export type NewPlanningRoom = z.infer<typeof NewPlanningRoomSchema>;

export const NewPlanningRoomResponseSchema = z.object({
  id: z.uuid(),
  title: z.string().nonempty({ error: 'Nome da sala é obrigatório' }),
  ownerId: z.uuid(),
});

export type NewPlanningRoomResponse = z.infer<
  typeof NewPlanningRoomResponseSchema
>;
