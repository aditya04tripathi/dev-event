import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
	constructor(@Inject(User.name) private userModel: Model<User>) {}

	async findAll() {
		return this.userModel.find().select('-password');
	}

	async findById(id: string) {
		return this.userModel.findById(id).select('-password');
	}

	async findAllOrganizers() {
		return this.userModel.find({ roles: 'organizer' }).select('-password');
	}
}
