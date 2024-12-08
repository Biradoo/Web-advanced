import express from 'express';
import {
    getAuctions,
    getAuctionById,
    getBids,
    addAuction,
    updateAuction,
    deleteAuction,
    placeBid,
    endAuction,
} from '../controllers/auctionController.js';
import {verifyToken} from '../middleware/authMiddleware.js';
import {verifyRole} from '../middleware/roleMiddleware.js';
import {handleSSEConnection} from '../services/sseManager.js';

const router = express.Router();

//SSE route for live updates
router.get('/stream', handleSSEConnection);

// Public routes
router.get('/', getAuctions);  //GET all auctions
router.get('/:id', getAuctionById); //GET auction by ID
router.get('/:id/bids', getBids); //GET all bids for auction

// Admin-only routes
router.post('/', verifyToken, verifyRole('admin'), addAuction); //POST new auction
router.put('/:id', verifyToken, verifyRole('admin'), updateAuction); //PUT Update auction
router.delete('/:id', verifyToken, verifyRole('admin'), deleteAuction); //DELETE auction
router.post('/:id/end', verifyToken, verifyRole('admin'), endAuction); //POST End auction


// Bidder-only route
router.post('/:id/bid', verifyToken, verifyRole('bidder'), placeBid); //POST new bid

export default router;