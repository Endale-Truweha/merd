import { Injectable } from '@nestjs/common';
import { CreateUtilizationDto } from './dto/create-utilization.dto';
import { UpdateUtilizationDto } from './dto/update-utilization.dto';

@Injectable()
export class UtilizationService {
  create(createUtilizationDto: CreateUtilizationDto) {
    return 'This action adds a new utilization';
  }

  findAll() {
    return `This action returns all utilization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} utilization`;
  }

  update(id: number, updateUtilizationDto: UpdateUtilizationDto) {
    return `This action updates a #${id} utilization`;
  }

  remove(id: number) {
    return `This action removes a #${id} utilization`;
  }
}
