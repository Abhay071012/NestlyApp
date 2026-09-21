import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import { propertyRouter } from "./routes/propertyRouter.js"; 
import{bookingRouter} from "./routes/bookingRouter.js"
import {router} from "./routes/userRoutes.js";
import { tripRouter } from "./routes/tripRouter.js";
dotenv.config();

const app = express();  //app is our express application

//1st middleware:-express.json (to understand the middleware part)
app.use(express.json({limit:"100mb"})); //by defalut express only accepts 100kb body/data

//2nd middleware:-urlencoded
app.use(express.urlencoded({limit:"100mb",extended:true})); //to handle the nested data that's why exteender :true

//3rd middleware:cookie parser
app.use(cookieParser()); //to parse cookies

app.use(cors({
    origin:process.env.ORIGIN_ACCESS_URL,
    credentials:true 
}))

const port=process.env.PORT;   //port number fetched from .env file

//one test route
app.get("/",(req,res)=>{
    res.send("Nestly server is running");
})

app.use("/api/v1/rent/user",router); //to use the userRoutes.js file
app.use("/api/v1/rent/listing",propertyRouter)
app.use("/api/v1/rent/user/booking",bookingRouter)
app.use("/api/v1/rent/trip",tripRouter)

connectDB();


 app.listen(port,()=>{
    console.log(`Server is running on port no.: ${port}`);
 })
 // Express Server setup done 
