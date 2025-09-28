import { z } from 'zod';

export const NewPlanningRoomSchema = z.object({
  title: z.string().nonempty({ error: 'Nome da sala é obrigatório' }),
});

export type NewPlanningRoom = z.infer<typeof NewPlanningRoomSchema>;

export const RedirectSchema = z.object({
  id: z
    .uuid({ error: 'Formato deve ser UUID' })
    .nonempty({ error: 'Campo obrigatório' }),
});
