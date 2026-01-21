import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
	constructor(@Inject(User.name) private userModel: Model<User>) {}

	async findAll() {
		return this.userModel.find().select('-password');
	}
}
