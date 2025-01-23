import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilizationModule } from './utilization/utilization.module';
import { PrismaModule } from './prisma/prisma.module';
import { TrafficModule } from './traffic/traffic.module';

@Module({
  imports: [UtilizationModule, PrismaModule, TrafficModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
