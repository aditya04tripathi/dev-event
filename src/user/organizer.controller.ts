import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiWrappedResponse } from 'src/utils/decorators';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('Organizers')
@Controller('organizers')
export class OrganizerController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@ApiOperation({ summary: 'Get all organizers' })
	@ApiWrappedResponse(UserResponseDto, 200, 'List of all organizers', true)
	async getAllOrganizers() {
		return await this.userService.findAllOrganizers();
	}
}
