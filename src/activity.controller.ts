import { Observable } from 'rxjs';

import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

import { prisma } from './prismaClient';
import {
  AcceptJoin,
  ActivityById,
  CreateActivity,
  DeclineJoin,
  FindJoinedActivities,
  FindOwnedActivities,
  JoinActivity,
} from './sync_with_activity/activity.proto.interface';
import { acceptJoinResDtoSchema } from './sync_with_activity/dto/acceptJoinRes.dto';
import { z } from 'nestjs-zod/z';

@Controller()
export class ActivityService {
  @GrpcMethod()
  async create({ ownerId, targetDate, ...rest }: CreateActivity) {
    // const u = await prisma.activityUser.findUnique({
    //   where: {
    //     id: ownerId,
    //   },
    // });
    // if (!u) {
    //   await prisma.activityUser.create({
    //     data: {
    //       id: ownerId,
    //     },
    //   });
    // }

    const dateParsed = z
      .preprocess((val) => new Date(val as any), z.date())
      .safeParse(targetDate);

    if (!dateParsed.success) {
      throw new RpcException('Invalid ISO date string, got ' + targetDate);
    }

    const act = await prisma.activity.create({
      data: {
        ...rest,
        targetDate: dateParsed.data,
        owner: {
          connectOrCreate: {
            create: {
              id: ownerId,
            },
            where: {
              id: ownerId,
            },
          },
        },
      },
    });
    return act;
  }

  @GrpcMethod()
  async findOwnedActivities({ ownerId }: FindOwnedActivities) {
    const owner = await prisma.activityUser.findUnique({
      where: {
        id: ownerId,
      },
      select: {
        ownedActivities: true,
      },
    });

    if (owner === null) {
      throw new RpcException('User not found');
    }

    return new Observable((observer) => {
      owner.ownedActivities // If this is an empty array, gRPC won't return anything (undefined). This needs to be handle at the gateway.
        .map((a) => {
          observer.next(a);
        });
      observer.complete();
    });
  }

  @GrpcMethod()
  async findJoinedActivities({ joinerId }: FindJoinedActivities) {
    const joiner = await prisma.activityUser.findUnique({
      where: {
        id: joinerId,
      },
      select: {
        joinedOtherActivities: true,
      },
    });

    if (joiner === null) {
      throw new RpcException('User not found');
    }

    return new Observable((observer) => {
      joiner.joinedOtherActivities // If this is an empty array, gRPC won't return anything (undefined). This needs to be handle at the gateway.
        .map((a) => {
          observer.next(a);
        });
      observer.complete();
    });
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
  async acceptJoin({ activityId, joinerId }: AcceptJoin) {
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
    if (!act.pendingUserIds.includes(joinerId)) {
      throw new RpcException('Joiner not in pending list');
    }
    if (act.joinedUserIds.includes(joinerId)) {
      throw new RpcException('Joiner already joined');
    }
    if (act.ownerId === joinerId) {
      throw new RpcException('Joiner is owner');
    }

    act = await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        pendingUsers: {
          disconnect: {
            id: joinerId,
          },
        },
        joinedUsers: {
          connect: {
            id: joinerId,
          },
        },
      },
    });

    return acceptJoinResDtoSchema.parse(act);
  }

  @GrpcMethod()
  async declineJoin({ activityId, joinerId }: DeclineJoin) {
    const act = await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        pendingUsers: {
          disconnect: {
            id: joinerId,
          },
        },
      },
    });
    return act;
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
    if (act.pendingUserIds.includes(joinerId)) {
      throw new RpcException('Joiner already in pending list');
    }
    if (act.joinedUserIds.includes(joinerId)) {
      throw new RpcException('Joiner already joined');
    }
    if (act.ownerId === joinerId) {
      throw new RpcException('Joiner is owner');
    }
    act = await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        pendingUsers: {
          connectOrCreate: {
            where: {
              id: joinerId,
            },
            create: {
              id: joinerId,
            },
          },
        },
      },
    });

    return act;
  }
}
