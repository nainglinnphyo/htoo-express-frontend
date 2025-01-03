import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedPageTransitionProps {
	children: ReactNode;
}

const pageVariants = {
	initial: {
		opacity: 0,
		x: '-100%',
	},
	in: {
		opacity: 1,
		x: 0,
	},
	out: {
		opacity: 0,
		x: '100%',
	},
};

const pageTransition = {
	type: 'tween',
	ease: 'anticipate',
	duration: 0.5,
};

export function AnimatedPageTransition({ children }: AnimatedPageTransitionProps) {
	return (
		<motion.div
			initial="initial"
			animate="in"
			exit="out"
			variants={pageVariants}
			transition={pageTransition}
			layout
		>
			{children}
		</motion.div>
	);
}
