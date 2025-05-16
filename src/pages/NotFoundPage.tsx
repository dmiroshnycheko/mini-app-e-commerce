import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import {
	buttonVariants,
	cardVariants,
	emojiVariants,
} from '../utils/animations'

interface NotFoundPageProps {
	toggleTheme?: () => void
	isDarkMode?: boolean
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({
	toggleTheme,
	isDarkMode,
}) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	return (
		<div
			className={`flex flex-col min-h-screen w-full ${
				isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
			}`}
		>
			<Header
				title={t('not_found.title')}
				backButton
				toggleTheme={toggleTheme}
				isDarkMode={isDarkMode}
			/>
			<motion.div
				variants={cardVariants}
				initial='hidden'
				animate='visible'
				className='flex flex-col items-center justify-center flex-grow p-4 sm:p-6 lg:p-8 w-full max-w-md mx-auto'
			>
				<motion.div
					variants={emojiVariants}
					className='text-5xl sm:text-6xl mb-4'
				>
					😕
				</motion.div>
				<motion.h3 variants={cardVariants} className='text-xl sm:text-2xl mb-2'>
					{t('not_found.title')}
				</motion.h3>
				<motion.p
					variants={cardVariants}
					className={`mb-6 text-center text-sm sm:text-base ${
						isDarkMode ? 'text-gray-400' : 'text-gray-600'
					}`}
				>
					{t('not_found.message')}
				</motion.p>
				<motion.button
					variants={buttonVariants}
					whileHover={{ scale: 1.05 }}
					transition={{ duration: 0.2, ease: 'easeOut' }}
					onClick={() => navigate('/')}
					className={`w-full sm:w-fit sm:min-w-[160px] py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 cursor-pointer ${
						isDarkMode
							? 'bg-blue-600 hover:bg-blue-700 text-white'
							: 'bg-blue-500 hover:bg-blue-600 text-white'
					}`}
				>
					{t('not_found.home_button')}
				</motion.button>
			</motion.div>
		</div>
	)
}

export default NotFoundPage
