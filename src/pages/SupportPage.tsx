import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { cardVariants } from "../utils/animations";

interface SupportPageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const SupportPage: React.FC<SupportPageProps> = ({
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
        title={t("support.title")}
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
          <motion.h3
            variants={cardVariants}
            className="text-lg sm:text-xl font-medium mb-4"
          >
            {t("support.title")}
          </motion.h3>
          <motion.p
            variants={cardVariants}
            className={`mb-4 text-sm sm:text-base ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("support.contact_message")}
          </motion.p>
          <motion.div
            variants={cardVariants}
            className="space-y-2 sm:space-y-3"
          >
            <div>
              <span
                className={`text-sm sm:text-base ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("support.telegram_label")}
              </span>{" "}
              <motion.a
                whileHover={{ scale: 1.05, textDecoration: "underline" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                href="https://t.me/devappleaccounts"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm sm:text-base ${
                  isDarkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-500 hover:text-blue-600"
                }`}
              >
                @devappleaccounts
              </motion.a>
            </div>
            <motion.a
              href="https://t.me/devappleaccounts"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`inline-block mt-4 px-6 py-2 rounded-lg text-sm sm:text-base font-medium ${
                isDarkMode
                  ? "bg-blue-600 text-white hover:bg-blue-500"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {t("support.title")}
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportPage;