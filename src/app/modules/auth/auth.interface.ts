import z from "zod";
import { loginSchema, registerOrLoginUserSchema } from "./auth.validation";


export type TRegisterOrLoginUserPayload = z.infer<typeof registerOrLoginUserSchema>;
export type TLoginUserPayload = z.infer<typeof loginSchema>;