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



// Export App
export { app }