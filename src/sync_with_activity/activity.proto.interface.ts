import { Observable } from 'rxjs';

export interface ActivityService {
  findOne: (data: ActivityById) => Observable<Activity>;
  findMany(data: FindManyParams): Observable<Activity>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FindManyParams {}

export interface ActivityById {
  id: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  target_date_iso_string: string;
  max_participants: number;
  require_line: boolean;
  require_discord: boolean;
  tag: string;
  location?: string;

  joined_user_ids?: string[];
  pending_user_ids?: string[];
}
