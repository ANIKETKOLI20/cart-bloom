import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Trash, Star, Loader2 } from "lucide-react"; // Import the spinner icon

const ProductsList = () => {
  const queryClient = useQueryClient();

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("/api/product");
      if (res.status !== 200) throw new Error(res.data.error || "Failed to fetch products");
      return res.data;
    },
  });

  // Mutation for toggling the featured product
  const { mutate: featuredProduct, isLoading: isToggling } = useMutation({
    mutationFn: async (productId) => {
      const res = await axios.patch(`/api/product/${productId}`);
      if (res.status !== 200) throw new Error(res.data.error || "Failed to toggle featured product");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  // Mutation for removing a product
  const { mutate: remove, isLoading: isRemoving } = useMutation({
    mutationFn: async (productId) => {
      const res = await axios.delete(`/api/product/${productId}`);
      if (res.status !== 200) throw new Error(res.data.error || "Failed to delete product");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  const [loadingProduct, setLoadingProduct] = useState(null); // Track the product currently being loaded

  const toggleFeaturedProduct = async (productId) => {
    setLoadingProduct(productId); // Set loading for the specific product
    try {
      await featuredProduct(productId);
    } catch (error) {
      console.error("Error toggling featured product:", error);
    } finally {
      setLoadingProduct(null); // Reset loading state once done
    }
  };

  const deleteProduct = async (productId) => {
    setLoadingProduct(productId); // Set loading for the specific product
    try {
      await remove(productId);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoadingProduct(null); // Reset loading state once done
    }
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Featured
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {products?.map((product) => (
            <tr key={product._id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">{product.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">${product.price.toFixed(2)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{product.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleFeaturedProduct(product._id)}
                  className={`p-1 rounded-full ${
                    product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
                  } hover:bg-yellow-500 transition-colors duration-200 ${
                    loadingProduct === product._id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loadingProduct === product._id}
                >
                  {loadingProduct === product._id ? (
                    <Loader2 className="animate-spin h-5 w-5 text-gray-900" /> // Show loading spinner
                  ) : (
                    <Star className="h-5 w-5" />
                  )}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => deleteProduct(product._id)}
                  className={`text-red-400 hover:text-red-300 ${
                    loadingProduct === product._id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loadingProduct === product._id}
                >
                  {loadingProduct === product._id ? (
                    <Loader2 className="animate-spin h-5 w-5 text-red-400" /> // Show loading spinner
                  ) : (
                    <Trash className="h-5 w-5" />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductsList;
