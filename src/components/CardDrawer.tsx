'use client'

import { useCartStore } from "@/store/barcodeStore"
import { Button, Drawer, NumberInput, Card, Text, Group, Divider, Stack, Title, Center, ThemeIcon } from "@mantine/core"
import { IconX, IconShoppingCart } from '@tabler/icons-react'

import { useState } from "react"

export function CartDrawer({ opened, close }: { opened: boolean, close: () => void }) {
	const { items, toggleCart, removeItem, updateQuantity, updatePrice } = useCartStore()
	const [quantities, setQuantities] = useState<Record<string, string>>({})
	const [prices, setPrices] = useState<Record<string, string>>({})

	const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

	const handleQuantityChange = (code: string, value: string) => {
		setQuantities((prev) => ({ ...prev, [code]: value }))
		const quantity = parseInt(value)
		if (!isNaN(quantity)) {
			updateQuantity(code, quantity)
		}
	}

	const handlePriceChange = (code: string, value: string) => {
		setPrices((prev) => ({ ...prev, [code]: value }))
		const price = parseInt(value)
		if (!isNaN(price)) {
			updatePrice(code, price)
		}
	}

	const handleBlur = (code: string) => {
		const quantity = parseInt(quantities[code])
		if (isNaN(quantity) || quantity < 0) {
			const item = items.find((item) => item.code === code)
			if (item) {
				setQuantities((prev) => ({ ...prev, [code]: item.quantity.toString() }))
			}
		}
	}
	const handleBlurPrice = (code: string) => {
		const price = parseInt(prices[code])
		if (isNaN(price) || price < 0) {
			const item = items.find((item) => item.code === code)
			if (item) {
				setPrices((prev) => ({ ...prev, [code]: item.price.toString() }))
			}
		}
	}

	const handleGenerate = () => {
		toggleCart()
		window.location.assign(`https://htooexpress.vercel.app/dashboard/print`)
	}

	return (
		<Drawer
			opened={opened}
			onClose={toggleCart}
			position="right"
			size="lg"
			// overlayOpacity={0.3}
			// overlayBlur={2}
			padding="xl"
		>
			<Stack mt="md">
				{items.length > 0 ? (
					items.map((item) => (
						<Card
							key={item.code}
							shadow="sm"
							padding="lg"
							radius="md"
							withBorder
						>
							<Group align="center">
								<div>
									<Title order={4}>{item.code}</Title>
									<Title order={4}>{item.category}</Title>
									<Text size="sm" c="dimmed">${item.price.toFixed(2)}</Text>
								</div>
								<Button
									variant="light"
									color="red"
									size="xs"
									onClick={() => removeItem(item.code)}
								>
									<IconX size={16} />
								</Button>
							</Group>
							<Divider my="sm" />
							<Group >
								<Text size="sm">Quantity:</Text>
								<NumberInput
									min={0}
									value={quantities[item.code] ?? item.quantity}
									onChange={(e) => handleQuantityChange(item.code, e?.toString() || '')}
									onBlur={() => handleBlur(item.code)}
									size="sm"
									style={{ width: 80 }}
								/>
							</Group>
							<Divider my="sm" />
							<Group >
								<Text size="sm">Price:</Text>
								<NumberInput
									min={0}
									value={quantities[item.code] ?? item.price}
									onChange={(e) => handlePriceChange(item.code, e?.toString() || '')}
									onBlur={() => handleBlurPrice(item.code)}
									size="sm"
									style={{ width: 80 }}
								/>
							</Group>
						</Card>
					))
				) : (
					<Center>
						<Stack align="center">
							<ThemeIcon variant="light" radius="xl" size="lg">
								<IconShoppingCart size={24} />
							</ThemeIcon>
							<Text color="dimmed">Your cart is empty</Text>
						</Stack>
					</Center>
				)}
				{items.length > 0 && (
					<Card shadow="md" padding="lg" radius="md" withBorder>
						<Group>
							<Text>Total:</Text>
							<Title order={3}>{items.reduce((a, b) => {
								return a + b.quantity
							}, 0)} barcode</Title>
						</Group>
						<Button fullWidth variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 105 }} mt="md" onClick={handleGenerate}>
							Generate Barcode
						</Button>
					</Card>
				)}
			</Stack>
		</Drawer>
	)
}
