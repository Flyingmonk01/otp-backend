import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            `${process.env.MONGODB_URI}`
        );
        const connectionHost = connection.connection.host;
        console.log("Host is: ", connectionHost);
    } catch (error) {
        console.log("Error in connection with MongoDB", error);
    }
};

export default connectDB;
