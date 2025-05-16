import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import Header from '../components/Header'
import { buttonVariants, cardVariants } from '../utils/animations'

interface AgreementPageProps {
	toggleTheme?: () => void
	isDarkMode?: boolean
}

const AgreementPage: React.FC<AgreementPageProps> = ({
	toggleTheme,
	isDarkMode,
}) => {
	const { t } = useTranslation()
	const [isAgreed, setIsAgreed] = useState(false)

	const handleAgree = () => {
		setIsAgreed(true)
		console.log('User agreed to terms')
	}

	const agreementText = `
ПУБЛІЧНА ОФЕРТА

Ця Публічна оферта (далі – Оферта) є пропозицією укласти договір на зазначених нижче умовах між фізичною особою (далі – Користувач) та адміністрацією Telegram-бота (далі – Адміністрація).

1. Загальні положення
1.1. Ця Оферта регулює порядок надання послуг Telegram-ботом, включаючи, але не обмежуючись, поповнення балансу, покупку цифрових товарів, завантаження файлів, участь у бонусній програмі.
1.2. Використання Telegram-бота означає повну та безумовну згоду Користувача з умовами цієї Оферти.

2. Предмет договору
2.1. Адміністрація надає Користувачу доступ до Telegram-бота для здійснення покупок цифрових товарів, поповнення балансу, участі в бонусній програмі та інших функцій, описаних у Telegram-боті.
2.2. Користувач зобов’язується використовувати Telegram-бот відповідно до умов цієї Оферти та чинного законодавства.

3. Права та обов’язки сторін
3.1. Адміністрація має право:
- Змінювати умови Оферти в односторонньому порядку.
- Призупиняти надання послуг у разі порушення Користувачем умов Оферти.
3.2. Користувач зобов’язується:
- Надавати достовірну інформацію при використанні Telegram-бота.
- Не використовувати Telegram-бот для незаконних цілей.

4. Відповідальність
4.1. Адміністрація не несе відповідальності за будь-які збитки, спричинені використанням Telegram-бота.
4.2. Користувач несе повну відповідальність за збереження конфіденційності своїх даних.

5. Термін дії Оферти
5.1. Оферта набуває чинності з моменту її акцепту Користувачем і діє до моменту припинення використання Telegram-бота.

6. Інші умови
6.1. Усі спори, що виникають у зв’язку з цією Офертою, вирішуються відповідно до чинного законодавства України.
6.2. У разі виникнення питань Користувач може звернутися до служби підтримки через Telegram-бот.

Ця Оферта складена українською мовою та є офіційним документом.
`

	return (
		<div
			className={`flex flex-col min-h-screen w-full ${
				isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
			}`}
		>
			<Header
				title={t('agreement.title')}
				backButton
				toggleTheme={toggleTheme}
				isDarkMode={isDarkMode}
			/>
			<div className='p-4 sm:p-6 lg:p-8 w-full max-w-3xl mx-auto'>
				<motion.div
					variants={cardVariants}
					initial='hidden'
					animate='visible'
					className={`rounded-lg p-4 sm:p-6 lg:p-8 ${
						isDarkMode ? 'bg-gray-800' : 'bg-white'
					}`}
				>
					<pre
						className={`text-sm sm:text-base whitespace-pre-wrap ${
							isDarkMode ? 'text-gray-200' : 'text-gray-700'
						}`}
					>
						{agreementText}
					</pre>
					<AnimatePresence>
						{!isAgreed && (
							<motion.button
								variants={buttonVariants}
								initial='hidden'
								animate='visible'
								exit='exit'
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.2, ease: 'easeOut' }}
								onClick={handleAgree}
								className={`w-full sm:w-fit sm:min-w-[160px] mt-4 sm:mt-6 py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 cursor-pointer ${
									isDarkMode
										? 'bg-blue-600 hover:bg-blue-700 text-white'
										: 'bg-blue-500 hover:bg-blue-600 text-white'
								}`}
							>
								{t('agreement.agree_button')}
							</motion.button>
						)}
					</AnimatePresence>
				</motion.div>
			</div>
		</div>
	)
}

export default AgreementPage
