import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
	constructor(private readonly seedService: SeedService) {}

	@Get()
	@ApiOperation({ summary: 'Seed database with sample data' })
	@ApiResponse({
		status: 201,
		description: 'Database seeded successfully',
		schema: {
			type: 'object',
			properties: {
				message: { type: 'string' },
				stats: {
					type: 'object',
					properties: {
						users: { type: 'number' },
						events: { type: 'number' },
					},
				},
			},
		},
	})
	async seedDatabase() {
		return await this.seedService.seedDatabase();
	}
}
