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
    const { productId } = req.body; // we used req.body instead of req.params because we haven't passed id in the url of the route (router.get("/" , protectRoute , getCartProduct))
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart Controller", error.message);
    res.status(500).json({ error: "Server Error", error: error.message });
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
