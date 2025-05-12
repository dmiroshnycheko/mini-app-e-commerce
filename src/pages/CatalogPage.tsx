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

const CatalogPage: React.FC = () => {
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
    <div className="flex flex-col min-h-screen w-full bg-gray-900 text-white">
      <Header title={t("catalog.title")} />
      {loading ? (
        <div className="flex flex-col items-center justify-center flex-grow p-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 p-6 w-full">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/catalog/${category.id}`}
              className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors duration-200 rounded-lg p-4 text-center"
            >
              <img src={category.icon} alt="icon" className="w-10 h-10" />
              <div className="mt-3 font-medium">{category.name}</div>
              <div className="text-sm text-gray-400 mt-1">
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
