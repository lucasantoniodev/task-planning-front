import { z } from 'zod';

export const UserProfileSchema = z.object({
  displayName: z.string(),
});

export interface IUserProfile {
  displayName: string;
}
