import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';

const DepositPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleDeposit = () => {
    if (parseFloat(amount) > 0) {
      setShowInstructions(true);
    }
  };

  const handleConfirm = () => {
    console.log(`Deposit of $${amount} confirmed`);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900 text-white">
      <Header title={t('deposit.title')} backButton />
      <div className="p-4 w-full flex flex-col gap-4">
        {!showInstructions ? (
          <>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">{t('deposit.amount_label')}</h3>
              <div className="flex items-center bg-gray-700 rounded-lg">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-white px-4 py-3 outline-none"
                />
                <span className="pr-4 text-gray-400">$</span>
              </div>
            </div>
            <button
              onClick={handleDeposit}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
              disabled={!amount || parseFloat(amount) <= 0}
            >
              {t('deposit.deposit_button')}
            </button>
          </>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">{t('deposit.instructions_title')}</h3>
            <p className="text-gray-400 mb-4">
              {t('deposit.instructions_message', { amount: amount, 1: '<span className="text-white">' })}
            </p>
            <div className="bg-gray-700 p-3 rounded-lg mb-4">
              <code className="text-sm break-all">Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>
            </div>
            <p className="text-gray-400 mb-4">
              {t('deposit.confirm_message')}
            </p>
            <button
              onClick={handleConfirm}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
            >
              {t('deposit.confirm_button')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositPage;