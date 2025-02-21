import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if(!DB_URI) {
    throw new Error('DB_URI is not provided! Please provide a valid MongoDB URI in the .env.<development/production>.local file');
}

//connect to mongoose
const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);

        console.log(`Connected to MongoDB in: ${NODE_ENV} mode`);
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
}

export default connectToDatabase;