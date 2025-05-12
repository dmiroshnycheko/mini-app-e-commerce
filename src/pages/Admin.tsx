/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import $api from "../api/http";
import { useRoleUser } from "../contexts/RoleUserContext";

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface Product {
  id: number;
  categoryId: number;
  category: Category;
  name: string;
  description: string;
  price: number;
  quantity: number;
  fileContent: string; // Обновлено с filePath на fileContent
}

const Admin = () => {
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
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [fileContent, setFileContent] = useState(""); // Обновлено с filePath на fileContent
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("categories");
  const { role } = useRoleUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    fileContent: "",
  });
  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      categoryId: product.categoryId.toString(),
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      fileContent: product.fileContent,
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
      fileContent: "",
    });
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Для quantity удаляем ведущие нули и некорректные символы
    if (name === "quantity") {
      const cleanedValue = value.replace(/^0+/, "") || "0"; // Удаляем ведущие нули, если значение пустое, ставим "0"
      setEditForm((prev) => ({ ...prev, [name]: cleanedValue }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditForm((prev) => ({
          ...prev,
          fileContent: event.target?.result as string,
        }));
      };
      reader.readAsText(file);
    } else {
      setError("Please upload a valid .txt file");
    }
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    // Отладка: проверяем, что находится в editForm.quantity
    console.log("editForm.quantity before parsing:", editForm.quantity);

    // Валидация полей
    const quantityValue = parseInt(editForm.quantity, 10);
    console.log("Parsed quantityValue:", quantityValue);

    if (isNaN(quantityValue) || quantityValue < 0) {
      setError("Quantity must be a valid non-negative number");
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
          fileContent: editForm.fileContent || undefined,
        }
      );

      // Отладка: проверяем, что вернул сервер
      console.log("Server response:", response.data);

      // Обновляем список продуктов
      setProducts(
        products.map((p) => (p.id === selectedProduct.id ? response.data : p))
      );
      setSuccess("Product updated successfully");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
      closeProductModal();
    } catch (err) {
      setError("Failed to update product");
      setSuccess("");
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
    }
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const response = await $api.get("/products/category");
      setCategories(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch categories");
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await $api.get("/users");
      setUsers(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch users");
    }
  };
  const deleteUser = async (id: number) => {
    try {
      await $api.delete(`/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setSuccess("User deleted successfully");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete user");
      setSuccess("");
    }
  };
  const fetchProducts = async () => {
    try {
      const response = await $api.get("/products/product");
      setProducts(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch products");
    }
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await $api.post("/products/category", { name, icon });
      setCategories([...categories, response.data]);
      setName("");
      setIcon("");
      setSuccess("Category added successfully");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to add category");
      setSuccess("");
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await $api.delete(`/products/category/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
      setSuccess("Category deleted successfully");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete category");
      setSuccess("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      setError("Please upload a valid .txt file");
      setFileContent("");
    }
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
        fileContent, // Отправляем содержимое файла
      });
      setProducts([...products, response.data]);
      setProductName("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setFileContent("");
      setCategoryId("");
      setSuccess("Product added successfully");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to add product");
      setSuccess("");
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await $api.delete(`/products/product/${id}`);
      setProducts(products.filter((product) => product.id !== id));
      setSuccess("Product deleted successfully");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete product");
      setSuccess("");
    }
  };

  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-red-500">
          You are not an admin.
        </h1>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 !text-black">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <div className="space-x-4">
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "categories"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "products"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "users"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Users
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {activeTab === "categories" && (
          <div className="bg-white text-black p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Add New Category</h3>
              <form onSubmit={addCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Icon URL
                  </label>
                  <input
                    type="url"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    required
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter icon URL"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add Category
                </button>
              </form>
            </div>
            <h3 className="text-lg text-black font-medium mb-4">
              Existing Categories
            </h3>
            {categories.length === 0 ? (
              <p className="text-gray-500">No categories found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 bg-gray-50 rounded-md shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={category.icon}
                        alt={category.name}
                        className="w-10 h-10 object-cover rounded-full"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src = "https://via.placeholder.com/40")
                        }
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white text-black p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Add New Product</h3>
              <form onSubmit={addProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    step="0.01"
                    min="0"
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    min="0"
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Text File
                  </label>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    required
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add Product
                </button>
              </form>
            </div>
            <h3 className="text-lg font-medium mb-4">Existing Products</h3>
            {products.length === 0 ? (
              <p className="text-gray-500">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 bg-gray-50 rounded-md shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-gray-500 gap-1 flex items-center">
                        <img
                          className="w-5 h-5"
                          src={product.category.icon}
                          alt="icon"
                        />
                        {product.category.name}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openProductModal(product)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        View/Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Модальное окно для просмотра и редактирования продукта */}
            {isModalOpen && selectedProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-medium mb-4">Product Details</h3>
                  <form onSubmit={updateProduct} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        name="categoryId"
                        value={editForm.categoryId}
                        onChange={handleEditFormChange}
                        required
                        className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditFormChange}
                        required
                        className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditFormChange}
                        required
                        className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditFormChange}
                        required
                        step="0.01"
                        min="0"
                        className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={editForm.quantity}
                        onChange={handleEditFormChange}
                        required
                        min="0"
                        step="1" // Добавляем шаг 1, чтобы гарантировать целые числа
                        className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => {
                          // Запрещаем ввод "e", "-", "."
                          if (e.key === "e" || e.key === "-" || e.key === ".") {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Text File Content
                      </label>
                      <textarea
                        name="fileContent"
                        value={editForm.fileContent}
                        onChange={handleEditFormChange}
                        className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                      />
                      <input
                        type="file"
                        accept=".txt"
                        onChange={handleEditFileChange}
                        className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={closeProductModal}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white text-black p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
            <h3 className="text-lg font-medium mb-4">Existing Users</h3>
            {users.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        ID
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Name
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Balance
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Bonus Balance
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Role
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Referral Code
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Invited Count
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Bonus Percent
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Created
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                          {user.tgId}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                          {user.username || "No username"}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                          {user.balance.toFixed(2)}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                          {user.bonusBalance.toFixed(2)}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                          {user.role}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                          {user.referralCode}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                          {user.invitedCount}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                          {user.bonusPercent}%
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
