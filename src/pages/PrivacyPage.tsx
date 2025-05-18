import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { cardVariants } from "../utils/animations";

interface PrivacyPageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({
  toggleTheme,
  isDarkMode,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        title={t("privacy.title")}
        backButton
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-3xl mx-auto">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className={`rounded-lg p-4 sm:p-6 lg:p-8 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <pre
            className={`text-sm sm:text-base whitespace-pre-wrap ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {t("header.privacyText")}
          </pre>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;
