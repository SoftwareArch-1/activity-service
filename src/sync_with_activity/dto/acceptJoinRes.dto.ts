import { z } from 'nestjs-zod/z';

export const acceptJoinResDtoSchema = z.object({
  joinedUserIds: z.string().array(),
  pendingUserIds: z.string().array(),
});
