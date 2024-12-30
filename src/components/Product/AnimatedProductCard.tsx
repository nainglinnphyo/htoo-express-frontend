'use client'

import { motion } from 'framer-motion'
import { ActionIcon, Card, Flex, Text } from '@mantine/core'
import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react'
import { FormattedNumber } from '@/components/Text/NumberFormatter'

interface AnimatedProductCardProps {
	id: string
	name: string
	price: number
	quantity: number
	onQuantityChange: (id: string, quantity: number) => void
	onRemove: (id: string) => void
}

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
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.2 }}
		>
			<Card shadow="sm" p="sm" radius="md" withBorder>
				<Flex direction="column" gap="xs">
					<Text size="sm" lineClamp={2}>
						{name}
					</Text>
					<Flex justify="space-between" align="center">
						<Flex gap="xs" align="center">
							<ActionIcon
								variant="light"
								color="gray"
								onClick={() => onQuantityChange(id, quantity - 1)}
							>
								<IconMinus size={16} />
							</ActionIcon>
							<Text w={40} ta="center">
								{quantity}
							</Text>
							<ActionIcon
								variant="light"
								color="gray"
								onClick={() => onQuantityChange(id, quantity + 1)}
							>
								<IconPlus size={16} />
							</ActionIcon>
						</Flex>
						<Flex align="center" gap="xs">
							<Text size="sm">Ks</Text>
							<FormattedNumber value={price * quantity} fw={500} />
							<ActionIcon
								variant="light"
								color="red"
								onClick={() => onRemove(id)}
							>
								<IconTrash size={16} />
							</ActionIcon>
						</Flex>
					</Flex>
				</Flex>
			</Card>
		</motion.div>
	)
}
