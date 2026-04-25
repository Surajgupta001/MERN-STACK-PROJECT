import express from 'express';
import { addCredential, addListing, deleteListing, getAllPublishListings, getAllUserListings, getAlluserorder, markFeatured, purchaseAmount, togglesatatus, updateListing, withdrawAmount } from '../controllers/listing.controllers.js';
import { protect } from '../middlewares/auth.middlewares.js';
import upload from '../configs/multer.js';

const listingRouter = express.Router();

listingRouter.post('/', upload.array('images', 5), protect, addListing);
listingRouter.put('/', upload.array('images', 5), protect, updateListing);
listingRouter.get('/public', getAllPublishListings);
listingRouter.get('/user', protect, getAllUserListings);
listingRouter.put('/:id/status', protect, togglesatatus);
listingRouter.delete('/:listingId', protect, deleteListing);
listingRouter.post('/add-credential', protect, addCredential);
listingRouter.put('/featured/:id', protect, markFeatured);
listingRouter.get('/user-orders', protect, getAlluserorder);
listingRouter.post('/withdraw', protect, withdrawAmount);
listingRouter.post('/purchase-account/:listingId', protect, purchaseAmount);

export default listingRouter;