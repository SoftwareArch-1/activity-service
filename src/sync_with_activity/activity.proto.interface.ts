import type { Observable } from 'rxjs';
import { z } from 'nestjs-zod/z';
import { ActivityModel } from './zod';

export interface ActivityService {
  create: (data: CreateActivity) => Observable<Activity>;
  findOne: (data: ActivityById) => Observable<Activity>;
  findMany(data: FindManyParams): Observable<Activity>;
  join: (data: JoinActivity) => Observable<Activity>;
  findOwnedActivities: (data: FindOwnedActivities) => Observable<Activity>;
}

export interface FindOwnedActivities {
  ownerId: string;
}

export interface JoinActivity {
  activityId: string;
  joinerId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FindManyParams {}

export interface ActivityById {
  id: string;
}

export const createActivitySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  ownerId: z.string(),
  targetDate: z.string(),
  maxParticipants: z.number(),
  requireLine: z.boolean(),
  requireDiscord: z.boolean(),
  tag: z.string(),
  location: z.string().nullable(),
});

export type CreateActivity = z.infer<typeof createActivitySchema>;

export type Activity = z.infer<typeof ActivityModel>;
