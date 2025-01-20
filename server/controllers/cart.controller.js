import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getCartProducts = async (req, res) => {
  try {
    // Log to check req.user.cartItems
    console.log('Cart Items:', req.user.cartItems);

    // Fetch the products from the database based on the cart items IDs
    const products = await Product.find({
      _id: { $in: req.user.cartItems.map((item) => item.product) }, // Correct the reference to product._id
    });

    // Add quantity for each product based on cartItems
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.product.toString() === product._id.toString() // Compare the product ID correctly
      );
      return { ...product.toJSON(), quantity: item.quantity }; // Add quantity to product data
    });

    // Send the cartItems array as the response
    res.json(cartItems);
  } catch (error) {
    console.error("Error in getCartProducts Controller", error); 
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Ensure user is populated by `protectRoute` middleware
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if product already exists in the user's cart
    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // If exists, increment quantity
      existingItem.quantity += 1;
    } else {
      // If not, add new product to the cart
      user.cartItems.push({ product: productId, quantity: 1 });
    }

    // Save user document
    await user.save();

    res.status(200).json({ cartItems: user.cartItems });
  } catch (error) {
    console.error("Error in addToCart controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in removeAllFromCart Controller", error.message);
    res.status(500).json({ error: "Server Error", error: error.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params; // Product ID from URL params
    const { quantity } = req.body; // Quantity from request body

    // Find the user based on the authentication middleware logic
    const user = await User.findById(req.user.id); // Replace with actual user retrieval logic

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure cartItems is defined
    if (!user.cartItems || user.cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty or not initialized" });
    }

    // Find the product in the user's cart
    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === productId // Ensure ID match
    );

    if (existingItem) {
      if (quantity === 0) {
        // Remove the product from the cart if quantity is set to 0
        user.cartItems = user.cartItems.filter(
          (item) => item.product.toString() !== productId
        );
      } else {
        existingItem.quantity = quantity; // Update the quantity
      }

      // Save the updated user document
      await user.save();

      return res.json({ success: true, cartItems: user.cartItems });
    } else {
      return res.status(404).json({ error: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error in updateProductQuantity Controller:", error.message);
    return res
      .status(500)
      .json({ error: "Server Error", message: error.message });
  }
};


