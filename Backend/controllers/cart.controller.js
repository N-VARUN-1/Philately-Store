import mongoose from 'mongoose';
import Cart from '../models/cart.model.js';
import User from '../models/user.model.js';

export const saveCart = async (req, res) => {
  const { userId, items } = req.body;

  try {
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format.' });
    }


    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items must be a non-empty array.' });
    }

    const invalidItems = items.filter(item => !item.id || !item.quantity || !mongoose.Types.ObjectId.isValid(item.id));
    if (invalidItems.length > 0) {
      return res.status(400).json({ message: 'Each cart item must have a valid productId and quantity.' });
    }

    // Merge duplicate productId entries
    const mergedItems = items.reduce((acc, item) => {
      const existingItem = acc.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
      return acc;
    }, []);

    // Find or create a cart for the user
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Update existing cart
      cart.items = mergedItems;
    } else {
      // Create a new cart
      cart = new Cart({ userId, items: mergedItems });
    }

    // Save the cart
    await cart.save();
    
    res.status(200).json({ message: 'Cart saved successfully.', cart });
    return { mergedItems, cart };
  } catch (error) {
    console.error('Error saving cart:', error.message, error.stack);
    res.status(500).json({ message: 'Error saving cart.', error });
  }
};

export const fetchCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({
        items: [],
        totalQuantity: 0,
        totalAmount: 0
      });
    }

    res.status(200).json({
      items: cart.items,
      totalQuantity: cart.items.reduce((total, item) => total + item.quantity, 0),
      totalAmount: cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    });
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};



export const checkCartSaveStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find the most recent saved cart for the user
    const savedCart = await Cart.findOne({
      user: userId,
      status: 'saved'
    }).sort({ createdAt: -1 });

    // Different scenarios for cart status
    if (!savedCart) {
      return res.status(200).json({
        success: false,
        isSaved: false,
        message: 'No saved cart found'
      });
    }

    // Check cart items and validity
    const isValidCart = savedCart.items.length > 0;
    const isRecentlySaved = isWithinRecentTimeframe(savedCart.createdAt);

    return res.status(200).json({
      success: true,
      isSaved: isValidCart && isRecentlySaved,
      cartId: savedCart._id,
      itemCount: savedCart.items.length,
      savedAt: savedCart.createdAt
    });

  } catch (error) {
    console.error('Error checking cart save status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};