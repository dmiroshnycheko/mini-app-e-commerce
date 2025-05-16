/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import $api from "../api/http";
import { useRoleUser } from "../contexts/RoleUserContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  buttonVariants,
  cardVariants,
  containerVariants,
  headerVariants,
  modalVariants,
  rowVariants,
} from "../utils/animations";

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface Product {
  id: number;
  categoryId: number;
  orderId: number;
  
  category: Category;
  name: string;
  description: string;
  price: number;
  quantity: number;
  textContent: string[];
}

interface Purchase {
  id: number;
  userId: number;
  orderId: number;
  user: {
    tgId: string;
    username: string;
    firstName: string;
    createdAt: string;
  };
  productId: number;
  product: {
    name: string;
  };
  price: number;
  quantity: number;
  fileContent: string;
  createdAt: string;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<
    {
      id: number;
      tgId: string;
      username: string;
      firstName: string;
      lastName: string | null;
      balance: number;
      bonusBalance: number;
      role: string;
      referralCode: string;
      invitedCount: number;
      bonusPercent: number;
      createdAt: string;
    }[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [textContent, setTextContent] = useState<string[]>([""]); // Начальное значение - один пустой элемент
  const [categoryId, setCategoryId] = useState("");

  const [activeTab, setActiveTab] = useState("categories");
  const { role } = useRoleUser();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    textContent: [""] as string[], // Начальное значение - один пустой элемент
  });

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await $api.get("/products/category");
      setCategories(response.data);
    } catch (err) {
      toast.error("Не удалось загрузить категории");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await $api.get("/users");
      setUsers(response.data);
    } catch (err) {
      toast.error("Не удалось загрузить пользователей");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await $api.get("/products/product");
      setProducts(response.data);
    } catch (err) {
      toast.error("Не удалось загрузить продукты");
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await $api.get("/purchases");
      setPurchases(response.data);
    } catch (err) {
      toast.error("Не удалось загрузить покупки");
    }
  };

  useEffect(() => {
    if (activeTab === "categories") {
      fetchCategories();
    } else if (activeTab === "products") {
      fetchProducts();
      fetchCategories();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "orders") {
      fetchPurchases();
    }
  }, [activeTab]);

  const deleteUser = async (id: number) => {
    try {
      await $api.delete(`/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("Пользователь удален успешно");
    } catch (err) {
      toast.error("Не удалось удалить пользователя");
    }
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await $api.post("/products/category", { name, icon });
      setCategories([...categories, response.data]);
      setName("");
      setIcon("");
      toast.success("Категория добавлена успешно");
    } catch (err) {
      toast.error("Не удалось добавить категорию");
    }
  };

  const confirmDeleteCategory = (id: number) => {
    setConfirmMessage("Вы уверены, что хотите удалить эту категорию?");
    setConfirmAction(() => async () => {
      try {
        await $api.delete(`/products/category/${id}`);
        setCategories(categories.filter((category) => category.id !== id));
        toast.success("Категория успешно удалена");
      } catch (err) {
        toast.error("Не удалось удалить категорию");
      } finally {
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const addTextField = () => {
    setTextContent([...textContent, ""]);
  };

  const handleTextChange = (index: number, value: string) => {
    const newTextContent = [...textContent];
    newTextContent[index] = value;
    setTextContent(newTextContent);
  };

  const removeTextField = (index: number) => {
    const newTextContent = textContent.filter((_, i) => i !== index);
    setTextContent(newTextContent.length ? newTextContent : [""]);
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await $api.post("/products/product", {
        categoryId,
        name: productName,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        textContent: textContent.filter((text) => text.trim() !== ""),
      });
      setProducts([...products, response.data]);
      setProductName("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setTextContent([""]);
      setCategoryId("");
      toast.success("Продукт добавлен успешно");
    } catch (err) {
      toast.error("Не удалось добавить продукт");
    }
  };

  const confirmDeleteProduct = (id: number) => {
    setConfirmMessage("Вы уверены, что хотите удалить этот продукт?");
    setConfirmAction(() => async () => {
      try {
        await $api.delete(`/products/product/${id}`);
        setProducts(products.filter((product) => product.id !== id));
        toast.success("Продукт успешно удален");
      } catch (err) {
        toast.error("Не удалось удалить продукт");
      } finally {
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      categoryId: product.categoryId.toString(),
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      textContent: [...product.textContent],
    });
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setEditForm({
      categoryId: "",
      name: "",
      description: "",
      price: "",
      quantity: "",
      textContent: [""],
    });
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      const cleanedValue = value.replace(/^0+/, "") || "0";
      setEditForm((prev) => ({ ...prev, [name]: cleanedValue }));
    } else if (name === "textContent") {
      // Не используется напрямую, обрабатываем через индекс
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addEditTextField = () => {
    setEditForm((prev) => ({
      ...prev,
      textContent: [...prev.textContent, ""],
    }));
  };

  const handleEditTextChange = (index: number, value: string) => {
    const newTextContent = [...editForm.textContent];
    newTextContent[index] = value;
    setEditForm((prev) => ({ ...prev, textContent: newTextContent }));
  };

  const removeEditTextField = (index: number) => {
    const newTextContent = editForm.textContent.filter((_, i) => i !== index);
    setEditForm((prev) => ({
      ...prev,
      textContent: newTextContent.length ? newTextContent : [""],
    }));
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const quantityValue = parseInt(editForm.quantity, 10);

    if (isNaN(quantityValue) || quantityValue < 0) {
      toast.error("Количество должно быть допустимым неотрицательным числом");
      return;
    }

    try {
      const response = await $api.patch(
        `/products/product/${selectedProduct.id}`,
        {
          categoryId: parseInt(editForm.categoryId, 10),
          name: editForm.name,
          description: editForm.description,
          price: parseFloat(editForm.price),
          quantity: quantityValue,
          textContent: editForm.textContent.filter(
            (text) => text.trim() !== ""
          ),
        }
      );

      setProducts(
        products.map((p) => (p.id === selectedProduct.id ? response.data : p))
      );
      toast.success("Продукт обновлен успешно");
      closeProductModal();
    } catch (err) {
      toast.error("Не удалось обновить продукт");
    }
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  if (role !== "admin") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen flex items-center justify-center bg-gray-100"
      >
        <h1 className="text-2xl sm:text-2xl font-bold text-red-500">
          Вы не администратор.
        </h1>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 !text-black">
      <motion.nav
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white shadow-md p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-2xl font-bold text-gray-800">
            Панель администратора
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={handleNavigateHome}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 cursor-pointer"
            >
              Назад
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setActiveTab("categories")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md cursor-pointer ${
                activeTab === "categories"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Категории
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setActiveTab("products")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md cursor-pointer ${
                activeTab === "products"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Продукты
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setActiveTab("users")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md cursor-pointer ${
                activeTab === "users"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Пользователи
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setActiveTab("orders")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md cursor-pointer ${
                activeTab === "orders"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Заказы
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-4 sm:p-6 lg:p-8"
      >
        <AnimatePresence>
          {isConfirmModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <motion.div
                variants={modalVariants}
                className="bg-white rounded-lg p-6 sm:p-6 w-full max-w-md"
              >
                <h3 className="text-lg sm:text-lg font-medium mb-4">
                  Подтверждение удаления
                </h3>
                <p className="text-gray-700 text-sm sm:text-base mb-6">
                  {confirmMessage}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <motion.button
                    variants={buttonVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={() => confirmAction()}
                    className="w-full sm:w-fit sm:min-w-[160px] px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                  >
                    Удалить
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={() => setIsConfirmModalOpen(false)}
                    className="w-full sm:w-fit sm:min-w-[160px] px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 cursor-pointer"
                  >
                    Отмена
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {activeTab === "categories" && (
          <motion.div
            variants={cardVariants}
            className="bg-white text-black p-4 sm:p-6 lg:p-8 rounded-lg shadow-md"
          >
            <h2 className="text-xl sm:text-xl font-semibold mb-4">
              Управление категориями
            </h2>
            <div className="mb-8">
              <h3 className="text-base sm:text-lg font-medium mb-4">
                Добавить новую категорию
              </h3>
              <motion.form
                variants={cardVariants}
                onSubmit={addCategory}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Название категории
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 p-2 sm:p-3 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите название категории"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    URL иконки
                  </label>
                  <input
                    type="url"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    required
                    className="mt-1 p-2 sm:p-3 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите URL иконки"
                  />
                </div>
                <motion.button
                  variants={buttonVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  type="submit"
                  className="w-full sm:w-fit sm:min-w-[160px] px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                >
                  Добавить категорию
                </motion.button>
              </motion.form>
            </div>
            <h3 className="text-base sm:text-lg text-black font-medium mb-4">
              Существующие категории
            </h3>
            {categories.length === 0 ? (
              <p className="text-sm sm:text-base text-gray-500">
                Категорий не найдено.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {categories.map((category) => (
                  <motion.div
                    variants={cardVariants}
                    key={category.id}
                    className="p-2 bg-gray-50 rounded-md shadow-sm flex flex-col sm:flex-row items-center justify-between"
                  >
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <img
                        src={category.icon}
                        alt={category.name}
                        className="w-10 h-10 object-cover rounded-full"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/40")
                        }
                      />
                      <span className="font-medium text-sm sm:text-base">
                        {category.name}
                      </span>
                    </div>
                    <motion.button
                      variants={buttonVariants}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      onClick={() => confirmDeleteCategory(category.id)}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                    >
                      Удалить
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "products" && (
          <motion.div
            variants={cardVariants}
            className="bg-white text-black p-4 sm:p-6 lg:p-8 rounded-lg shadow-md"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Управление продуктами
            </h2>
            <div className="mb-8">
              <h3 className="text-base sm:text-lg font-medium mb-4">
                Добавить новый продукт
              </h3>
              <motion.form
                variants={cardVariants}
                onSubmit={addProduct}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Категория
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="mt-1 p-2 sm:p-3 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Название продукта
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    className="mt-1 p-2 sm:p-3 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите название продукта"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Описание
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="mt-1 p-2 sm:p-3 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите описание продукта"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Цена
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    step="0.01"
                    min="0"
                    className="mt-1 p-2 sm:p-3 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите цену"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Количество
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    min="0"
                    className="mt-1 p-2 sm:p-3 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите количество"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Тексты
                  </label>
                  {textContent.map((text, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="text"
                        value={text}
                        onChange={(e) =>
                          handleTextChange(index, e.target.value)
                        }
                        className="mt-1 p-2 sm:p-3 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Текст ${index + 1}`}
                      />
                      {index > 0 && (
                        <motion.button
                          variants={buttonVariants}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          onClick={() => removeTextField(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          -
                        </motion.button>
                      )}
                    </div>
                  ))}
                  <motion.button
                    type="button" // Добавь это
                    variants={buttonVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={addTextField}
                    className="mt-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    +
                  </motion.button>
                </div>
                <motion.button
                  variants={buttonVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  type="submit"
                  className="w-full sm:w-fit sm:min-w-[160px] px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                >
                  Добавить продукт
                </motion.button>
              </motion.form>
            </div>
            <h3 className="text-base sm:text-lg font-medium mb-4">
              Существующие продукты
            </h3>
            {products.length === 0 ? (
              <p className="text-sm sm:text-base text-gray-500">
                Продукты не найдены.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {products.map((product) => (
                  <motion.div
                    variants={cardVariants}
                    key={product.id}
                    className="p-2 bg-gray-50 rounded-md shadow-sm flex flex-col sm:flex-row items-center justify-between"
                  >
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <span className="font-medium text-sm sm:text-base">
                        {product.name}
                      </span>
                      <span className="text-gray-500 gap-1 flex items-center text-sm sm:text-base">
                        <img
                          className="w-5 h-5"
                          src={product.category.icon}
                          alt="icon"
                        />
                        {product.category.name}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        variants={buttonVariants}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={() => openProductModal(product)}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                      >
                        Просмотр/Редактирование
                      </motion.button>
                      <motion.button
                        variants={buttonVariants}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={() => confirmDeleteProduct(product.id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                      >
                        Удалить
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <AnimatePresence>
              {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                  <motion.div
                    variants={modalVariants}
                    className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                  >
                    <h3 className="text-base sm:text-lg font-medium mb-4">
                      Детали продукта
                    </h3>
                    <motion.form
                      variants={cardVariants}
                      onSubmit={updateProduct}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Категория
                        </label>
                        <select
                          name="categoryId"
                          value={editForm.categoryId}
                          onChange={handleEditFormChange}
                          required
                          className="mt-1 p-2 sm:p-3 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Выберите категорию</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Название продукта
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditFormChange}
                          required
                          className="mt-1 p-2 sm:p-3 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Описание
                        </label>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditFormChange}
                          required
                          className="mt-1 p-2 sm:p-3 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Цена
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={editForm.price}
                          onChange={handleEditFormChange}
                          required
                          step="0.01"
                          min="0"
                          className="mt-1 p-2 sm:p-3 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Количество
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={editForm.quantity}
                          onChange={handleEditFormChange}
                          required
                          min="0"
                          step="1"
                          className="mt-1 p-2 sm:p-3 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => {
                            if (
                              e.key === "e" ||
                              e.key === "-" ||
                              e.key === "."
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Тексты
                        </label>
                        {editForm.textContent.map((text, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <input
                              type="text"
                              value={text}
                              onChange={(e) =>
                                handleEditTextChange(index, e.target.value)
                              }
                              className="mt-1 p-2 sm:p-3 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Текст ${index + 1}`}
                            />
                            {index > 0 && (
                              <motion.button
                                variants={buttonVariants}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                onClick={() => removeEditTextField(index)}
                                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                              >
                                -
                              </motion.button>
                            )}
                          </div>
                        ))}
                        <motion.button
                        type="button" // Добавь это
                          variants={buttonVariants}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          onClick={addEditTextField}
                          className="mt-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          +
                        </motion.button>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <motion.button
                          variants={buttonVariants}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          type="submit"
                          className="w-full sm:w-fit sm:min-w-[160px] px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                        >
                          Сохранить изменения
                        </motion.button>
                        <motion.button
                          variants={buttonVariants}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          type="button"
                          onClick={closeProductModal}
                          className="w-full sm:w-fit sm:min-w-[160px] px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 cursor-pointer"
                        >
                          Отмена
                        </motion.button>
                      </div>
                    </motion.form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div
            variants={cardVariants}
            className="bg-white text-black p-4 sm:p-6 lg:p-8 rounded-lg shadow-md"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Управление пользователями
            </h2>
            <h3 className="text-base sm:text-lg font-medium mb-4">
              Существующие пользователи
            </h3>
            {users.length === 0 ? (
              <p className="text-gray-500 text-sm sm:text-base">
                Пользователи не найдены.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <motion.table
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="min-w-full border-collapse border border-gray-200"
                >
                  <motion.thead variants={headerVariants}>
                    <tr className="bg-gray-100">
                      {[
                        "ID",
                        "Name",
                        "Balance",
                        "Bonus Balance",
                        "Role",
                        "Referral Code",
                        "Invited Count",
                        "Bonus Percent",
                        "Created",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-left text-sm font-medium text-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </motion.thead>
                  <motion.tbody>
                    {users.map((user) => (
                      <motion.tr
                        variants={rowVariants}
                        key={user.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {user.tgId}
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {user.username || "Нет имени пользователя"}
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {user.balance.toFixed(2)}
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {user.bonusBalance.toFixed(2)}
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {user.role}
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {user.referralCode}
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {user.invitedCount}
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {user.bonusPercent}%
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm">
                          <motion.button
                            variants={buttonVariants}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            onClick={() => deleteUser(user.id)}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                          >
                            Удалить
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </motion.table>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "orders" && (
          <motion.div
            variants={cardVariants}
            className="bg-white text-black p-4 sm:p-6 lg:p-8 rounded-lg shadow-md"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Управление заказами
            </h2>
            <h3 className="text-base sm:text-lg font-medium mb-4">
              Существующие заказы
            </h3>
            {purchases.length === 0 ? (
              <p className="text-gray-500 text-sm sm:text-base">
                Заказов не найдено.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <motion.table
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="min-w-full border-collapse border border-gray-200"
                >
                  <motion.thead variants={headerVariants}>
                    <tr className="bg-gray-100">
                      {[
                        "Order ID",
                        "User ID",
                        "Product",
                        "Price",
                        "Quantity",
                        "Total",
                        "Order Date",
                      ].map((header) => (
                        <th
                          key={header}
                          className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-left text-sm font-medium text-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </motion.thead>
                  <motion.tbody>
                    {purchases.map((purchase) => (
                      <motion.tr
                        variants={rowVariants}
                        key={purchase.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {purchase.orderId}
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {purchase.userId}
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {purchase.product.name}
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {purchase.price.toFixed(2)}
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {purchase.quantity}
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {(purchase.price * purchase.quantity).toFixed(2)}
                        </td>
                        <td className="border border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </motion.table>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Admin;
