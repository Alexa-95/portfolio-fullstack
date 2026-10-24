import { z } from 'zod';
export const contactSchema = z.strictObject({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().pipe(z.email().max(254)),
  message: z.string().trim().min(10).max(3000),
  // Honeypot: checked in the route so bots get a silent "success".
  company: z.string().max(500),
  token: z.string().min(1).max(2048),
});
export type ContactPayload = z.infer<typeof contactSchema>;
