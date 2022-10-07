import { Observable } from 'rxjs';

import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { prisma } from './prismaClient';
import {
  ActivityById,
  CreateActivity,
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
    return act;
  }

  @GrpcMethod()
  async findOne(data: ActivityById) {
    const act = await prisma.activity.findUnique({
      where: {
        id: data.id,
      },
    });
    return act;
  }

  @GrpcMethod()
  async findMany() {
    const acts = await prisma.activity.findMany();
    const ob = new Observable((observer) => {
      acts.map(observer.next);
      observer.complete();
    });
    return ob;
  }
}
