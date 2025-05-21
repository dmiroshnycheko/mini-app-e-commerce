/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthService } from "./api/services/AuthService";
import { UserService } from "./api/services/UserService"; // Импортируем UserService
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import ProductPurchasePage from "./pages/ProductPurchasePage";
import PurchasesPage from "./pages/PurchasesPage";
import PaymentsPage from "./pages/PaymentsPage";
import BonusPage from "./pages/BonusPage";
import DepositPage from "./pages/DepositPage";
import AgreementPage from "./pages/AgreementPage";
import PrivacyPage from "./pages/PrivacyPage";
import SupportPage from "./pages/SupportPage";
import NotFoundPage from "./pages/NotFoundPage";
import Admin from "./pages/Admin";
import { useRoleUser } from "./contexts/RoleUserContext";
import ProductDetailsPage from "./pages/ProductDetailsPage";

// Telegram WebApp interface (без изменений)
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        requestFullscreen: () => void;
        setHeaderColor: (color: string) => void;
        isVersionAtLeast: (version: string) => boolean;
        version: string;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          enable: () => void;
          disable: () => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            photo_url?: string;
          };
          start_param?: string;
          auth_date: number;
          hash: string;
        };
        colorScheme: string;
        themeParams: {
          bg_color: string;
          text_color: string;
          hint_color: string;
          link_color: string;
          button_color: string;
          button_text_color: string;
        };
      };
    };
  }
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { setRole, setBonusPercent } = useRoleUser();
  const [, setAuthError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const initializeApp = async () => {
      const tg = window.Telegram?.WebApp;

      if (tg) {
        tg.ready();
        if (tg.isVersionAtLeast("8.0")) {
          tg.requestFullscreen();
          tg.setHeaderColor("#000000");
        } else {
          tg.expand();
          console.log(
            "Bot API below 8.0, using expand(). Current Telegram version:",
            tg.version
          );
        }

        // Установка темы в зависимости от Telegram
        if (tg.colorScheme === "light") {
          setIsDarkMode(false);
          document.documentElement.classList.remove("dark");
        } else {
          setIsDarkMode(true);
          document.documentElement.classList.add("dark");
        }

        // Установка языка на основе Telegram
        const userLang = tg.initDataUnsafe.user?.language_code || "en";
        const lang = userLang.startsWith("ru")
          ? "ru"
          : userLang.startsWith("en")
          ? "en"
          : "uk";
        i18n.changeLanguage(lang);

        const initData = tg.initDataUnsafe;
        console.log("Telegram initData:", JSON.stringify(initData, null, 2));

        // Проверка наличия токена
        const token = localStorage.getItem("authToken");
        if (token) {
          try {
            // Проверяем валидность токена через /users/me
            const user = await UserService.getCurrentUser();
            setRole(user.role);
            setBonusPercent(user.bonusPercent);
            setIsLoading(false);
            return; // Пропускаем логин, если токен валиден
          } catch (error) {
            console.error("Token verification error:", error);
            localStorage.removeItem("authToken");
            localStorage.removeItem("refreshToken");
          }
        }

        // Выполняем логин, если токена нет или он невалиден
        if (initData?.user) {
          console.log("User data extracted:", initData.user);
          try {
            const loginData = {
              tgId: initData.user.id.toString(),
              username: initData.user.username,
              firstName: initData.user.first_name,
            };
            const response = await AuthService.login(loginData);
            setRole(response.role);
            setBonusPercent(response.bonusPercent);
          } catch (error) {
            console.error("Login error:", error);
            setAuthError("Failed to authenticate. Please try again.");
          }
        } else {
          console.warn("User data not available in initData");
        }
      } else {
        console.warn("Telegram.WebApp is not available. Environment:", {
          windowLocation: window.location.href,
          userAgent: navigator.userAgent,
        });

        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace("#", ""));
        const tgWebAppData = params.get("tgWebAppData");

        // Проверка наличия токена
        const token = localStorage.getItem("authToken");
        if (token) {
          try {
            const user = await UserService.getCurrentUser();
            setRole(user.role);
            setBonusPercent(user.bonusPercent);
            setIsLoading(false);
            return; // Пропускаем логин, если токен валиден
          } catch (error) {
            console.error("Token verification error:", error);
            localStorage.removeItem("authToken");
            localStorage.removeItem("refreshToken");
          }
        }

        if (tgWebAppData) {
          const decodedData = decodeURIComponent(tgWebAppData);
          const dataParams = new URLSearchParams(decodedData);
          const userParam = dataParams.get("user");
          const user = userParam ? JSON.parse(decodeURIComponent(userParam)) : null;

          if (user) {
            console.log("Extracted user data from tgWebAppData:", user);
            try {
              const loginData = {
                tgId: user.id.toString(),
                username: user.username,
                firstName: user.first_name,
              };
              const response = await AuthService.login(loginData);
              setRole(response.role);
              setBonusPercent(response.bonusPercent);
            } catch (error) {
              console.error("Login error:", error);
              setAuthError("Failed to authenticate. Please try again.");
            }
          } else {
            console.warn("No user data in tgWebAppData");
          }
        } else {
          console.log("tgWebAppData not found in URL, using hardcoded data");
          try {
            const loginData = {
              tgId: "5969166369",
              username: "//",
              firstName: "Денис",
            };
            const response = await AuthService.login(loginData);
            setRole(response.role);
            setBonusPercent(response.bonusPercent);
          } catch (error) {
            console.error("Login error with hardcoded data:", error);
            setAuthError("Failed to authenticate. Please try again.");
          }
        }
      }
      setIsLoading(false);
    };

    initializeApp();
  }, [i18n, setRole, setBonusPercent]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center h-screen w-full ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-16 border-4 ${
              isDarkMode
                ? "border-blue-500 border-t-transparent"
                : "border-blue-600 border-t-transparent"
            } rounded-full animate-spin`}
          ></div>
          <div className="mt-4 text-xl font-medium">
            {i18n.t("common.loading")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen overflow-hidden w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Router>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/"
            element={
              <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            }
          />
          <Route
            path="/catalog"
            element={
              <CatalogPage toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            }
          />
          <Route
            path="/product/:productId"
            element={
              <ProductDetailsPage
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
              />
            }
          />
          <Route
            path="/catalog/:categoryId"
            element={
              <CategoryProductsPage
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
              />
            }
          />
          <Route
            path="/bonus"
            element={
              <BonusPage toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            }
          />
          <Route
            path="/agreement"
            element={
              <AgreementPage
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
              />
            }
          />
          <Route
            path="/product/:productId/purchase"
            element={
              <ProductPurchasePage
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
              />
            }
          />
          <Route
            path="/purchases"
            element={
              <PurchasesPage
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
              />
            }
          />
          <Route
            path="/payments"
            element={
              <PaymentsPage toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            }
          />
          <Route
            path="/deposit"
            element={
              <DepositPage toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            }
          />
          <Route
            path="/privacy"
            element={
              <PrivacyPage toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            }
          />
          <Route
            path="/support"
            element={
              <SupportPage toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            }
          />
          <Route
            path="/404"
            element={
              <NotFoundPage toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            }
          />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;