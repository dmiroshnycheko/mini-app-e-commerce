import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import $api from "../api/http";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  buttonVariants,
  cardVariants,
  containerVariants,
} from "../utils/animations";

interface Category {
  id: number;
  name: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

interface Product {
  id: number;
  categoryId: number;
  category: Category;
  name: string;
  description: string;
  price: number;
  quantity: number;
  fileContent: string;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

interface CategoryProductsPageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const CategoryProductsPage: React.FC<CategoryProductsPageProps> = ({
  toggleTheme,
  isDarkMode,
}) => {
  const { t } = useTranslation();
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch category details
        const categoryResponse = await $api.get(`/products/category`);
        const categories: Category[] = categoryResponse.data;
        const foundCategory = categories.find(
          (cat) => cat.id === parseInt(categoryId || "", 10)
        );
        if (!foundCategory) {
          throw new Error("Category not found");
        }
        if (isMounted) {
          setCategory(foundCategory);
        }

        // Fetch products
        const productsResponse = await $api.get(
          `/products/product/category/${categoryId}`
        );
        const allProducts: Product[] = productsResponse.data;
        const filteredProducts = allProducts.filter(
          (product) => product.categoryId === parseInt(categoryId || "", 10)
        );
        if (isMounted) {
          setProducts(filteredProducts);
          setLoading(false);
        }
      } catch (error: unknown) {
        console.error("Error fetching data:", error);
        if (isMounted && error instanceof Error) {
          toast.error(error.message || "Failed to load data");
          setError(error.message || "Failed to load data");
          setLoading(false);
        }
      }
    };

    if (categoryId) {
      fetchData();
    } else {
      setError("Invalid category ID");
      toast.error("Invalid category ID");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  const handleDetails = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div
      className={`flex flex-col min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        title={t("category_products.title", {
          categoryName: category?.name || "Category",
        })}
        backButton
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          {t("category_products.title", {
            categoryName: category?.name || "Category",
          })}
        </h1>
      </div>
      <ToastContainer />
      {loading ? (
        <div className="flex flex-col items-center justify-center flex-grow p-4">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className={`w-12 h-12 border-4 rounded-full animate-spin ${
              isDarkMode
                ? "border-blue-500 border-t-transparent"
                : "border-blue-600 border-t-transparent"
            }`}
          ></motion.div>
        </div>
      ) : error ? (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className={`text-center py-10 ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {error}
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6 w-full max-w-7xl mx-auto"
        >
          {products.length === 0 ? (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className={`text-center py-10 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("category_products.no_products")}
            </motion.div>
          ) : (
            products.map((product) => (
              <motion.div
                variants={cardVariants}
                key={product.id}
                className={`rounded-lg overflow-hidden ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="p-4 sm:p-6">
                  <h3
                    className={`text-lg sm:text-xl font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {product.name}
                  </h3>
                  <p
                    className={`text-sm sm:text-base mt-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {product.description}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2">
                    <div
                      className={`text-lg sm:text-xl font-bold ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {t("category_products.price", {
                        amount: product.price.toFixed(2),
                      })}
                    </div>
                    <div
                      className={`text-sm sm:text-base ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("category_products.quantity", {
                        quantity: product.quantity,
                      })}
                    </div>
                  </div>
                  <motion.button
                    variants={buttonVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={() => handleDetails(product.id)}
                    className={`w-full sm:w-fit sm:min-w-[160px] mt-4 sm:mt-6 py-2 sm:py-3 px-4 sm:px-6 transition-colors duration-200 rounded-lg cursor-pointer ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {t("category_products.details_button") || "Details"}
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CategoryProductsPage;