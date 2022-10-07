import * as z from 'nestjs-zod/z';

export const ActivityModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  description: z.string(),
  ownerId: z.string(),
  targetDate: z.date(),
  maxParticipants: z.number().int(),
  requireLine: z.boolean(),
  requireDiscord: z.boolean(),
  tag: z.string(),
  location: z.string().nullish(),
  joinedUserIds: z.string().array(),
  pendingUserIds: z.string().array(),
});
