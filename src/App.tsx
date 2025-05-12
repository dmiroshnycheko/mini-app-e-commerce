/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

// Pages
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
import { AuthService } from "./api/services/AuthService";
import { useRoleUser } from "./contexts/RoleUserContext";
import Admin from "./pages/Admin";

// Telegram WebApp interface (unchanged)
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
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
  const { setRole } = useRoleUser();
  const [, setAuthError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const initializeApp = async () => {
      const webApp = window.Telegram?.WebApp;
      console.log(webApp + " webApp");

      if (webApp) {
        webApp.ready();
        webApp.expand();
        if (webApp.colorScheme === "light") {
          setIsDarkMode(false);
          document.documentElement.classList.remove("dark");
        } else {
          setIsDarkMode(true);
          document.documentElement.classList.add("dark");
        }
        // Set language based on Telegram user language
        const userLang = webApp.initDataUnsafe.user?.language_code || "uk";
        const lang = userLang.startsWith("ru")
          ? "ru"
          : userLang.startsWith("en")
          ? "en"
          : "uk";
        i18n.changeLanguage(lang);

        // Attempt to log in with Telegram user data
        const telegramUser = webApp.initDataUnsafe.user;
        console.log("telegramUser" + telegramUser);

        if (telegramUser) {
          try {
            const loginData = {
              tgId: telegramUser.id.toString() || "5969166369",
              username: telegramUser.username || "//",
              firstName: telegramUser.first_name || "Денис",
            };
            const response = await AuthService.login(loginData);
            setRole(response.role);
          } catch (error) {
            setAuthError("Failed to authenticate. Please try again.");
          }
        } else {
          setAuthError("Telegram user data not available.");
        }
      } else {
        try {
          const loginData = {
            tgId: "5969166369",
            username: "//",
            firstName: "Денис",
          };
          const response = await AuthService.login(loginData);
          setRole(response.role);
        } catch (error) {
          setAuthError("Failed to authenticate. Please try again.");
        }
        setAuthError("Telegram WebApp is not available.");
      }
      setIsLoading(false);
    };

    initializeApp();
  }, [i18n]);

  // Функция для переключения темы
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
      className={`min-h-screen w-full ${
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
            path="/catalog/:categoryId"
            element={<CategoryProductsPage toggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
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
            element={<ProductPurchasePage />}
          />
          <Route path="/purchases" element={<PurchasesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          
          <Route path="/deposit" element={<DepositPage />} />
         
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
