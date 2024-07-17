import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { Sprint } from '@prisma/client';

@Controller('sprints')
export class SprintsController {
    constructor(private sprintsService: SprintsService) { }

    @Post()
    async createSprint(@Body() body: { name: string; startDate: Date; endDate: Date; userId: string }) {
        const { name, startDate, endDate, userId } = body;
        return this.sprintsService.createSprint(name, startDate, endDate, userId);
    }

    @Get(':userId')
    async getSprints(@Param('userId') userId: number): Promise<Sprint[]> {
        return this.sprintsService.getSprints(userId);
    }

    @Put(':id')
    async updateSprint(@Param('id') id: string, @Body() body: any) {
        return this.sprintsService.updateSprint(id, body);
    }

    @Delete(':id')
    async deleteSprint(@Param('id') id: string) {
        return this.sprintsService.deleteSprint(id);
    }
}
