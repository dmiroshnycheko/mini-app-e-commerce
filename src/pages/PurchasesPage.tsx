import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import $api from "../api/http";

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

const PurchasesPage: React.FC<PurchasesPageProps> = ({ toggleTheme, isDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
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
    });
  };

  const handleDownload = () => {
    if (!fileContent || !selectedPurchase) return;
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedPurchase.product.name.replace(/\s+/g, "_").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <div
            className={`w-12 h-12 border-4 rounded-full animate-spin ${
              isDarkMode
                ? "border-blue-500 border-t-transparent"
                : "border-blue-600 border-t-transparent"
            }`}
          ></div>
        </div>
      ) : (
        <>
          {!showDetails ? (
            <div className="p-4 w-full">
              {purchases.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl mb-2">{t("purchases.no_purchases")}</h3>
                  <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {t("purchases.no_purchases_message")}
                  </p>
                  <button
                    onClick={() => navigate("/catalog")}
                    className={`py-3 px-4 rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {t("purchases.catalog_button")}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {purchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className={`rounded-lg p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
                    >
                      <h3 className="text-lg font-medium">{purchase.product.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {formatDate(purchase.createdAt)}
                        </div>
                        <div className={`font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                          ${purchase.price.toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewFile(purchase)}
                        className={`w-full mt-4 py-2 px-4 rounded-lg transition-colors duration-200 ${
                          isDarkMode
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {t("purchases.show_data_button")}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 w-full">
              <div className={`rounded-lg p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{selectedPurchase?.product.name}</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className={`transition-colors duration-200 ${
                      isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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
                  </button>
                </div>
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
                    {t("purchases.copy_button")}
                  </button>
                  <button
                    onClick={handleDownload}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {t("purchases.download_button")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PurchasesPage;