import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UtilizationService } from './utilization.service';
import { CreateUtilizationDto } from './dto/create-utilization.dto';
import { UpdateUtilizationDto } from './dto/update-utilization.dto';

@Controller('utilization')
export class UtilizationController {
  constructor(private readonly utilizationService: UtilizationService) {}

  @Post()
  create(@Body() createUtilizationDto: CreateUtilizationDto) {
    return this.utilizationService.create(createUtilizationDto);
  }

  @Get()
  findAll() {
    return this.utilizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.utilizationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUtilizationDto: UpdateUtilizationDto) {
    return this.utilizationService.update(+id, updateUtilizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utilizationService.remove(+id);
  }
}
