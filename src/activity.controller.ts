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
  async create(dto: CreateActivity) {
    const act = await prisma.activity.create({
      data: {
        ...dto,
        targetDate: new Date(dto.targetDateIsoString),
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
