import mongoose from "mongoose";

let cached = global.mongooseConnection;

if(!cached){
    cached = global.mongooseConnection = {
        conn: null,
        promise: null,
    };
}

export default async function connectToDatabase(){
    if(cached.conn){
        return cached.conn;
    }

    const uri = process.env.MONGODB_URI;

    if(!uri){
        throw new Error("Please define MONGODB_URI in .env.local");
    }

    if(!cached.promise){
        cached.promise = mongoose
            .connect(uri,{bufferCommands:false})
            .then((mongooseInstance) => mongooseInstance)
            .catch((error) => {
                cached.promise = null;
                throw error;
            });
    }

    cached.conn = await cached.promise;

    return cached.conn;
}