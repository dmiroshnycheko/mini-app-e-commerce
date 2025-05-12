import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRoleUser } from "../contexts/RoleUserContext";

interface HeaderProps {
  title: string;
  backButton?: boolean;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, backButton = false, toggleTheme, isDarkMode }) => {
  const navigate = useNavigate();
  const { role } = useRoleUser();
  const { t, i18n } = useTranslation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsProfileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-20 px-4 py-3 w-full border-b transition-colors duration-300 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {backButton ? (
            <button
              onClick={handleBack}
              className="mr-3 p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          ) : (
            <Link to="/" className="mr-4">
              <svg
                className="h-8 w-auto"
                width="2500"
                height="2500"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMinYMin meet"
              >
                <path
                  className={isDarkMode ? "fill-yellow-400" : "fill-gray-800"}
                  d="M245.235 153.524c14.012-14.012 14.011-36.811 0-50.823-6.787-6.788-15.812-10.525-25.411-10.525-2.28 0-4.523.208-6.712.617 9.538-6.524 15.72-17.495 15.72-29.694 0-19.816-16.122-35.937-35.938-35.937-12.223 0-23.213 6.205-29.733 15.776 2.157-11.377-1.226-23.537-9.87-32.18C146.506 3.97 137.48.232 127.882.232c-9.6 0-18.624 3.738-25.412 10.526-8.643 8.643-12.026 20.803-9.87 32.18-6.519-9.57-17.509-15.776-29.733-15.776-19.815 0-35.936 16.12-35.936 35.937 0 12.2 6.18 23.17 15.718 29.694a36.487 36.487 0 0 0-6.711-.617c-9.6 0-18.624 3.738-25.411 10.526C3.738 109.489 0 118.514 0 128.112c0 9.6 3.738 18.624 10.526 25.412 6.787 6.787 15.812 10.526 25.41 10.526 2.28 0 4.523-.208 6.712-.618-9.538 6.525-15.718 17.496-15.718 29.695 0 19.815 16.12 35.936 35.936 35.936 12.224 0 23.215-6.206 29.734-15.776-2.157 11.378 1.226 23.538 9.87 32.18 6.787 6.788 15.812 10.526 25.41 10.526 9.6 0 18.625-3.738 25.412-10.526 8.643-8.643 12.026-20.803 9.869-32.18 6.52 9.57 17.51 15.776 29.733 15.776 19.816 0 35.937-16.12 35.937-35.936 0-12.2-6.18-23.17-15.719-29.695 2.189.41 4.433.618 6.712.618 9.599 0 18.624-3.739 25.411-10.526"
                />
              </svg>
            </Link>
          )}
          <h1 className={`text-xl font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>{title}</h1>
        </div>

        <div className="flex items-center space-x-2">
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span className="text-xl">
                {isDarkMode ? "☀️" : "🌙"}
              </span>
            </button>
          )}
          <button
            onClick={toggleProfile}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>

          {isProfileOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg top-full ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="py-2">
                {role === "admin" && (
                  <Link
                    to="/admin"
                    className={`block px-4 py-2 text-sm hover:bg-gray-700 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <p>Adminka</p>
                  </Link>
                )}
                <Link
                  to="/"
                  className={`block px-4 py-2 text-sm hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={() => setIsProfileOpen(false)}
                >
                  {t("header.home")}
                </Link>
                <Link
                  to="/catalog"
                  className={`block px-4 py-2 text-sm hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={() => setIsProfileOpen(false)}
                >
                  {t("header.catalog")}
                </Link>
                <Link
                  to="/purchases"
                  className={`block px-4 py-2 text-sm hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={() => setIsProfileOpen(false)}
                >
                  {t("header.purchases")}
                </Link>
                <Link
                  to="/payments"
                  className={`block px-4 py-2 text-sm hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={() => setIsProfileOpen(false)}
                >
                  {t("header.payments")}
                </Link>
                <Link
                  to="/bonus"
                  className={`block px-4 py-2 text-sm hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={() => setIsProfileOpen(false)}
                >
                  {t("header.bonus")}
                </Link>
                <Link
                  to="/deposit"
                  className={`block px-4 py-2 text-sm hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={() => setIsProfileOpen(false)}
                >
                  {t("header.deposit")}
                </Link>

                <div className="border-t border-gray-700 my-2"></div>
                <button
                  onClick={() => changeLanguage("en")}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => changeLanguage("ru")}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Русский
                </button>
                <button
                  onClick={() => changeLanguage("uk")}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Українська
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
