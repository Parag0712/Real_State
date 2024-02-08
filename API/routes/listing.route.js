import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createListing } from "../controllers/listing.controllers.js";
const router = Router();

//Here Your Routes
router.post('/create-listing',verifyJWT,createListing);
export default router;