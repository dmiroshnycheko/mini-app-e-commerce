import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900 text-white">
      <Header title={t('not_found.title')} backButton />
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-xl mb-2">{t('not_found.title')}</h3>
        <p className="text-gray-400 mb-6 text-center">
          {t('not_found.message')}
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
        >
          {t('not_found.home_button')}
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;