'use client'

import React, { useEffect, useState } from 'react'
import {
	Container,
	Text,
	Title,
	Button,
	Grid,
	SimpleGrid
} from '@mantine/core'
import { IconPrinter } from '@tabler/icons-react'
import Barcode from 'react-barcode'
import './print.css'
import { useCartStore } from '@/store/barcodeStore'


function InvoicePreview() {
	const [cartItem, setCartItem] = useState<{ code: string, price: number, category: string }[]>([])
	const { items } = useCartStore()
	const handlePrint = () => {
		window.print()
	}

	useEffect(() => {
		const i: any = [];
		for (let index = 0; index < items.length; index++) {
			const element = items[index];
			Array.from({ length: element.quantity }, (_, i) => i + 1).map((d) => {
				i.push({
					code: element.code,
					category: element.category,
					price: element.price
				})
			})
		}
		if (items.reduce((a, b) => a + b.quantity, 0) === 21) {
			setCartItem(i)
		} else {
			setCartItem([])
		}

	}, [items])

	return (
		// h={`${2 * cartItem.length}cm`}
		<Container className="invoice-container" w={'14cm'} bg={'indigo'}>
			<div className="no-print">
				<Button
					leftSection={<IconPrinter size={14} />}
					onClick={handlePrint}
					className="print-button"
					size="xs"
					fullWidth
				>
					Print
				</Button>
			</div>
			<SimpleGrid bg={'red'} cols={3} style={{ justifyContent: "center", alignItems: 'center' }}>
				{cartItem.map((c, index) => (
					<div style={{ justifyItems: "center", background: "green" }}>
						<div
							key={index}
							style={{
								pageBreakInside: 'avoid',
								display: 'flex',
								flexDirection: "column",
							}}
						>
							<span className="text-sm mb-1" style={{ fontSize: '8px' }}>Ks {c.price}</span>
							<Barcode
								value={c.code}
								width={0.75}
								height={24}
								margin={0}
								displayValue={false}
								fontSize={10}
							/>
							<span className=" mb-1" style={{ fontSize: '8px' }}>{c.category}</span>
						</div>
					</div>
				))}
			</SimpleGrid>



		</Container >
	)
}

export default InvoicePreview

