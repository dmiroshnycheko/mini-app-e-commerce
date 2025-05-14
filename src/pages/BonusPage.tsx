import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import { UserService } from "../api/services/UserService";
import $api from "../api/http";

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
          <div
            className={`w-12 h-12 border-4 rounded-full animate-spin ${
              isDarkMode
                ? "border-blue-500 border-t-transparent"
                : "border-blue-600 border-t-transparent"
            }`}
          ></div>
        </div>
      ) : !bonusData ? (
        <div
          className={`text-center py-10 ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {t("bonus.error_loading_data")}
        </div>
      ) : (
        <div className="p-4 w-full flex flex-col gap-4">
          {notification && (
            <div
              className={`rounded-lg p-3 text-center ${
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
            </div>
          )}
          <div
            className={`rounded-lg p-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-lg font-medium mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("bonus.program_title")}
            </h3>
            <div className="space-y-2">
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
          </div>

          <div
            className={`rounded-lg p-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-lg font-medium mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("bonus.referral_links")}
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("bonus.referral_link_label")}
                </label>
                <div className="flex mt-1">
                  <input
                    type="text"
                    value={bonusData.referralLink}
                    readOnly
                    className={`flex-1 rounded-l-lg px-3 py-2 ${
                      isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  />
                  <button
                    onClick={() => handleCopyLink(bonusData.referralLink)}
                    className={`px-4 rounded-r-lg ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {t("bonus.copy_button")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleWithdraw}
            className={`py-3 px-4 rounded-lg transition-colors duration-200 ${
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
          </button>
        </div>
      )}
    </div>
  );
};

export default BonusPage;
