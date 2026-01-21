import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import argon2 from 'argon2';
import { HydratedModel } from 'src/types';
import { Role } from './enums/role.enum';

@Schema({ timestamps: true })
export class User {
	@Prop({ required: true, type: String })
	fullName: string;

	@Prop({ required: true, type: String, unique: true })
	username: string;

	@Prop({ required: true, type: String, unique: true })
	email: string;

	@Prop({ required: false, default: '', type: String })
	password: string;

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
