import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

interface DepositPageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const DepositPage: React.FC<DepositPageProps> = ({ toggleTheme, isDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

  const handleDeposit = () => {
    if (parseFloat(amount) > 0) {
      setShowInstructions(true);
    }
  };

  const handleConfirm = () => {
    console.log(`Deposit of $${amount} confirmed`);
    navigate("/");
  };

  return (
    <div
      className={`flex flex-col min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        title={t("deposit.title")}
        backButton
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <div className="p-4 w-full flex flex-col gap-4">
        {!showInstructions ? (
          <>
            <div className={`rounded-lg p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-lg font-medium mb-4">{t("deposit.amount_label")}</h3>
              <div className={`flex items-center rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`flex-1 bg-transparent px-4 py-3 outline-none ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                />
                <span className={`pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>$</span>
              </div>
            </div>
            <button
              onClick={handleDeposit}
              className={`py-3 px-4 rounded-lg transition-colors duration-200 ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } ${!amount || parseFloat(amount) <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              {t("deposit.deposit_button")}
            </button>
          </>
        ) : (
          <div className={`rounded-lg p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-lg font-medium mb-4">{t("deposit.instructions_title")}</h3>
            <p className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {t("deposit.instructions_message", { amount })}
            </p>
            <div className={`p-3 rounded-lg mb-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
              <code className="text-sm break-all">Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>
            </div>
            <p className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {t("deposit.confirm_message")}
            </p>
            <button
              onClick={handleConfirm}
              className={`w-full py-3 px-4 rounded-lg transition-colors duration-200 ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {t("deposit.confirm_button")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositPage;