// CatalogPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import { motion } from "framer-motion";
import $api from "../api/http";
import { cardVariants, containerVariants } from "../utils/animations";

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

const CatalogPage: React.FC<CatalogPageProps> = ({
  toggleTheme,
  isDarkMode,
}) => {
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
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          {t("catalog.title")}
        </h1>
      </div>
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Link
                to={`/catalog/${category.id}`}
                className={`flex flex-col items-center justify-center transition-colors duration-200 rounded-lg p-4 sm:p-6 text-center h-full ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-white hover:bg-gray-200 text-gray-900"
                }`}
              >
                <motion.img
                  src={category.icon}
                  alt="icon"
                  className="w-8 sm:w-10 h-8 sm:h-10"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
                />
                <div
                  className={`mt-3 font-medium text-base sm:text-lg ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {category.name}
                </div>
                <div
                  className={`text-sm sm:text-base mt-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("catalog.products_count", {
                    count: category._count.products,
                  })}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CatalogPage;
