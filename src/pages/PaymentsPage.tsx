import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
// import { motion } from "framer-motion";
// import Header from "../components/Header";
// import {
//   containerVariants,
//   headerVariants,
//   rowVariants,
// } from "../utils/animations";

interface Transaction {
  id: number;
  type: "purchase" | "deposit";
  amount: number;
  date: Date;
}

interface PaymentsPageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const PaymentsPage: React.FC<PaymentsPageProps> = ({
  toggleTheme,
  isDarkMode,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 700));
        const mockTransactions: Transaction[] = [];
        setTransactions(mockTransactions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div
      className={`flex flex-col min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        title={t("payments.title")}
        backButton
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      {loading ? (
        <div className="flex flex-col items-center justify-center flex-grow p-4">
          <div
            className={`w-12 h-12 border-4 rounded-full ${
              isDarkMode
                ? "border-blue-500 border-t-transparent"
                : "border-blue-600 border-t-transparent"
            }`}
          ></div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 lg:p-8 w-full overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl sm:text-6xl mb-4">💳</div>
              <h3 className="text-xl sm:text-2xl mb-2">
                {t("payments.no_transactions")}
              </h3>
              <p
                className={`mb-6 text-sm sm:text-base ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("payments.no_transactions_message")}
              </p>
              <button
                onClick={() => navigate("/deposit")}
                className={`py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 cursor-pointer ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {t("payments.deposit_button")}
              </button>
            </div>
          ) : (
            <div
              className={`rounded-lg p-4 sm:p-6 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
              style={{ overflowY: "auto" }}
            >
              <table className="w-full">
                <thead>
                  <tr
                    className={`${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
                  >
                    <th
                      className={`py-2 sm:py-3 px-2 sm:px-4 text-left text-sm sm:text-base font-medium min-w-[100px] ${
                        isDarkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {t("payments.type_deposit")}
                    </th>
                    <th
                      className={`py-2 sm:py-3 px-2 sm:px-4 text-left text-sm sm:text-base font-medium min-w-[100px] ${
                        isDarkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {t("payments.amount")}
                    </th>
                    <th
                      className={`py-2 sm:py-3 px-2 sm:px-4 text-left text-sm sm:text-base font-medium min-w-[120px] ${
                        isDarkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {t("payments.date")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className={`border-t ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">
                        {transaction.type === "deposit"
                          ? t("payments.type_deposit")
                          : t("payments.type_purchase")}
                      </td>
                      <td
                        className={`py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base ${
                          transaction.amount > 0
                            ? isDarkMode
                              ? "text-green-400"
                              : "text-green-600"
                            : isDarkMode
                            ? "text-red-400"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td
                        className={`py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {formatDate(transaction.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
