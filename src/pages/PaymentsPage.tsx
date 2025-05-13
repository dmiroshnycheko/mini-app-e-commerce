import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

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
        const mockTransactions: Transaction[] = [
          {
            id: 1,
            type: "deposit",
            amount: 100,
            date: new Date("2025-05-09T10:15:22"),
          },
          {
            id: 2,
            type: "purchase",
            amount: -15.99,
            date: new Date("2025-05-08T14:32:11"),
          },
          {
            id: 3,
            type: "purchase",
            amount: -45.5,
            date: new Date("2025-05-05T10:17:45"),
          },
          {
            id: 4,
            type: "deposit",
            amount: 50,
            date: new Date("2025-05-01T09:45:30"),
          },
        ];
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
            className={`w-12 h-12 border-4 rounded-full animate-spin ${
              isDarkMode
                ? "border-blue-500 border-t-transparent"
                : "border-blue-600 border-t-transparent"
            }`}
          ></div>
        </div>
      ) : (
        <div className="p-4 w-full overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-xl mb-2">{t("payments.no_transactions")}</h3>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("payments.no_transactions_message")}
              </p>
              <button
                onClick={() => navigate("/deposit")}
                className={`py-3 px-4 rounded-lg transition-colors duration-200 ${
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
              className={`rounded-lg p-4 ${
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
                      className={`py-3 px-4 text-left text-sm font-medium ${
                        isDarkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {t("payments.type_deposit")}
                    </th>
                    <th
                      className={`py-3 px-4 text-left text-sm font-medium ${
                        isDarkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {t("payments.amount")}
                    </th>
                    <th
                      className={`py-3 px-4 text-left text-sm font-medium ${
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
                      <td className="py-3 px-4">
                        {transaction.type === "deposit"
                          ? t("payments.type_deposit")
                          : t("payments.type_purchase")}
                      </td>
                      <td
                        className={`py-3 px-4 ${
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
                        className={`py-3 px-4 ${
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
