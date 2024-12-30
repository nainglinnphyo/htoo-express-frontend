import { motion } from 'framer-motion';
import { Card, Text, Flex, ActionIcon, Tooltip, NumberInput } from '@mantine/core';
import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import { FormattedNumber } from '@/components/Text/NumberFormatter';

interface AnimatedProductCardProps {
	id: string;
	name: string;
	price: number;
	quantity: number;
	onQuantityChange: (id: string, quantity: number) => void;
	onRemove: (id: string) => void;
}

const cardVariants = {
	initial: { opacity: 0, y: 50 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -50 },
};

export function AnimatedProductCard({
	id,
	name,
	price,
	quantity,
	onQuantityChange,
	onRemove,
}: AnimatedProductCardProps) {
	return (
		<motion.div
			layout
			initial="initial"
			animate="animate"
			exit="exit"
			variants={cardVariants}
			transition={{ type: 'spring', stiffness: 300, damping: 25 }}
		>
			<Card shadow="sm" p="sm" radius="md" withBorder>
				<Text fw={500} mb="xs">{name}</Text>
				<Flex justify="space-between" align="center">
					<Flex align="center">
						<ActionIcon size="sm" variant="subtle" onClick={() => onQuantityChange(id, quantity - 1)}>
							<IconMinus size={16} />
						</ActionIcon>
						<NumberInput
							hideControls
							value={quantity}
							onChange={(value) => onQuantityChange(id, value as number)}
							min={1}
							max={99}
							styles={{ input: { width: 54, textAlign: 'center' } }}
						/>
						<ActionIcon size="sm" variant="subtle" onClick={() => onQuantityChange(id, quantity + 1)}>
							<IconPlus size={16} />
						</ActionIcon>
					</Flex>
					<Flex align="center">
						<Text size="sm" mr={4}>Ks</Text>
						<FormattedNumber value={Number((quantity * price).toFixed(2))} fw={600} />
					</Flex>
					<Tooltip label="Remove from Voucher">
						<ActionIcon color="red" variant="subtle" onClick={() => onRemove(id)}>
							<IconTrash size={16} />
						</ActionIcon>
					</Tooltip>
				</Flex>
			</Card>
		</motion.div>
	);
}
