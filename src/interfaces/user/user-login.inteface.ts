import { z } from 'zod';

export const UserLoginSchema = z.object({
  email: z.email('E-mail inválido').nonempty('E-mail é obrigatório'),
  password: z.string(),
});

export interface IUserLogin {
  email: string;
  password: string;
}
