// HomePage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import { UserService } from "../api/services/UserService";

interface User {
  id: number;
  name: string;
  balance: number;
  bonusBalance: number;
  invitedCount: number;
  bonusPercent: number;
}

interface HomePageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ toggleTheme, isDarkMode }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User>({
    id: 123456789,
    name: "Користувач",
    balance: 0,
    bonusBalance: 0,
    invitedCount: 0,
    bonusPercent: 5,
  });

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const response = await UserService.getCurrentUser();
        const responseMidificate = {
          id: Number(response.tgId),
          name: response.username ?? "Unknown User",
          balance: response.balance,
          bonusBalance: response.bonusBalance,
          invitedCount: response.invitedCount,
          bonusPercent: response.bonusPercent,
        };
        setUser(responseMidificate);
      } catch (error) {
        console.log(error);
      }
    };

    initializeUser();
  }, []);

  return (
    <div
      className={`flex flex-col min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        title={t("header.home")}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <div
        className={`flex flex-col items-center justify-center py-8 px-4 w-full ${
          isDarkMode
            ? "bg-gradient-to-b from-gray-800 to-gray-900"
            : "bg-gradient-to-b from-gray-200 to-gray-100"
        }`}
      >
        <h1 className="text-2xl font-light mb-2">
          {t("home.greeting", { name: user.name })}
        </h1>
        <Link
          to="/deposit"
          className={`text-sm transition-colors duration-200 rounded-full py-1 px-4 mb-4 ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {t("home.deposit_button")}
        </Link>
        <div className="text-center mb-2">
          <span className="text-6xl font-bold">
            {t("home.balance", { amount: user.balance })}
          </span>
        </div>
        <div
          className={`text-sm mt-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {t("home.bonus_balance", { amount: user.bonusBalance })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 w-full">
        <Link
          to="/purchases"
          className={`transition-colors duration-200 rounded-lg p-4 flex flex-col items-center justify-center text-center ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-white hover:bg-gray-200"
          }`}
        >
          <div className="text-2xl mb-2">💼</div>
          <div>{t("home.purchases_button")}</div>
        </Link>
        <Link
          to="/payments"
          className={`transition-colors duration-200 rounded-lg p-4 flex flex-col items-center justify-center text-center ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-white hover:bg-gray-200"
          }`}
        >
          <div className="text-2xl mb-2">💳</div>
          <div>{t("home.payments_button")}</div>
        </Link>
        <Link
          to="/bonus"
          className={`transition-colors duration-200 rounded-lg p-4 flex flex-col items-center justify-center text-center ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-white hover:bg-gray-200"
          }`}
        >
          <div className="text-2xl mb-2">🎁</div>
          <div>{t("home.bonus_button")}</div>
        </Link>
        <Link
          to="/catalog"
          className={`transition-colors duration-200 rounded-lg p-4 flex flex-col items-center justify-center text-center ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-white hover:bg-gray-200"
          }`}
        >
          <div className="text-2xl mb-2">🛍️</div>
          <div>{t("home.catalog_button")}</div>
        </Link>
      </div>

      <div className="p-4 w-full">
        <h2 className="text-xl mb-4">
          {t("home.featured_title", {
            1: `<span className="${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }">Facebook</span>`,
          })}
        </h2>
        <Link
          to="/catalog"
          className={`w-full transition-colors duration-200 text-center py-3 px-4 rounded-lg flex items-center justify-center ${
            isDarkMode
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-amber-500 hover:bg-amber-600"
          }`}
        >
          <span className="mr-2">{t("home.catalog_link")}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 5a3 3 0 016 0H5zm14 0a3 3 0 10-6 0h6zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>

      <div
        className={`mt-auto p-4 flex flex-col items-center justify-center text-sm w-full ${
          isDarkMode ? "text-blue-400" : "text-blue-600"
        } gap-2`}
      >
        <div className="flex space-x-4">
          <Link
            to="/agreement"
            className={`transition-colors duration-200 ${
              isDarkMode ? "hover:text-blue-300" : "hover:text-blue-800"
            }`}
          >
            {t("home.agreement_link")}
          </Link>
          <Link
            to="/privacy"
            className={`transition-colors duration-200 ${
              isDarkMode ? "hover:text-blue-300" : "hover:text-blue-800"
            }`}
          >
            {t("home.privacy_link")}
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/channel"
            className={`transition-colors duration-200 ${
              isDarkMode ? "hover:text-blue-300" : "hover:text-blue-800"
            }`}
          >
            {t("home.channel_link")}
          </Link>
          <Link
            to="/support"
            className={`transition-colors duration-200 ${
              isDarkMode ? "hover:text-blue-300" : "hover:text-blue-800"
            }`}
          >
            {t("home.support_link")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;