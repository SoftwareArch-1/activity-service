import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable, toArray } from 'rxjs';

import {
  Activity,
  ActivityById,
  FindManyParams,
} from './sync_with_activity/activity.proto.interface';

@Controller()
export class ActivityService {
  @GrpcMethod()
  findOne(
    data: ActivityById,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Observable<Activity> {
    return new Observable((observer) => {
      observer.next({
        id: data.id,
        description: 'test',
      });
      observer.complete();
    });
  }

  @GrpcMethod()
  findMany(data: FindManyParams, metadata: Metadata): Observable<Activity[]> {
    const ob = new Observable<Activity>((observer) => {
      observer.next({
        id: 'id',
        description: 'test',
      });
      observer.next({
        id: 'id2',
        description: 'test2',
      });
      observer.complete();
    });
    return ob.pipe(toArray());
  }
}
