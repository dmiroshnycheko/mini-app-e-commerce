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
  fileContent: string; // Changed from filePath to match Prisma schema
}

const CategoryProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Флаг для предотвращения обновления состояния после размонтирования
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
      isMounted = false; // Очистка при размонтировании
    };
  }, [categoryId]);

  // const handlePurchase = (productId: number) => {
  //   navigate(`/product/${productId}/purchase`);
  // };

  const handleBuy = async (productId: number) => {
    try {
      const response = await $api.post(`/purchases`, {productId: productId});
      // Предположим, что API возвращает обновлённый продукт
      const updatedProduct: Product = response.data;

      // Обновляем продукт в состоянии
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? updatedProduct : p))
      );

      navigate(`/product/${productId}/purchase`);
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900 text-white">
      <Header
        title={t("category_products.title", {
          categoryName: category?.name || "Category",
        })}
        backButton
      />
      {loading ? (
        <div className="flex flex-col items-center justify-center flex-grow p-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-400">{error}</div>
      ) : (
        <div className="flex flex-col p-4 gap-4 w-full">
          {products.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              {t("category_products.no_products")}
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-lg font-bold text-green-400">
                      {t("category_products.price", {
                        amount: product.price.toFixed(2),
                      })}
                    </div>
                    <div className="text-sm text-gray-400">
                      {t("category_products.quantity", {
                        quantity: product.quantity,
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(product.id)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
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
