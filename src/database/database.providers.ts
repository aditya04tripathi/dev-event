import * as mongoose from 'mongoose';
import { EnvService } from '../env/env.service';

export const databaseProviders = [
	{
		provide: 'DATABASE_CONNECTION',
		useFactory: (envService: EnvService): Promise<typeof mongoose> =>
			mongoose.connect(envService.DatabaseUrl),
		inject: [EnvService],
	},
];
