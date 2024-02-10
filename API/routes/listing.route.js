import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createListing, deleteListing, editListing, getAllListings, getFilterListing, getListing } from "../controllers/listing.controllers.js";
const router = Router();

//Here Your Routes
router.post('/create-listing',verifyJWT,createListing);
router.get('/get-search-listings',verifyJWT,getFilterListing);
router.get('/get-listings',getAllListings);
router.get('/get-listing/:id',getListing);
router.patch('/update-listing/:id',verifyJWT,editListing);
router.delete('/delete-listing/:id',verifyJWT,deleteListing);

export default router;