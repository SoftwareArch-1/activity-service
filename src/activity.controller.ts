import { Observable } from 'rxjs';

import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

import { prisma } from './prismaClient';
import {
  ActivityById,
  CreateActivity,
  FindOwnedActivities,
  JoinActivity,
} from './sync_with_activity/activity.proto.interface';

@Controller()
export class ActivityService {
  @GrpcMethod()
  async create(dto: CreateActivity) {
    const act = await prisma.activity.create({
      data: {
        ...dto,
        targetDate: new Date(dto.targetDate),
        joinedUserIds: [dto.ownerId],
      },
    });
    return act;
  }

  @GrpcMethod()
  async findOwnedActivities({ ownerId }: FindOwnedActivities) {
    const acts = await prisma.activityUser.findUnique({
      where: {
        id: ownerId,
      },
      select: {
        ownedActivities: true,
      },
    });

    if (acts === null) {
      throw new RpcException('User not found');
    }

    return acts.ownedActivities; // If this is an empty array, gRPC won't return anything (undefined). This needs to be handle at the gateway.
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
      acts.map((a) => {
        observer.next(a);
      });
      observer.complete();
    });
    return ob;
  }

  @GrpcMethod()
  async join({ activityId, joinerId }: JoinActivity) {
    let act = await prisma.activity.findUnique({
      where: {
        id: activityId,
      },
    });

    if (!act) {
      throw new RpcException('Activity not found');
    }

    if (act.joinedUserIds.length >= act.maxParticipants) {
      throw new RpcException('Maximum participants reached');
    }

    act = await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        joinedUserIds: {
          push: joinerId,
        },
      },
    });

    return act;
  }
}
