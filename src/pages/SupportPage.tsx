import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';

const SupportPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900 text-white">
      <Header title={t('support.title')} backButton />
      <div className="p-4 w-full">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">{t('support.title')}</h3>
          <p className="text-gray-400 mb-4">
            {t('support.contact_message')}
          </p>
          <div className="space-y-2">
            <div>
              <span className="text-gray-400">{t('support.telegram_label')}</span>{' '}
              <a
                href="https://t.me/support_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                @SupportBot
              </a>
            </div>
            <div>
              <span className="text-gray-400">{t('support.working_hours_label')}</span> {t('support.working_hours')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;