import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
	cardVariants,
	bubbleVariants,
	instructionVariants,
} from '../utils/animations.ts'
import Header from '../components/Header'

interface DepositPageProps {
	toggleTheme?: () => void
	isDarkMode?: boolean
}

const DepositPage: React.FC<DepositPageProps> = ({
	toggleTheme,
	isDarkMode,
}) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [amount, setAmount] = useState('')
	const [showInstructions, setShowInstructions] = useState(false)

	const handleDeposit = () => {
		const numAmount = parseFloat(amount) || 0
		if (numAmount > 0) {
			setShowInstructions(true)
		}
	}

	const handleConfirm = () => {
		console.log(`Deposit of $${amount} confirmed`)
		navigate('/')
	}

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		// Allow only numbers and decimal point
		if (/^\d*\.?\d*$/.test(value)) {
			const numValue = parseFloat(value) || 0
			// Ensure amount doesn't go below zero
			setAmount(numValue < 0 ? '0' : value)
		}
	}

	const handleBubbleClick = (value: number) => {
		setAmount(value.toString())
	}

	return (
		<div
			className={`flex flex-col min-h-screen w-full ${
				isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
			}`}
		>
			<Header
				title={t('deposit.title')}
				backButton
				toggleTheme={toggleTheme}
				isDarkMode={isDarkMode}
			/>
			<div className='p-4 sm:p-6 lg:p-8 w-full max-w-md mx-auto flex flex-col gap-4 sm:gap-6'>
				{!showInstructions ? (
					<>
						<motion.div
							variants={cardVariants}
							initial='hidden'
							animate='visible'
							className={`rounded-lg p-4 sm:p- ${
								isDarkMode ? 'bg-gray-800' : 'bg-white'
							}`}
						>
							<h3 className='text-lg sm:text-xl font-medium mb-4'>
								{t('deposit.amount_label')}
							</h3>
							<div
								className={`flex items-center rounded-lg ${
									isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
								}`}
							>
								<input
									type='text'
									value={amount}
									onChange={handleAmountChange}
									placeholder='0.00'
									className={`flex-1 bg-transparent px-3 sm:px-4 py-2 sm:py-3 outline-none text-sm sm:text-base ${
										isDarkMode ? 'text-white' : 'text-gray-900'
									}`}
								/>
							</div>
						</motion.div>
						<motion.div
							variants={cardVariants}
							initial='hidden'
							animate='visible'
							className='flex flex-wrap gap-2 sm:gap-3 mb-4'
						>
							{[10, 50, 100, 1000].map(value => (
								<motion.button
									variants={bubbleVariants}
									whileHover={{ scale: 1.05 }}
									transition={{ duration: 0.2, ease: 'easeOut' }}
									key={value}
									onClick={() => handleBubbleClick(value)}
									className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base transition-colors duration-200 cursor-pointer ${
										isDarkMode
											? 'bg-gray-700 hover:bg-gray-600 text-white'
											: 'bg-gray-200 hover:bg-gray-300 text-gray-900'
									}`}
								>
									{value}
								</motion.button>
							))}
						</motion.div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.2, ease: 'easeOut' }}
							onClick={handleDeposit}
							className={`py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 cursor-pointer ${
								isDarkMode
									? 'bg-blue-600 hover:bg-blue-700 text-white'
									: 'bg-blue-500 hover:bg-blue-600 text-white'
							}`}
						>
							{t('deposit.deposit_button')}
						</motion.button>
					</>
				) : (
					<motion.div
						variants={instructionVariants}
						initial='hidden'
						animate='visible'
						className={`rounded-lg p-4 sm:p-6 ${
							isDarkMode ? 'bg-gray-800' : 'bg-white'
						}`}
					>
						<h3 className='text-lg sm:text-xl font-medium mb-4'>
							{t('deposit.instructions_title')}
						</h3>
						<p
							className={`text-sm sm:text-base mb-4 ${
								isDarkMode ? 'text-gray-400' : 'text-gray-600'
							}`}
						>
							{t('deposit.instructions_message', { amount })}
						</p>
						<div
							className={`p-3 rounded-lg mb-4 ${
								isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
							}`}
						>
							<code className='text-sm sm:text-base break-all'>
								Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
							</code>
						</div>
						<p
							className={`text-sm sm:text-base mb-4 ${
								isDarkMode ? 'text-gray-400' : 'text-gray-600'
							}`}
						>
							{t('deposit.confirm_message')}
						</p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.2, ease: 'easeOut' }}
							onClick={handleConfirm}
							className={`w-full sm:w-fit sm:min-w-[160px] py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 cursor-pointer ${
								isDarkMode
									? 'bg-blue-600 hover:bg-blue-700 text-white'
									: 'bg-blue-500 hover:bg-blue-600 text-white'
							}`}
						>
							{t('deposit.confirm_button')}
						</motion.button>
					</motion.div>
				)}
			</div>
		</div>
	)
}

export default DepositPage
