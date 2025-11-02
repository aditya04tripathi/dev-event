import mongoose from "mongoose";

type MongooseCache = {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
};

declare global {
	var mongooseCache: MongooseCache | undefined;
}

const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/dev-event";

const cached: MongooseCache = global.mongooseCache || {
	conn: null,
	promise: null,
};

if (!global.mongooseCache) {
	global.mongooseCache = cached;
}

async function connectDB(): Promise<typeof mongoose> {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		if (!MONGODB_URI) {
			throw new Error(
				"Please define the MONGODB_URI environment variable inside .env.local",
			);
		}
		const options = {
			bufferCommands: false,
		};

		cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (error) {
		cached.promise = null;
		throw error;
	}

	return cached.conn;
}

export default connectDB;
