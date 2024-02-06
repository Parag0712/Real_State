import { Router } from "express";
import { getCurrentUser, google, login, logout, register } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteAccount, updateUserAccount } from "../controllers/user.controllers.js";
const router = Router();

//Here Your Routes
router.patch('/update-account',verifyJWT,updateUserAccount);
router.delete('/delete-account',verifyJWT,deleteAccount);


export default router;