'use client'

import { IconShoppingCart } from "@tabler/icons-react"
import { Button } from '@mantine/core'
import { useCartStore } from "@/store/barcodeStore"


export function CartIcon() {
	const { items, toggleCart } = useCartStore()
	const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0)

	return (
		<Button
			variant="outline"
			size="icon"
			className="relative"
			onClick={toggleCart}
		>
			<IconShoppingCart className="h-5 w-5" />
			{totalQuantity > 0 && (
				<span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
					{totalQuantity}
				</span>
			)}
		</Button>
	)
}

