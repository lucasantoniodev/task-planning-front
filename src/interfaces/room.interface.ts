import { z } from 'zod';

export const NewRoomSchema = z.object({
  name: z.string(),
});
