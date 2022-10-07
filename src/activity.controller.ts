import { Observable, toArray } from 'rxjs';

import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { prisma } from './prismaClient';
import {
  Activity,
  ActivityById,
  CreateActivity,
  FindManyParams,
} from './sync_with_activity/activity.proto.interface';

@Controller()
export class ActivityService {
  @GrpcMethod()
  async create({
    description,
    location,
    max_participants,
    name,
    owner_id,
    require_discord,
    require_line,
    tag,
    target_date_iso_string,
  }: CreateActivity) {
    const act = await prisma.activity.create({
      data: {
        description,
        location,
        maxParticipants: max_participants,
        name,
        ownerId: owner_id,
        requireDiscord: require_discord,
        requireLine: require_line,
        tag,
        targetDate: new Date(target_date_iso_string),
      },
    });
    return new Observable<typeof act>((observer) => {
      observer.next(act);
      observer.complete();
    });
  }

  @GrpcMethod()
  async findOne(
    data: ActivityById,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    const act = await prisma.activity.findUnique({
      where: {
        id: data.id,
      },
    });
    return new Observable<typeof act>((observer) => {
      observer.next(act);
      observer.complete();
    });
  }

  @GrpcMethod()
  async findMany(data: FindManyParams, metadata: Metadata) {
    const acts = await prisma.activity.findMany();
    const ob = new Observable<Activity>((observer) => {
      acts.map(observer.next);
      observer.complete();
    });
    return ob.pipe(toArray());
  }
}
