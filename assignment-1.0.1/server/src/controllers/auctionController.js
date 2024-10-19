import { pokemonCards } from '../data/pokemonCards.js';
import { sendSSEUpdate } from '../services/sseManager.js';
import users from "../data/users.js";

export const getAuctions = (req, res) => {
    const { name, set, gradingCompany, grade, status, maxPrice, sort, limit } = req.query;
    let filteredAuctions = [...pokemonCards];

    //If no query parameters are provided, return all auctions
    if (Object.keys(req.query).length === 0) {
        return res.json(filteredAuctions);
    }

    if (name) {
        filteredAuctions = filteredAuctions.filter(auction =>
            auction.attributes.pokemon.toLowerCase().includes(name.toLowerCase())
        );
    }

    if (set) {
        filteredAuctions = filteredAuctions.filter(auction =>
            auction.attributes.set.toLowerCase().includes(set.toLowerCase())
        );
    }

    if (gradingCompany) {
        filteredAuctions = filteredAuctions.filter(auction =>
            auction.attributes.gradingCompany.toLowerCase() === gradingCompany.toLowerCase()
        );
    }

    if (grade) {
        filteredAuctions = filteredAuctions.filter(auction =>
            auction.attributes.grade === parseInt(grade)
        );
    }

    if (maxPrice) {
        filteredAuctions = filteredAuctions.filter(auction =>
            auction.currentPrice <= parseInt(maxPrice)
        );
    }

    if (status === 'ongoing') {
        filteredAuctions = filteredAuctions.filter(auction =>
            new Date(auction.endDate) > new Date()
        );
    } else if (status === 'ended') {
        filteredAuctions = filteredAuctions.filter(auction =>
            new Date(auction.endDate) <= new Date()
        );
    }

    if (sort) {
        if (sort === 'price') {
            filteredAuctions = filteredAuctions.sort((a, b) => a.currentPrice - b.currentPrice);
        } else if (sort === 'endDate') {
            filteredAuctions = filteredAuctions.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
        } else if (sort === 'alphabetical') {
            filteredAuctions = filteredAuctions.sort((a, b) => a.attributes.pokemon.localeCompare(b.attributes.pokemon));
        }
    }
    //Limiting result set
    const limitedAuctions = filteredAuctions.slice(0, limit ? parseInt(limit) : 10);
    return res.status(200).json(limitedAuctions);
};

export const getAuctionById = (req, res) => {
    const auction = pokemonCards.find(card => card.id === parseInt(req.params.id));
    if (!auction) {
        return res.status(404).json({ message: 'Auction not found' });
    }
    res.json(auction);
};

//Get all bids for auction
export const getBids = (req, res) => {
    const auction = pokemonCards.find(card => card.id === parseInt(req.params.id));
    if (!auction) {
        return res.status(404).json({ message: 'Auction not found' });
    }
    res.json(auction.bids);
};

export const addAuction = (req, res) => {
    const { name, attributes, currentPrice, endDate, description } = req.body;

    if (!name || !attributes.pokemon || !attributes.set || !attributes.year || !attributes.gradingCompany ||
        !attributes.grade || !attributes.holo || !currentPrice || !endDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (attributes.grade < 7) {
        return res.status(400).json({ message: 'Grade must be 7 or higher' });
    }

    if (attributes.year < 1995) {
        return res.status(400).json({ message: 'Year must be above 1995' });
    }

    if (currentPrice <= 0) {
        return res.status(400).json({ message: 'Starting price must be greater than 0' });
    }

    const now = new Date();
    if (endDate <= now) {
        return res.status(400).json({ message: 'End date must be in the future' });
    }

    const auctionName = name + ' - ' + attributes.set;

    const newAuction = {
        id: pokemonCards.length + 1,
        auctionName,
        attributes,
        currentPrice,
        endDate,
        description,
        bids: []
    };
    pokemonCards.push(newAuction);
    res.status(201).json(newAuction);
};

export const updateAuction = (req, res) => {
    const auction = pokemonCards.find(card => card.id === parseInt(req.params.id));
    if (!auction) {
        return res.status(404).json({ message: 'Auction not found' });
    }

    const { name, attributes, currentPrice, endDate, description } = req.body;
    //Check if there are bids. If yes, prevent price update
    if (auction.bids && auction.bids.length > 0 && currentPrice !== auction.currentPrice) {
        return res.status(400).json({ message: 'Cannot update price as there are already bids on this auction.' });
    }

    if (attributes.grade < 7) {
        return res.status(400).json({ message: 'Grade must be at least 7.' });
    }

    if (attributes.year < 1995) {
        return res.status(400).json({ message: 'Year must be at least 1995.'})
    }

    const auctionEndDate = new Date(endDate);

    if (auctionEndDate <= Date()) {
        return res.status(400).json({ message: 'End date must be in the future'})
    }

    const now = new Date();
    if (auctionEndDate <= now) {
        return res.status(400).json({ message: 'End date must be in the future' });
    }

    //Update only changed attributes, preserve the rest
    auction.name = name || auction.name;
    auction.attributes = {
        pokemon: attributes.pokemon || auction.attributes.pokemon,
        set: attributes.set || auction.attributes.set,
        year: attributes.year || auction.attributes.year,
        gradingCompany: attributes.gradingCompany || auction.attributes.gradingCompany,
        grade: attributes.grade || auction.attributes.grade,
        holo: attributes.holo || auction.attributes.holo,
        image: attributes.image || auction.attributes.image,
    };
    auction.description = description || auction.description;
    auction.endDate = endDate || auction.endDate;

    //Only allow price update if no bids exist - double check
    if (!auction.bids || auction.bids.length === 0) {
        auction.currentPrice = currentPrice || auction.currentPrice;
    }

    res.json(auction);
};

export const deleteAuction = (req, res) => {
    const auctionIndex = pokemonCards.findIndex(card => card.id === parseInt(req.params.id));
    if (auctionIndex === -1) {
        return res.status(404).json({ message: 'Auction not found' });
    }
    pokemonCards.splice(auctionIndex, 1);
    res.status(204).send();
};

export const endAuction = (req, res) => {
    const auction = pokemonCards.find(card => card.id === parseInt(req.params.id));
    if (!auction) {
        return res.status(404).json({ message: 'Auction not found' });
    }

    const highestBid = auction.bids[auction.bids.length - 1]; //Last bid is highest
    const winner = users.find(user => user.username === highestBid.user);

    if (winner) {
        winner.wonAuctions.push({
            auctionId: auction.id,
            price: highestBid.amount,
            wonAt: new Date().toISOString()
        });
        auction.ended = true;
        res.json({ message: 'Auction ended and won by', winner: winner.username });
    } else {
        res.status(404).json({ message: 'No winner found for this auction.' });
    }
};

export const placeBid = (req, res) => {
    const auction = pokemonCards.find(card => card.id === parseInt(req.params.id));

    if (!auction) {
        return res.status(404).json({ message: 'Auction not found' });
    }

    const { amount } = req.body;
    if (!amount || isNaN(amount)) {
        return res.status(400).json({ message: 'Bid amount is required and must be a number' });
    }

    if (amount <= auction.currentPrice) {
        return res.status(400).json({ message: 'Bid must be higher than the current price' });
    }

    auction.bids.push({
        user: req.user.username,
        amount,
        timestamp: new Date().toISOString()
    });
    auction.currentPrice = amount;

    //Send SSE update to all clients for this auction
    sendSSEUpdate(auction);
    res.status(200).json({ message: 'Bid placed successfully', auction});
};