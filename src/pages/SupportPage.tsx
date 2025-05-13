import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

interface SupportPageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const SupportPage: React.FC<SupportPageProps> = ({ toggleTheme, isDarkMode }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`flex flex-col min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        title={t("support.title")}
        backButton
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <div className="p-4 w-full">
        <div className={`rounded-lg p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-lg font-medium mb-4">{t("support.title")}</h3>
          <p className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {t("support.contact_message")}
          </p>
          <div className="space-y-2">
            <div>
              <span className={` ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {t("support.telegram_label")}
              </span>{" "}
              <a
                href="https://t.me/support_bot"
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-600"
                }`}
              >
                @369963
              </a>
            </div>
            <div>
              <span className={` ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {t("support.working_hours_label")}
              </span>{" "}
              {t("support.working_hours")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;