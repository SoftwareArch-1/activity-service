import type { Observable } from 'rxjs';
import { z } from 'nestjs-zod/z';
import { ActivityModel } from './zod';

export interface ActivityService {
  create: (data: CreateActivity) => Observable<Activity>;
  findOne: (data: ActivityById) => Observable<Activity>;
  findMany(data: FindManyParams): Observable<Activity>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FindManyParams {}

export interface ActivityById {
  id: string;
}

export const createActivitySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  owner_id: z.string().cuid(),
  target_date_iso_string: z.string(),
  max_participants: z.number(),
  require_line: z.boolean(),
  require_discord: z.boolean(),
  tag: z.string(),
  location: z.string().nullable(),
});

export type CreateActivity = z.infer<typeof createActivitySchema>;

export type Activity = z.infer<typeof ActivityModel>;
