import UserModel from "../models/user.model.js";

// Add Product to user cart
const addToCart = async (req, res) => {
    
    try {
        const { userId, itemId, size } = req.body;
    
        const userData = await UserModel.findById(userId);
        let cartData = await userData.cartData;
    
        if (cartData[itemId]) {
            if (cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await UserModel.findByIdAndUpdate(
            userId, 
            { cartData } 
        )

        return res
        .status(200)
        .json({
            success: true, 
            message: "Item added to cart successfully", 
            cartData
        });
    }
    catch (error) {
        console.error("Error adding to cart:", error);
        return res
        .status(500)
        .json({
            success: false, 
            message: "Internal server error" 
        });
        
    }

};

// Update user cart
const updateCart = async (req, res) => {

    try {
        const { userId, itemId, size, quantity } = req.body;
    
        const userData = await UserModel.findById(userId);
        let cartData = await userData.cartData;
    
        cartData[itemId][size] = quantity;
    
        await UserModel.findByIdAndUpdate(
            userId, 
            { cartData } 
        );
    
        return res
        .status(200)
        .json({
            success: true, 
            message: "Cart updated successfully", 
            cartData
        });
    }
    catch (error) {
        console.error("Error updating cart:", error);
        return res
        .status(500)
        .json({
            success: false, 
            message: "Internal server error" 
        });
        
    }

};

// Get user cart data
const getUserCart = async (req, res) => {
    
    try {
        const { userId } = req.body;
    
        const userData = await UserModel.findById(userId);
        let cartData = await userData.cartData;
    
        return res
        .status(200)
        .json({
            success: true, 
            message: "Cart data retrieved successfully",
            cartData
        });
    }
    catch (error) {
        console.error("Error retrieving cart data:", error);
        return res
        .status(500)
        .json({
            success: false, 
            message: "Internal server error" 
        });
        
    }
};

export {
    addToCart,
    updateCart,
    getUserCart
};