import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useRoleUser } from "../contexts/RoleUserContext";

interface HeaderProps {
  title: string;
  backButton?: boolean;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  backButton = false,
  toggleTheme,
  isDarkMode,
}) => {
  const navigate = useNavigate();
  const { role } = useRoleUser();
  const { t, i18n } = useTranslation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");

  const handleBack = () => {
    navigate(-1);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  const cycleLanguage = () => {
    const languages = ["en", "ru", "uk"];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    changeLanguage(languages[nextIndex]);
  };

  return (
    <header
      className={`sticky top-0 z-20 px-2 sm:px-4 py-3 w-full border-b transition-colors duration-300 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          {backButton ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              onClick={handleBack}
              className="mr-3 p-1 rounded-full hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 sm:h-6 w-5 sm:w-6 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
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
            </motion.button>
          ) : (
            <Link to="/" className="mr-4">
              <svg
                className="h-7 sm:h-8 w-auto"
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
        </div>

        <div className="flex items-center space-x-2 relative">
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg top-full ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="grid grid-cols-2 gap-2 p-2">
                <Link
                  to="/"
                  className={`flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={toggleMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mb-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="text-xs">{t("header.home")}</span>
                </Link>

                <Link
                  to="/catalog"
                  className={`flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={toggleMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mb-1 text-orange-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  <span className="text-xs">{t("header.catalog")}</span>
                </Link>

                <Link
                  to="/support"
                  className={`flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={toggleMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mb-1 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636a9 9 0 11-12.728 0M12 9v2m0 4h.01"
                    />
                  </svg>
                  <span className="text-xs">{t("header.support")}</span>
                </Link>

                <Link
                  to="/agreement"
                  className={`flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={toggleMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mb-1 text-pink-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs">{t("header.agreement")}</span>
                </Link>
              </div>
            </motion.div>
          )}

          {toggleTheme && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              onClick={toggleTheme}
              className="p-2 rounded-full m-0 bg-gray-700 hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center cursor-pointer"
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              <span className="text-lg sm:text-xl">
                {isDarkMode ? "☀️" : "🌙"}
              </span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            onClick={cycleLanguage}
            className="p-2 rounded-full m-0 duration-200 flex items-center justify-center cursor-pointer"
            title="Cycle Language"
          >
            <span className="text-lg sm:text-xl">
              {language === "en" ? "EN" : language === "ru" ? "RU" : "UK"}
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            onClick={toggleProfile}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200 m-0 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 sm:h-6 w-5 sm:w-6 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
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
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            onClick={toggleMenu}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200 m-0 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 sm:h-6 w-5 sm:w-6 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </motion.button>
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`absolute right-0 mt-2 min-w-full sm:w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg top-full ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="py-2 w-max">
              {role === "admin" && (
                  <Link
                  to="/admin"
                  className={`flex items-center px-4 py-2 text-sm hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={() => setIsProfileOpen(false)}
                  >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 6h18M3 14h18M3 18h18M3 6h18v12H3z"
                    />
                  </svg>
                  <div>
                    <p>Adminka</p>
                  </div>
                  </Link>
                )}                <Link
                  to="/deposit"
                  className={`flex items-center px-4 py-2 text-sm hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={() => setIsProfileOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                    />
                  </svg>
                  <div>
                    <p>{t("header.deposit")}</p>
                  </div>
                </Link>

                <Link
                  to="/purchases"
                  className={`flex items-center px-4 py-2 text-sm hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={() => setIsProfileOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <div>
                    <p>{t("header.purchases")}</p>
                  </div>
                </Link>

                <Link
                  to="/payments"
                  className={`flex items-center px-4 py-2 text-sm hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={() => setIsProfileOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M3 6h18M3 14h18M3 18h18M3 6h18v12H3z"
                    />
                  </svg>
                  <div>
                    <p>{t("header.payments")}</p>
                  </div>
                </Link>

                <Link
                  to="/bonus"
                  className={`flex items-center px-4 py-2 text-sm hover:bg-gray-700 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  onClick={() => setIsProfileOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a2 2 0 00-2-2h-3m-6 4H7a2 2 0 01-2-2v-2m0-6V6a2 2 0 012-2h10a2 2 0 012 2v6m-6-4V4"
                    />
                  </svg>
                  <div>
                    <p>{t("header.bonus")}</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
