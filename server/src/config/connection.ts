import mongoose from 'mongoose';
import 'dotenv/config';

const db = async (): Promise<typeof mongoose.connection> => {
    try {
      const MONGODB_URI = process.env.MONGODB_URI;
      
      if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined');
      }

      const conn = await mongoose.connect(MONGODB_URI);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn.connection;
    } catch (error) {
      console.error('Database connection error:', error);
      process.exit(1);
    }
};

export default db;
