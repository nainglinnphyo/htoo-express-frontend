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
import { FormattedNumber } from '@/components/Text/NumberFormatter'


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
		// setCartItem(i)
		if (items.reduce((a, b) => a + b.quantity, 0) === 21) {
			setCartItem(i)
		} else {
			setCartItem([])
		}

	}, [items])

	if (items.reduce((a, b) => a + b.quantity, 0) !== 21) {
		return <>Please insert 21 barcode</>
	}

	return (
		// h={`${2 * cartItem.length}cm`}
		<Container className="invoice-container" w={'14cm'}>
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
			<SimpleGrid cols={3} style={{ justifyContent: "center", alignItems: 'center' }}>

				{cartItem.map((c, index) => (

					<div style={{ justifyItems: "center", marginBottom: 10, marginTop: index >= 9 && index <= 11 ? 14 : index >= 12 && index <= 14 ? 16 : index >= 15 && index <= 18 ? 18 : index >= 19 && index <= 21 ? 17 : 0 }}>

						<div
							key={index}
							style={{
								pageBreakInside: 'avoid',
								display: 'flex',
								flexDirection: "column",
								justifyContent: 'start'
							}}
						>
							<div className="mb-1" style={{ display: "flex", alignItems: 'center' }}>
								<span style={{ fontSize: 10 }}>Ks &nbsp;</span>
								<FormattedNumber value={c.price} style={{ fontSize: 10 }} />
							</div>
							<Barcode
								value={c.code}
								width={0.9}
								height={24}
								margin={0}
								displayValue={false}
								fontSize={10}
							/>
							<span className=" mb-1" style={{ fontSize: '8px' }}>{c.code}</span>
							<span className=" mb-1" style={{ fontSize: '8px' }}>{c.category}</span>
						</div>
					</div>
				))}
			</SimpleGrid>
		</Container >
	)
}

export default InvoicePreview

