import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import $api from "../api/http";

// Обновлённый интерфейс Product, предполагая, что API возвращает объект напрямую
interface Product {
  id: number;
  name: string;
  price: number;
  fileContent: string;
}

interface ProductPurchasePageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const ProductPurchasePage: React.FC<ProductPurchasePageProps> = ({
  toggleTheme,
  isDarkMode,
}) => {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await $api.get(`/products/product/${productId}`);
        console.log("API Response:", response.data); // Отладка ответа API

        // Проверяем структуру ответа
        if (
          response.data &&
          typeof response.data === "object" &&
          "id" in response.data &&
          "name" in response.data &&
          "price" in response.data &&
          "fileContent" in response.data
        ) {
          const fetchedProduct: Product = response.data;
          setProduct(fetchedProduct);
          setFileContent(fetchedProduct.fileContent || null);
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleCopy = () => {
    if (!fileContent) return;
    navigator.clipboard
      .writeText(fileContent)
      .then(() => {
        console.log("Copied to clipboard");
      })
      .catch((err) => console.error("Copy failed:", err));
  };

  

  return (
    <div
      className={`flex flex-col min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        title={t("product_purchase.title")}
        backButton
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      {loading ? (
        <div className="flex flex-col items-center justify-center flex-grow p-4">
          <div
            className={`w-12 h-12 border-4 rounded-full animate-spin ${
              isDarkMode
                ? "border-blue-500 border-t-transparent"
                : "border-blue-600 border-t-transparent"
            }`}
          ></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center flex-grow p-4">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      ) : product && fileContent ? (
        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-3xl mx-auto">
          <div
            className={`rounded-lg p-4 sm:p-6 lg:p-8 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-lg sm:text-xl font-medium">{product.name}</h3>
            <p
              className={`text-sm sm:text-base mb-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("product_purchase.success_message", {
                productName: product.name,
                price: product.price,
              })}
            </p>
            <div
              className={`p-4 rounded-lg mb-4 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <pre
                className={`text-sm sm:text-base font-mono overflow-x-auto whitespace-pre-wrap ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                {fileContent}
              </pre>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopy}
                className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 cursor-pointer ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                {t("product_purchase.copy_button")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow p-4">
          <p className="text-gray-500 text-center">
            No product data available.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductPurchasePage;
