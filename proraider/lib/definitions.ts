import { z } from 'zod'

export const SignupSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Mínimo 3 caracteres.' })
    .max(20, { message: 'Máximo 20 caracteres.' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Solo letras, números y guiones bajos.' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Introduce un email válido.' })
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Mínimo 8 caracteres.' })
    .trim(),
})

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Introduce un email válido.' })
    .trim(),
  password: z
    .string()
    .min(1, { message: 'Introduce tu contraseña.' })
    .trim(),
})

export type FormState =
  | {
      errors?: {
        username?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined
