import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongodb_URI = process.env.MONGODB_URI;
        if(!mongodb_URI) throw new Error("mongoDb URI not found");

        await mongoose.connect(`${mongodb_URI}/mern-auth`);
        console.log("Database connection successful");
    } catch (err : any) {
        console.log("Error conencting to Database", err.message);
    }
}

export default connectDB;