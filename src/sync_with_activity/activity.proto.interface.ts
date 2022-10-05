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
  detail: string;
}
