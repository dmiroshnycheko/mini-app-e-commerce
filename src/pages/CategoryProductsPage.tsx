// CategoryProductsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import $api from "../api/http";

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
      } catch (error: any) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          setError(error.message || "Failed to load data");
          setLoading(false);
        }
      }
    };

    if (categoryId) {
      fetchData();
    } else {
      setError("Invalid category ID");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  const handleBuy = async (productId: number) => {
    try {
      const response = await $api.post(`/purchases`, { productId: productId });
      const updatedProduct: Product = response.data;
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? updatedProduct : p))
      );
      navigate(`/product/${productId}/purchase`);
    } catch (error) {
      console.error("Purchase failed:", error);
    }
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
        <div
          className={`text-center py-10 ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {error}
        </div>
      ) : (
        <div className="flex flex-col p-4 gap-4 w-full">
          {products.length === 0 ? (
            <div
              className={`text-center py-10 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("category_products.no_products")}
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className={`rounded-lg overflow-hidden ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="p-4">
                  <h3
                    className={`text-lg font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {product.name}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <div
                      className={`text-lg font-bold ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {t("category_products.price", {
                        amount: product.price.toFixed(2),
                      })}
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("category_products.quantity", {
                        quantity: product.quantity,
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(product.id)}
                    className={`w-full mt-4 transition-colors duration-200 py-2 px-4 rounded-lg ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {t("category_products.buy_button")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage;