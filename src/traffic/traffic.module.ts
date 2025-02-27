import { Module } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';

@Module({
  controllers: [TrafficController],
  providers: [TrafficService],
})
export class TrafficModule {}
