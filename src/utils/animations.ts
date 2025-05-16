import type { Variants } from 'framer-motion'

export const cardVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.3,
			staggerChildren: 0.15,
		},
	},
}

export const headerVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.4, ease: 'easeOut' },
	},
}

export const rowVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: 'easeOut' },
	},
}

export const notificationVariants: Variants = {
	hidden: { opacity: 0, y: -10 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.3, ease: 'easeOut' },
	},
	exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
}

export const bubbleVariants: Variants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.4, ease: 'easeOut' },
	},
}

export const instructionVariants: Variants = {
	hidden: { opacity: 0, scale: 0.98 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.5, ease: 'easeOut' },
	},
}

export const buttonVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.4, ease: 'easeOut' },
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: { duration: 0.2, ease: 'easeIn' },
	},
}

export const emojiVariants: Variants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.5, ease: 'easeOut' },
	},
}

export const modalVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.3, ease: 'easeOut' },
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: { duration: 0.2, ease: 'easeIn' },
	},
}
