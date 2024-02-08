import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createListing, deleteListing, editListing, getListing, getListings } from "../controllers/listing.controllers.js";
const router = Router();

//Here Your Routes
router.post('/create-listing',verifyJWT,createListing);
router.get('/get-listings',getListings);
router.get('/get-listing/:id',verifyJWT,getListing);
router.get('/get-listing/:id',verifyJWT,getListing);
router.patch('/update-listing/:id',verifyJWT,editListing);
router.delete('/delete-listing/:id',verifyJWT,deleteListing);

export default router;