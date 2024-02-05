import { Router } from "express";
import { getCurrentUser, login, logout, register } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

//Here Your Routes
router.post('/register',register)
router.post('/login',login)
router.post('/logout',verifyJWT,logout);
router.get('/get-user',verifyJWT,getCurrentUser);


export default router;