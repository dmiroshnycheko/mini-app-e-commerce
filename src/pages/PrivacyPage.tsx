import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

interface PrivacyPageProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ toggleTheme, isDarkMode }) => {
  const { t } = useTranslation();
  const privacyText = `
    ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ

    1. Загальні положення
    1.1. Ця Політика конфіденційності описує, як Telegram-бот (далі – Бот) збирає, використовує та захищає персональні дані користувачів.
    1.2. Використання Бота означає згоду з цією Політикою.

    2. Збір інформації
    2.1. Бот збирає наступну інформацію:
    - Telegram ID користувача;
    - Ім’я користувача в Telegram;
    - Дані про транзакції та покупки.
    2.2. Інформація збирається автоматично через Telegram WebApp API.

    3. Використання інформації
    3.1. Зібрані дані використовуються для:
    - Надання доступу до функцій Бота;
    - Обробки платежів та покупок;
    - Адміністрування бонусної програми.
    3.2. Дані не передаються третім особам, крім випадків, передбачених законодавством.

    4. Захист даних
    4.1. Бот використовує сучасні методи шифрування для захисту даних.
    4.2. Доступ до даних мають лише уповноважені особи адміністрації.

    5. Права користувачів
    5.1. Користувачі мають право звернутися до підтримки для отримання інформації про свої дані або їх видалення.

    6. Контакти
    6.1. З питань конфіденційності звертайтесь до служби підтримки через Бот.
  `;

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
      <div className="p-4 w-full">
        <div className={`rounded-lg p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <pre
            className={`text-sm whitespace-pre-wrap ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {privacyText}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;