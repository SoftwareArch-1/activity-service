import * as z from 'nestjs-zod/z';

export const ActivityModel = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  ownerId: z.string(),
  targetDate: z.preprocess((arg) => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
  }, z.date()),
  maxParticipants: z.number().int(),
  requireLine: z.boolean(),
  requireDiscord: z.boolean(),
  tag: z.string(),
  location: z.string().nullish(),
  joinedUserIds: z.preprocess((val) => val ?? [], z.array(z.string())),
  pendingUserIds: z.preprocess((val) => val ?? [], z.array(z.string())),
});
