import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createListing, deleteListing, getListings } from "../controllers/listing.controllers.js";
const router = Router();

//Here Your Routes
router.post('/create-listing',verifyJWT,createListing);
router.get('/get-listing',getListings);
router.delete('/delete-listing/:id',deleteListing);
export default router;