import { z } from 'zod';
export const contactSchema = z.strictObject({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  message: z.string().trim().min(10).max(3000),
  company: z.string().max(0),
  token: z.string().min(1).max(2048),
});
export type ContactPayload = z.infer<typeof contactSchema>;
