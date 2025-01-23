import { Controller, Get, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { TrafficService } from './traffic.service';

@Controller('traffic')
export class TrafficController {
  private readonly logger = new Logger(TrafficController.name);

  constructor(private readonly trafficService: TrafficService) {}

  /**
   * Endpoint to trigger traffic data processing
   */
  @Get('process')
  async processTrafficData(): Promise<{ message: string }> {
    this.logger.log('Traffic data processing initiated...');
    try {
      await this.trafficService.processTrafficData();
      return { message: 'Traffic data processing completed successfully' };
    } catch (error) {
      this.logger.error('Error occurred while processing traffic data', error.stack);
      throw new HttpException(
        { message: 'Error occurred while processing traffic data', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
