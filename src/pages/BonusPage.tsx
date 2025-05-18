import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import { UserService } from "../api/services/UserService";
import { motion, AnimatePresence } from "framer-motion";
import $api from "../api/http";
import {
  buttonVariants,
  cardVariants,
  notificationVariants,
} from "../utils/animations";

// Define the BonusData interface based on available data
interface BonusData {
  invitedCount: number;
  bonusPercent: number;
  bonusBalance: number;
  referralLink: string;
  anonymousLink: string;
}

interface BonusPageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const BonusPage: React.FC<BonusPageProps> = ({ toggleTheme, isDarkMode }) => {
  const { t } = useTranslation();
  const [bonusData, setBonusData] = useState<BonusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user data using UserService
        const user = await UserService.getCurrentUser();

        // Construct referral and anonymous links using referralCode
        const botUrl = "https://t.me/IOS_GP_Accountts_bot"; // Replace with your actual bot URL
        const referralLink = `${botUrl}?start=ref_${user.referralCode}`;
        const anonymousLink = `${botUrl}?start=anon_${user.referralCode}`;

        // Set bonus data based on user response
        setBonusData({
          invitedCount: user.invitedCount,
          bonusPercent: user.bonusPercent,
          bonusBalance: user.bonusBalance,
          referralLink,
          anonymousLink,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      console.log("Link copied to clipboard");
      setNotification({
        type: "success",
        message: t("bonus.copy_success"),
      });
      setTimeout(() => setNotification(null), 3000);
    });
  };

  const handleWithdraw = async () => {
    if (!bonusData || bonusData.bonusBalance <= 0) return;

    try {
      const response = await $api.post("/bonus/withdraw");
      setBonusData({
        ...bonusData,
        bonusBalance: response.data.newBonusBalance,
      });
      setNotification({
        type: "success",
        message: t("bonus.withdraw_success"),
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      setNotification({
        type: "error",
        message: t("bonus.withdraw_error"),
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        title={t("bonus.title")}
        backButton
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      {loading ? (
        <div className="flex flex-col items-center justify-center flex-grow p-4">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className={`w-12 h-12 border-4 rounded-full animate-spin ${
              isDarkMode
                ? "border-blue-500 border-t-transparent"
                : "border-blue-600 border-t-transparent"
            }`}
          ></motion.div>
        </div>
      ) : !bonusData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`text-center py-10 ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {t("bonus.error_loading_data")}
        </motion.div>
      ) : (
        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-3xl mx-auto flex flex-col gap-4 sm:gap-6">
          <AnimatePresence>
            {notification && (
              <motion.div
                variants={notificationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-lg p-3 text-center w-full sm:w-auto max-w-md mx-auto ${
                  notification.type === "success"
                    ? isDarkMode
                      ? "bg-green-600 text-white"
                      : "bg-green-500 text-white"
                    : isDarkMode
                    ? "bg-red-600 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={`rounded-lg p-4 sm:p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-lg sm:text-xl font-medium mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("bonus.program_title")}
            </h3>
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between">
                <span
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                >
                  {t("bonus.invited_count", { count: bonusData.invitedCount })}
                </span>
                <span>{bonusData.invitedCount}</span>
              </div>
              <div className="flex justify-between">
                <span
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                >
                  {t("bonus.bonus_percent", {
                    percent: bonusData.bonusPercent,
                  })}
                </span>
                <span>{bonusData.bonusPercent}%</span>
              </div>
              <div className="flex justify-between">
                <span
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                >
                  {t("bonus.bonus_balance", {
                    amount: bonusData.bonusBalance.toFixed(2),
                  })}
                </span>
                <span
                  className={isDarkMode ? "text-green-400" : "text-green-600"}
                >
                  ${bonusData.bonusBalance.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={`rounded-lg p-4 sm:p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="space-y-4">
              <div>
                <label
                  className={`text-sm sm:text-base ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("bonus.referral_link_label")}
                </label>
                <div className="flex flex-col sm:flex-row mt-1 gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={bonusData.referralLink}
                    readOnly
                    className={`flex-1 rounded-l-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base ${
                      isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  />
                  <motion.button
                    variants={buttonVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={() => handleCopyLink(bonusData.referralLink)}
                    className={`w-full sm:w-fit sm:min-w-[160px] transition-colors duration-200 px-4 sm:px-6 py-2 sm:py-2.5 rounded-r-lg cursor-pointer ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {t("bonus.copy_button")}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-end">
            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: bonusData.bonusBalance === 0 ? 1 : 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={handleWithdraw}
              className={`w-full sm:w-fit sm:min-w-[160px] py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 cursor-pointer ${
                isDarkMode
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              } ${
                bonusData.bonusBalance === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={bonusData.bonusBalance === 0}
            >
              {t("bonus.withdraw_button")}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BonusPage;
