import { z } from 'zod';

export const UserRegisterSchema = z
  .object({
    email: z.email('E-mail inválido').nonempty('E-mail é obrigatório'),
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
      .regex(
        /[^A-Za-z0-9]/,
        'A senha deve conter pelo menos um símbolo (ex: !@#$%)',
      )
      .nonempty('Senha é obrigatória'),
    confirmPassword: z.string().nonempty('Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export interface IUserRegister {
  email: string;
  password: string;
  confirmPassword: string;
}
