import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ActivityModule } from './activity.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ActivityModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'sync_with_activity', // ['hero', 'hero2']
        protoPath: join(__dirname, './sync_with_activity/activity.proto'), // ['./hero/hero.proto', './hero/hero2.proto']
        loader: { keepCase: true },
      },
    },
  );
  await app.listen();
}
bootstrap();
