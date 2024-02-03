import dotenv from 'dotenv'
// import connectDB from './db/db.js'
import { app } from './app.js'
import connectDB from './db/db.js'

dotenv.config({
    path:"./.env"
})

// Here out Connect function 
connectDB().then(()=>{
    app.on("error",(error)=>{
        console.log("ERROR :",error);
    }) 
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
}).catch((err)=>{ 
    console.log("MONGO db connection failed !!! ", err);
})

