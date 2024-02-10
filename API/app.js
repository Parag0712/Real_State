import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path';

const __dirname = path.resolve();


const app = express();

// Now Cors Which Site Request Allow
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
// Here Out Routes

app.use((err,req,res,next)=>{
    const statusCode  = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})

import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js'
import listingRouter from './routes/listing.route.js'

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/listing", listingRouter);
// Export App

app.use(express.static(path.join(__dirname, '/RealState/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'RealState', 'dist', 'index.html'));
})

export { app }