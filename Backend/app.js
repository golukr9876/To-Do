import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { errorHandler } from './src/middleware/error.middleware.js';

const app = express();
dotenv.config();



app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors({
    origin: process.env.CLIENT_URL || PORT,
    credentials: true
}))


//import routes
import userRouter from './src/routes/user.routes.js';
import todosRouter from './src/routes/todo.routes.js'
//routes decalaration 
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/todos", todosRouter);




app.use(errorHandler)

export { app }