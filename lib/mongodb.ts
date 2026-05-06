import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// In development, cache the connection on the Node.js global object to prevent
// exhausting connections during hot-reload. In production the module is
// evaluated once per Lambda cold-start so the module-level variable suffices.
const globalWithMongoose = global as typeof globalThis & {
  _mongooseCache?: MongooseCache;
};

const cached: MongooseCache = (globalWithMongoose._mongooseCache ??= {
  conn: null,
  promise: null,
});

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
