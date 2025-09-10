const Cart = require('../models/Cart');
const Dataset = require('../models/DatasetCatalogue');
const User = require('../models/User');
const mongoose = require('mongoose');

async function addItemToCart(req, res) {
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

        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            const newCart = new Cart({
                userId: userId,
                items: [datasetobjectId]
            });
            await newCart.save();
            return res.status(201).json({message:"Item added to cart",cart:newCart});
        }
        if(cart.items.includes(datasetobjectId)){
            return res.status(400).json({message:"Item already in cart",error:"Dataset already exists in cart"});
        }
        if (cart.items.length >= 20) {
            return res.status(400).json({ message: "Cart limit reached. You can only have 20 items in your cart." });
        }
        if(cart.userId.toString() !== userId.toString()){
            return res.status(403).json({message:"You are not allowed to modify this cart",error:"You are not authorized to modify this cart"});
        }
        if(cart){
            cart.items.push(datasetobjectId);
            await cart.save();
            return res.status(200).json({message:"Item added to cart",cart:cart});
        }

    } catch (error) {
        return res.status(500).json({message:"Internal Server Error",error:error.message});
    }
};

async function getCartByUserId(req, res){
    const {userId} = req.params || req.user.id;

    if(!userId){
        return res.status(400).json({ message: "Session not found" });
    }
    
  try {
    const cart = await Cart.findOne({ userId: userId }).populate("items");

    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty.' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

async function removeItemFromCart(req, res){
    const {datasetId} = req.params;
    const UserId = req.user.id;

    if(!UserId || !datasetId){
        return res.status(400).json({message:"Internal Server Error",error:"UserId or DatasetId missing"});   
    }
    try{
        const cart = await Cart.findOne({ userId: UserId });
        if(!cart){
            return res.status(404).json({message:"Cart not found",error:"Cart does not exist"});
        }
        if(!cart.items.includes(datasetId)){
            return res.status(404).json({message:"Item not found in cart",error:"Item does not exist in cart"});
        }
        if(cart.userId.toString() !== UserId){
            return res.status(403).json({message:"You are not allowed to modify this cart",error:"You are not authorized to modify this cart"});
        }
        cart.items = cart.items.filter(item => item.toString() !== datasetId);
        await cart.save();
        return res.status(200).json({message:"Item removed from cart",cart:cart});
    }
    catch(err){
        return res.status(400).json({message:"Internal Server Error",error:err.message});
    }
}

module.exports = {
    addItemToCart,
    getCartByUserId,
    removeItemFromCart,
}