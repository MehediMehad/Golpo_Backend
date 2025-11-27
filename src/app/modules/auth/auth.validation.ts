import { JoinedProviderEnum } from '@prisma/client';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});


export const registerOrLoginUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  image: z.string().url('Invalid image URL').optional(),
  provider: z.enum(JoinedProviderEnum),
  providerId: z.string(),
});


export const AuthsValidations = { loginSchema, registerOrLoginUserSchema };
