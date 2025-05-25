import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { UserService } from "../api/services/UserService";
import { cardVariants } from "../utils/animations";

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

const FOOTER_LINKS = [
  { to: "/agreement", labelKey: "home.agreement_link" },
  { to: "/privacy", labelKey: "home.privacy_link" },
  { to: "https://t.me/IOS_GP_Accounts", labelKey: "home.channel_link" },
  { to: "/support", labelKey: "home.support_link" },
];

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const response = await UserService.getCurrentUser();
        const responseMidificate = {
          id: Number(response.tgId),
          name: response.username ?? response.firstName ?? "Unknown User",
          balance: response.balance,
          bonusBalance: response.bonusBalance,
          invitedCount: response.invitedCount,
          bonusPercent: response.bonusPercent,
        };
        setUser(responseMidificate);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  if (loading) {
    return (
      <div
        className={`flex flex-col min-h-screen w-full items-center justify-center ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${
            isDarkMode ? "border-blue-400" : "border-blue-500"
          }`}
        ></motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 text-lg"
        >
          {t("common.loading")}
        </motion.p>
      </div>
    );
  }

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
        className={`flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 w-full lg:space-y-4 ${
          isDarkMode
            ? "bg-gradient-to-b from-gray-800 to-gray-900"
            : "bg-gradient-to-b from-gray-200 to-gray-100"
        }`}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-light mb-2 lg:mb-8 text-center"
        >
          {t("home.greeting", { name: user.name })}
        </motion.h1>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Link
            to="/deposit"
            className={`text-sm transition-colors duration-200 rounded-full py-2 px-4 sm:px-6 mb-4 ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white inline-block`}
          >
            {t("home.deposit_button")}
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-2 w-full"
        >
          <span className="text-4xl sm:text-5xl lg:text-6xl font-bold overflow-hidden text-ellipsis whitespace-nowrap max-w-[90%] mx-auto">
            {t("home.balance", { amount: Number(user.balance).toFixed(2) })}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`text-sm mt-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {t("home.bonus_balance", { amount: user.bonusBalance })}
        </motion.div>
      </div>

      {/* <div className="grid grid-cols-2 gap-4 p-4 w-full">
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
      </div> */}

      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
        <motion.h2
          className="text-xl sm:text-2xl mb-4 sm:mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ whiteSpace: 'pre-line' }}
        >
          {t("home.featured_title", {
            1: `<span className="${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }">Facebook</span>`,
          })}
        </motion.h2>
        <div className="sm:flex sm:justify-center sm:items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              to="/catalog"
              className={`w-full sm:w-fit sm:min-w-[160px] transition-colors duration-200 text-center py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center ${
                isDarkMode
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              <span className="mr-2">{t("home.catalog_link")}</span>
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        className={`mt-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center sm:flex-row sm:items-center sm:justify-center sm:gap-8 text-sm sm:text-base w-full ${
          isDarkMode ? "text-blue-400" : "text-blue-600"
        } gap-2 sm:gap-4`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {FOOTER_LINKS.map((link) => (
          <motion.div
            key={link.to}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Link
              to={link.to}
              className={`transition-colors duration-200 ${
                isDarkMode ? "hover:text-blue-300" : "hover:text-blue-800"
              }`}
            >
              {t(link.labelKey)}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HomePage;
