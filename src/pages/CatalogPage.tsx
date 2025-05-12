// CatalogPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import $api from "../api/http";

interface Category {
  id: number;
  name: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  productCount: number;
  _count: {
    products: number;
  };
}

interface CatalogPageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const CatalogPage: React.FC<CatalogPageProps> = ({ toggleTheme, isDarkMode }) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await $api.get("/products/category");
        setLoading(false);
        setCategories(response.data);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div
      className={`flex flex-col min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        title={t("catalog.title")}
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
        <div className="grid grid-cols-2 gap-6 p-6 w-full">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/catalog/${category.id}`}
              className={`flex flex-col items-center justify-center transition-colors duration-200 rounded-lg p-4 text-center ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-white hover:bg-gray-200 text-gray-900"
              }`}
            >
              <img
                src={category.icon}
                alt="icon"
                className="w-10 h-10"
              />
              <div
                className={`mt-3 font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {category.name}
              </div>
              <div
                className={`text-sm mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("catalog.products_count", {
                  count: category._count.products,
                })}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;