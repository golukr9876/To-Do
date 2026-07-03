import { app } from "./app.js";
import dotenv from 'dotenv';
import {connectDB} from "./src/config/db.js";


dotenv.config();

const PORT = process.env.PORT || 3001;

connectDB()
.then(()=>{
    app.listen(PORT , ()=>{
        console.log("Server is running on Port", PORT);
    })
})
.catch((error)=>{
    console.log("DATABASE CONNECTION FAILED...");
})



