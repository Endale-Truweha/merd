import { Module } from '@nestjs/common';
import { UtilizationService } from './utilization.service';
import { UtilizationController } from './utilization.controller';

@Module({
  controllers: [UtilizationController],
  providers: [UtilizationService],
})
export class UtilizationModule {}
