import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

interface NotFoundPageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ toggleTheme, isDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        title={t("not_found.title")}
        backButton
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-xl mb-2">{t("not_found.title")}</h3>
        <p className={`mb-6 text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {t("not_found.message")}
        </p>
        <button
          onClick={() => navigate("/")}
          className={`py-3 px-4 rounded-lg transition-colors duration-200 ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {t("not_found.home_button")}
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;