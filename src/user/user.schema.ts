import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import argon2 from 'argon2';
import { HydratedModel } from 'src/types';
import { Role } from './enums/role.enum';

@Schema({ timestamps: true })
export class User {
	@ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
	@Prop({ required: true, type: String })
	fullName: string;

	@ApiProperty({ example: 'johndoe', description: 'Unique username' })
	@Prop({ required: true, type: String, unique: true })
	username: string;

	@ApiProperty({
		example: 'john@example.com',
		description: 'Unique email address',
	})
	@Prop({ required: true, type: String, unique: true })
	email: string;

	@ApiProperty({
		example: 'password123',
		description: 'User password',
		writeOnly: true,
	})
	@Prop({ required: false, default: '', type: String })
	password: string;

	@ApiProperty({
		example: [Role.USER],
		description: 'User roles',
		enum: Role,
		isArray: true,
	})
	@Prop({ type: [String], enum: Role, default: [Role.USER] })
	roles: Role[];
}

export type UserDocument = HydratedModel<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
	if (this.isModified('email')) {
		this.email = this.email.toLowerCase();
	}
	if (this.isModified('password')) {
		const hashedPassword = await argon2.hash(this.password);
		this.password = hashedPassword;
	}
});
