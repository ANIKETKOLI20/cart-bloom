import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

function PeopleAlsoBought() {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/product/recommendations");
        if (res.status !== 200) {
          throw new Error(res.data.message || "An error occurred while fetching recommendations");
        }
        return res.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">People also bought</h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default PeopleAlsoBought;
