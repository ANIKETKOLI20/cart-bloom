import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const ProductCard = ({ product }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { mutate: addToCart, isLoading: isPending, isError, error } = useMutation({
    mutationFn: async (product) => {
      const res = await axios.post("/api/cart", { productId: product._id });
      if (res.status !== 200) {
        throw new Error(res.response?.data?.message || "Failed to add product to cart");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Product added to cart!", { id: "cart-success" });
      queryClient.invalidateQueries(["cartItems"]); // Refresh cart items query
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add product to cart", { id: "cart-error" });
    },
  });

  const handleAddToCart = () => {
    if (!authUser) {
      toast.error("Please login to add products to cart", { id: "login-error" });
      return;
    }
    addToCart(product); // Trigger mutation
  };

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full"
          src={product.image || "/placeholder-image.jpg"}
          alt={product.name || "Product"}
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">{product.name}</h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">${product.price}</span>
          </p>
        </div>
        <button
          className={`flex items-center justify-center rounded-lg px-5 py-2.5 text-center text-sm font-medium
          text-white ${
            isPending ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
          } focus:outline-none focus:ring-4 focus:ring-emerald-300`}
          onClick={handleAddToCart}
          disabled={isPending}
        >
          <ShoppingCart size={22} className="mr-2" />
          {isPending ? "Adding..." : "Add to cart"}
        </button>
        {isError && <p className="text-red-500 mt-2">{error.message}</p>}
      </div>
    </div>
  );
};

export default ProductCard;
