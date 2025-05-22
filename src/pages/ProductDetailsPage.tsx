import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import $api from "../api/http";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  buttonVariants,
  cardVariants,
  modalVariants,
} from "../utils/animations";

interface Category {
  id: number;
  name: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
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

interface ProductDetailsPageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  toggleTheme,
  isDarkMode,
}) => {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  // const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = React.useState("1");
  const [error, setError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [quantityToBuy, setQuantityToBuy] = useState(1);
  const [file, setFile] = useState("");
  const handleCopy = () => {
    if (!file) return;
    navigator.clipboard.writeText(file).then(() => {
      console.log("Copied to clipboard");
      toast.success(t("purchases.copy_success")); // Ensure you are using toast.success for displaying the notification
    });
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await $api.get(`/products/product/${productId}`);
        if (isMounted) {
          setProduct(response.data);
          setLoading(false);
        }
      } catch (error: unknown) {
        console.error("Error fetching product:", error);
        if (isMounted && error instanceof Error) {
          toast.error(error.message || "Failed to load product");
          setError(error.message || "Failed to load product");
          setLoading(false);
        }
      }
    };

    if (productId) {
      fetchData();
    } else {
      setError("Invalid product ID");
      toast.error("Invalid product ID");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [productId]);


  const handleBuy = () => {
    setQuantityToBuy(1);
    setIsConfirmModalOpen(true);
  };

  const confirmBuy = async () => {
    if (product) {
      try {
        const purchaseResponse = await $api.post(`/purchases`, {
          productId: product.id,
          quantity: quantityToBuy,
        });
        const updatedProduct: Product = purchaseResponse.data;
        setProduct(updatedProduct);
        setIsConfirmModalOpen(false);
        setQuantityToBuy(1);
        setFile(
          updatedProduct.fileContent.split("\n").join("\n--------------\n")
        );
        toast.success(t("product_details.purchase_success")); // Используем i18next для перевода
      } catch (error: unknown) {
        console.error("Purchase failed:", error);
        const apiError = error as ApiError;
        if (apiError.response?.data?.error) {
          toast.error(apiError.response.data.error);
        } else {
          toast.error(t("product_details.purchase_failed"));
        }
      }
    }
  };

  if (loading) {
    return (
      <div
        className={`flex flex-col min-h-screen w-full ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <Header
          title={t("product_details.title")}
          backButton
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
        />
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
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        className={`flex flex-col min-h-screen w-full ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <Header
          title={t("product_details.title")}
          backButton
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
        />
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className={`text-center py-10 ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {error || t("product_details.not_found")}
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        title={product.name}
        backButton
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center mt-2 sm:mt-0">
            <span className="text-lg sm:text-xl font-bold text-green-500">
              {product.price.toFixed(2)}$
            </span>
            {!file && (
              <button
                onClick={handleBuy}
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {t("category_products.buy_button")}
              </button>
            )}
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-400 mb-4">
          {t("category_products.quantity", { quantity: product.quantity })}
        </p>
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <h2 className="text-lg sm:text-xl font-medium mb-2">
            {t("category_products.description")}
          </h2>
          <p className="text-sm sm:text-base">{product.description}</p>

          <pre className="text-sm sm:text-base whitespace-pre-wrap">
            {file ? file : product.fileContent}
          </pre>

          {file && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                onClick={handleCopy}
                className={`flex-1 py-2 px-4 sm:px-6 rounded-lg transition-colors duration-200 cursor-pointer ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                {t("purchases.copy_button")}
              </motion.button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isConfirmModalOpen && (
            <div className="fixed inset-0 !text-black bg-gray-900/50 flex items-center justify-center z-50 px-4">
              <motion.div
                variants={modalVariants}
                className="bg-white rounded-lg p-6 sm:p-6 w-full max-w-md"
              >
                <h3 className="text-lg sm:text-xl font-medium mb-4">
                  Подтверждение покупки
                </h3>
                <p className="text-gray-700 text-sm sm:text-base mb-4">
                  Вы уверены, что хотите купить продукт? Стоимость:{" "}
                  {(product.price * quantityToBuy).toFixed(2)}$
                </p>
                <div className="flex items-center mb-4">
    <motion.button
      variants={buttonVariants}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => {
        const newQty = Math.max(1, quantityToBuy - 1);
        setQuantityToBuy(newQty);
        setInputValue(newQty.toString());
      }}
      className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer"
      disabled={quantityToBuy <= 1}
    >
      -
    </motion.button>

    <input
      type="text"
      value={inputValue}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
          setInputValue(value);
        }
      }}
      onBlur={() => {
        const parsed = parseInt(inputValue, 10);
        if (!isNaN(parsed) && parsed >= 1) {
          setQuantityToBuy(parsed);
        } else {
          setInputValue(quantityToBuy.toString());
        }
      }}
      className="w-16 mx-2 text-sm sm:text-base text-center border rounded-md p-1"
    />

    <motion.button
      variants={buttonVariants}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => {
        const newQty = quantityToBuy + 1;
        setQuantityToBuy(newQty);
        setInputValue(newQty.toString());
      }}
      className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer"
    >
      +
    </motion.button>

    <span className="ml-2 text-sm sm:text-base text-gray-600">
      Доступно: {product.quantity}
    </span>
  </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <motion.button
                    variants={buttonVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={confirmBuy}
                    className="w-full sm:w-fit sm:min-w-[160px] px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                  >
                    {t("category_products.confirm_button")}
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={() => {
                      setIsConfirmModalOpen(false);
                      setQuantityToBuy(1);
                    }}
                    className="w-full sm:w-fit sm:min-w-[160px] px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 cursor-pointer"
                  >
                    {t("category_products.cancel_button")}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductDetailsPage;
