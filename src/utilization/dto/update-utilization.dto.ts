import { PartialType } from '@nestjs/mapped-types';
import { CreateUtilizationDto } from './create-utilization.dto';

export class UpdateUtilizationDto extends PartialType(CreateUtilizationDto) {}
