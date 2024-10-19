import express from 'express';
import path from 'path';
import cors from 'cors';

import auctionRoutes from './routes/auctionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cron from "node-cron";
import {pokemonCards} from "./data/pokemonCards.js";
import {endAuction} from "./controllers/auctionController.js";

const app = express();

//Middleware
app.use(cors({ origin: 'http://localhost:4173' }));
app.use(express.json());

//For images
app.use('/assets', express.static(path.join(process.cwd(), 'src/assets')));

//Routes
app.use('/api/auctions', auctionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Scheduled task to run every minute to check for ended auctions
cron.schedule('* * * * *', () => {  // Runs every minute
    const currentTime = new Date();
    pokemonCards.forEach(auction => {
        if (new Date(auction.endDate) <= currentTime && !auction.ended) {
            const result =  endAuction(auction);
        }
    });
});

//Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));