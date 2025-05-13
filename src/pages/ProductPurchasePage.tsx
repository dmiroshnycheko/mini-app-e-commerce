import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import $api from "../api/http";

interface Product {
  data: {
    id: number;
    name: string;
    price: number;
    fileContent: string;
  };
}

interface ProductPurchasePageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const ProductPurchasePage: React.FC<ProductPurchasePageProps> = ({ toggleTheme, isDarkMode }) => {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsResponse: Product = await $api.get(`/products/product/${productId}`);
        setProduct({ data: productsResponse.data });
        setFileContent(productsResponse.data.fileContent);
        setLoading(false);
        console.log(productsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [productId]);

  const handleCopy = () => {
    if (!fileContent) return;
    navigator.clipboard.writeText(fileContent).then(() => {
      console.log("Copied to clipboard");
    });
  };

  const handleDownload = () => {
    if (!fileContent || !product) return;
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${product.data.name.replace(/\s+/g, "_").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      ) : (
        <div className="p-4 w-full">
          <div className={`rounded-lg p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-lg font-medium mb-4">{product?.data.name}</h3>
            <p className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {t("product_purchase.success_message", {
                productName: product?.data.name,
                price: product?.data.price,
              })}
            </p>
            <div className={`p-4 rounded-lg mb-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
              <pre
                className={`text-sm font-mono overflow-x-auto whitespace-pre-wrap ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                {fileContent}
              </pre>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                {t("product_purchase.copy_button")}
              </button>
              <button
                onClick={handleDownload}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {t("product_purchase.download_button")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPurchasePage;