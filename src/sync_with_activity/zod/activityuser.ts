import * as z from 'nestjs-zod/z';

export const ActivityUserModel = z.object({
  id: z.string(),
  joinedOtherActivityIds: z.string().array(),
  pendingOtherActivityIds: z.string().array(),
});
