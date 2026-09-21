import mongoose from "mongoose";

const connectDB = async () => {
try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb connected successfully");
}catch(error){
    console.error("MongoDb connection failed",error);
    process.exit(1);  //exit the process with failure

}
}

export default connectDB; //to access this file in other files
