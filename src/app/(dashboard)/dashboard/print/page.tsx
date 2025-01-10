'use client'

import React, { useEffect, useState } from 'react'
import {
	Container,
	Text,
	Title,
	Button,
	Grid
} from '@mantine/core'
import { IconPrinter } from '@tabler/icons-react'
import Barcode from 'react-barcode'
import './print.css'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/barcodeStore'


function InvoicePreview() {
	// const searchParams = useSearchParams()
	// const code = searchParams.get("code") || "";
	// const price = searchParams.get("price") || "";
	// const category = searchParams.get("category") || "";
	// const count = parseInt(searchParams.get("count")?.toString() || '') || 0;

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
		setCartItem(i)
	}, [items])

	return (
		<Container className="invoice-container">
			<div className="no-print">
				<Title order={3}>Invoice Preview</Title>
				<Text size="sm" mb="sm" fw={900}>Invoice ID</Text>
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
			<Grid mt={18}>
				{cartItem.map((c, index) => (
					<Grid.Col span={3} style={{ height: '1.8cm', width: '2.8cm', justifyItems: "center", margin: '15px' }}>
						<div
							key={index}
							style={{
								pageBreakInside: 'avoid',
								display: 'flex',
								flexDirection: "column",
							}}
						>
							<span className="text-sm mb-1" style={{ fontSize: '10px' }}>Ks {c.price}</span>
							<Barcode
								value={c.code}
								width={1}
								height={24}
								margin={0}
								displayValue={false}
								fontSize={10}
							/>
							<span className=" mb-1" style={{ fontSize: '10px' }}>{c.category}</span>
						</div>
					</Grid.Col>
				))}
				{/* <Grid.Col span={4}>1</Grid.Col>
					<Grid.Col span={4}>2</Grid.Col>
					<Grid.Col span={4}>3</Grid.Col> */}
			</Grid>



		</Container >
	)
}

export default InvoicePreview

