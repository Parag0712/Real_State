import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

// Cors 
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
// Here Out Routes

import authRouter from './routes/auth.route.js';
app.use("/api/v1/auth", authRouter);
// Export App
app.get("/", function (req, res) {
    res.send("helo")
})


export { app }