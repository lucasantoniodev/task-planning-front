import { z } from 'zod';
import { TaskStatusEnum } from './enums/task-status.enum.ts';

export const PlanningRoomResponseSchema = z.object({
  id: z.uuid(),
  title: z.string().nonempty({ error: 'Nome da sala é obrigatório' }),
  ownerId: z.uuid(),
});

export type PlanningRoomResponse = z.infer<typeof PlanningRoomResponseSchema>;

export const TaskSchema = z.object({
  id: z.uuid(),
  description: z.string(),
  points: z.number(),
  status: z.enum(TaskStatusEnum),
  planningRoomId: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;

export const PlayerSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  photoUrl: z.string().optional(),
  joinedAt: z.number(),
});

export type Player = z.infer<typeof PlayerSchema>;

export const TaskStateSchema = z.object({
  id: z.uuid(),
  votes: z.array(
    z.object({
      userId: z.uuid(),
      vote: z.number().default(0),
    }),
  ),
  status: z.enum(TaskStatusEnum),
  players: z.array(PlayerSchema),
});

export type TaskState = z.infer<typeof TaskStateSchema>;
