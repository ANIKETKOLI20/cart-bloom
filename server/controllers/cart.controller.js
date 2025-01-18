import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } }); // Fetches all products that match the IDs in the user's cart.

    // add quantity for each product
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItems) => cartItems.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity }; // The toJSON() method in Mongoose is used to convert a Mongoose document into a plain JavaScript object.
      // This plain object contains only the raw data from the database, excluding additional Mongoose-specific properties and methods.
      
    });

    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in getCartProducts Controller", error.message);
    res.status(500).json({ error: "Server Error", error: error.message });
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
    const { id: productId } = req.params; // here we used req.paramas instead of req.body because in route url we used /:id unlike addToCart router.put("/:id" , protectRoute , updateProductQuantity)
    const quantity = req.body;
    const user = req.body;

    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity === 0) {
        // client requested to remove the product from the cart
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }

      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.log("Error in updateProductQuantity Controller", error.message);
    res.status(500).json({ error: "Server Error", error: error.message });
  }
};
