import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma/prisma.service';
import { Sprint } from '@prisma/client';

@Injectable()
export class SprintsService {
    constructor(private prisma: PrismaService) { }

    async createSprint(name: string, startDate: Date, endDate: Date, userId: string): Promise<Sprint> {
        return this.prisma.sprint.create({
            data: {
                name,
                startDate,
                endDate,
                userId,
            },
        });
    }

    async getSprints(userId: number): Promise<Sprint[]> {
        return this.prisma.sprint.findMany({
            where: { userId: String(userId) },
        });
    }

    async updateSprint(id: string, data: Partial<Sprint>): Promise<Sprint> {
        return this.prisma.sprint.update({
            where: { id },
            data,
        });
    }

    async deleteSprint(id: string): Promise<Sprint> {
        return this.prisma.sprint.delete({
            where: { id },
        });
    }
}
