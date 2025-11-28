import { JoinedProviderEnum } from '@prisma/client';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});


export const registerOrLoginUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  image: z.string().url('Invalid image URL').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  provider: z.enum(JoinedProviderEnum).optional(),
  providerId: z.string().optional(),
}).superRefine((data, ctx) => {
  // If no provider is present, the password field MUST have a value
  if (!data.provider && !data.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password is required when no provider is specified',
      path: ['password'], // Associates the error with the password field
    });
  }
});


export const AuthsValidations = { loginSchema, registerOrLoginUserSchema };
