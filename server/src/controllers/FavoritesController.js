const Favorites = require('../models/Favorites');
const Dataset = require('../models/DatasetCatalogue');
const User = require('../models/User');
const mongoose = require('mongoose');

async function addToFavorite(req, res) {
    try {
        const rawUserId = req.user.id ;
        const { datasetId } = req.body;

        if(!rawUserId || !datasetId){
            return res.status(400).json({message:"Internal Server Error",error:"UserId or DatasetId missing"});   
        }
   let userId, datasetobjectId;
        try{
         userId = new mongoose.Types.ObjectId(rawUserId);
         datasetobjectId = new mongoose.Types.ObjectId(datasetId);
        }
        catch(err){
            return res.status(400).json({message:"Invalid UserId or DatasetId",error:err.message});
        }

        const datasetExists = await Dataset.findById(datasetobjectId);
        const userExists = await User.findById(userId);

        if (!datasetExists) {
            return res.status(404).json({message:"Dataset not found",error:"Dataset does not exist"});
        }
        if (!userExists) {
            return res.status(404).json({message:"Session not found",error:"User does not exist"});
        }

        const favorites = await Favorites.findOne({ userId: userId });
        if (!favorites) {
            const newFavorites = new Favorites({
                userId: userId,
                items: [datasetobjectId]
            });
            await newFavorites.save();
            return res.status(201).json({message:"Item marked as favorites",data:newFavorites});
        }
        if(favorites.items.includes(datasetobjectId)){
            return res.status(400).json({message:"Item already in favorites",error:"Dataset already exists in favorites"});
        }
        if (favorites.items.length >= 20) {
            return res.status(400).json({ message: "Favorites limit reached. You can only have 20 items in your favorites." });
        }
        if(favorites.userId.toString() !== userId.toString()){
            return res.status(403).json({message:"You are not allowed to modify this favorites list",error:"You are not authorized to modify this favorites list"});
        }
        if(favorites){
            favorites.items.push(datasetobjectId);
            await favorites.save();
            return res.status(200).json({message:"Item added to favorites",data:favorites});
        }

    } catch (error) {
        return res.status(500).json({message:"Internal Server Error",error:error.message});
    }
};

async function getFavoritesByUserId(req, res){
    const {userId} = req.params || req.user.id;

    if(!userId){
        return res.status(400).json({ message: "Session not found" });
    }
    
  try {
    const favorites = await Favorites.findOne({ userId: userId }).populate("items");

    if (!favorites) {
      return res.status(404).json({ message: 'Favorite list is empty.' });
    }

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

async function removeItemFromFavorites(req, res){
    const {datasetId} = req.params;
    const UserId = req.user.id;

    if(!UserId || !datasetId){
        return res.status(400).json({message:"Internal Server Error",error:"UserId or DatasetId missing"});   
    }
    try{
        const favorites = await Favorites.findOne({ userId: UserId });
        if(!favorites){
            return res.status(404).json({message:"Favorite list not found",error:"Favorite list does not exist"});
        }
        if(!favorites.items.includes(datasetId)){
            return res.status(404).json({message:"Item not found in favorites",error:"Item does not exist in favorites"});
        }
        if(favorites.userId.toString() !== UserId){
            return res.status(403).json({message:"You are not allowed to modify this favorites list",error:"You are not authorized to modify this favorites list"});
        }
        favorites.items = favorites.items.filter(item => item.toString() !== datasetId);
        await favorites.save();
        return res.status(200).json({message:"Item removed from favorites",data:favorites});
    }
    catch(err){
        return res.status(400).json({message:"Internal Server Error",error:err.message});
    }
}

module.exports = {
    addToFavorite,
    getFavoritesByUserId,
    removeItemFromFavorites,
}