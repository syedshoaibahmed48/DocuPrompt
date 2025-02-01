import mongoose from "mongoose";

export async function connectWithMongoDB(){
    try {
        mongoose.connect(process.env.MONGODB_CONNECT_STR !);
        const connection = mongoose.connection;
        connection.on('error', (error)=>{
            console.error("MongoDB connection error", error);
        })
    } catch (error) {
        console.error("Couldnt connect to MongoDB", error);
    }
}