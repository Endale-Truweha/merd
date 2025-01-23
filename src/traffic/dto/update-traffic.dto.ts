import { PartialType } from '@nestjs/mapped-types';
import { CreateTrafficDto } from './create-traffic.dto';

export class UpdateTrafficDto extends PartialType(CreateTrafficDto) {}
