import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import axios from "axios";

import { Loader2 } from 'lucide-react'

const CategoryPage = () => {
  const { category } = useParams();

  // Fetch category data using React Query
  const { data: categoryData, isLoading, error } = useQuery({
    queryKey: ["categoryData", category],
    queryFn: async () => {
      const res = await axios.get(`/api/product/category/${category}`);
      if (res.status !== 200) {
        throw new Error(res.data.error || "Failed to fetch category data");
      }
      return res.data; // Assuming the response contains the product list
    },
    enabled: !!category, // Only run the query if category is defined
  });

  // Handle loading state
  if (isLoading) {
    return (
        <div className="flex justify-center items-top h-screen">
            <Loader2 className="w-20 h-20 animate-spin text-emerald-500" />
        </div>
    );
}

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-red-500">
          {error.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category title */}
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>

        {/* Category data grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {categoryData?.length === 0 && (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              No products found
            </h2>
          )}

          {categoryData?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage;
