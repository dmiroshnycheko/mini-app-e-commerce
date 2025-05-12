import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';

interface Transaction {
  id: number;
  type: 'purchase' | 'deposit';
  amount: number;
  date: Date;
}

const PaymentsPage: React.FC = () => {
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
            type: 'deposit',
            amount: 100,
            date: new Date('2025-05-09T10:15:22'),
          },
          {
            id: 2,
            type: 'purchase',
            amount: -15.99,
            date: new Date('2025-05-08T14:32:11'),
          },
          {
            id: 3,
            type: 'purchase',
            amount: -45.5,
            date: new Date('2025-05-05T10:17:45'),
          },
          {
            id: 4,
            type: 'deposit',
            amount: 50,
            date: new Date('2025-05-01T09:45:30'),
          },
        ];
        setTransactions(mockTransactions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900 text-white">
      <Header title={t('payments.title')} backButton />
      {loading ? (
        <div className="flex flex-col items-center justify-center flex-grow p-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="p-4 w-full">
          {transactions.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-xl mb-2">{t('payments.no_transactions')}</h3>
              <p className="text-gray-400 mb-6">{t('payments.no_transactions_message')}</p>
              <button
                onClick={() => navigate('/deposit')}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {t('payments.deposit_button')}
              </button>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="py-3 px-4 text-left text-sm font-medium">{t('payments.type_deposit')}</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">{t('payments.amount')}</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">{t('payments.date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-gray-700">
                      <td className="py-3 px-4">
                        {transaction.type === 'deposit' ? t('payments.type_deposit') : t('payments.type_purchase')}
                      </td>
                      <td
                        className={`py-3 px-4 ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-400">{formatDate(transaction.date)}</td>
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