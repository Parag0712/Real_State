import dotenv from 'dotenv'
// import connectDB from './db/db.js'
import { app } from './app.js'

dotenv.config({
    path:"./.env"
})

// Here out Connect function 

app.get("/",function (req,res){
    res.send("helo")
})

app.listen(process.env.PORT || 8000, () => {
    console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
});