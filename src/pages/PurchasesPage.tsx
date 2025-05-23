import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import { motion } from "framer-motion";
import $api from "../api/http";
import { cardVariants, containerVariants } from "../utils/animations";
import { toast } from "react-toastify";

interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  fileContent: string;
  createdAt: string;
  updatedAt: string;
}

interface Purchase {
  id: number;
  orderId: number;
  userId: number;
  productId: number;
  price: number;
  fileContent: string;
  createdAt: string;
  product: Product;
}

interface PurchasesPageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const PurchasesPage: React.FC<PurchasesPageProps> = ({
  toggleTheme,
  isDarkMode,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await $api.get<Purchase[]>("/purchases");
        setPurchases(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewFile = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setFileContent(purchase.fileContent);
    setShowDetails(true);
  };
  const handleCopy = () => {
    if (!fileContent) return;
    navigator.clipboard.writeText(fileContent).then(() => {
      console.log("Copied to clipboard");
      toast.dismiss(); // Dismiss any existing toasts

      toast.success(t("purchases.copy_success")); // Ensure you are using toast.success for displaying the notification
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div
      className={`flex flex-col min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        title={t("purchases.title")}
        backButton
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
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
      ) : (
        <>
          {!showDetails ? (
            <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
              {purchases.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-10"
                >
                  <div className="text-5xl sm:text-6xl mb-4">🛒</div>
                  <h3 className="text-xl sm:text-2xl mb-2">
                    {t("purchases.no_purchases")}
                  </h3>
                  <p
                    className={`mb-6 text-sm sm:text-base ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("purchases.no_purchases_message")}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => navigate("/catalog")}
                    className={`py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 cursor-pointer ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {t("purchases.catalog_button")}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-4 sm:gap-6"
                >
                  {purchases.map((purchase) => (
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      key={purchase.id}
                      className={`rounded-lg p-4 sm:p-6 ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <h3 className="text-lg sm:text-xl font-medium">
                        {purchase.product.name}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <div
                          className={`text-sm sm:text-base ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {formatDate(purchase.createdAt)}
                        </div>
                        <div
                          className={`font-bold text-sm sm:text-base ${
                            isDarkMode ? "text-green-400" : "text-green-600"
                          }`}
                        >
                          ${purchase.price.toFixed(2)}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleViewFile(purchase)}
                        className={`w-full sm:w-fit sm:min-w-[160px] mt-4 py-2 px-4 sm:px-6 rounded-lg transition-colors duration-200 cursor-pointer ${
                          isDarkMode
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {t("purchases.show_data_button")}
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-4 sm:p-6 lg:p-8 w-full max-w-3xl mx-auto"
            >
              <div
                className={`rounded-lg p-4 sm:p-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg sm:text-xl font-medium">
                    {selectedPurchase?.product.name}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setShowDetails(false)}
                    className={`transition-colors duration-200 cursor-pointer ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 sm:h-6 w-5 sm:w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>
                <div
                  className={`p-4 rounded-lg mb-4 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <pre
                    className={`text-sm sm:text-base font-mono overflow-x-auto whitespace-pre-wrap max-h-96 ${
                      isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {fileContent?.split("\n").join("\n--------------\n")}</pre>
                </div>
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
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default PurchasesPage;
