import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
    path : "./env"
});

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Erro occured while connecting the database : ",error);
    });
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    });
})
.catch((err)=>{
    console.log("MongoDB connection failed : ",err);
})









/*
-- 1st Approach
import express from "express";
const app = express();
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("Error",(error)=>{
            console.log("Error connecting the database : ",error);
        });

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Error : ",error);
        throw error
    }
})()*/