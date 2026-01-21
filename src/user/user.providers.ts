import { Connection } from 'mongoose';
import { User, UserSchema } from './user.schema';

export const userProviders = [
	{
		provide: User.name,
		useFactory: (connection: Connection) =>
			connection.model(User.name, UserSchema),
		inject: ['DATABASE_CONNECTION'],
	},
];
