'use client'

import React from 'react'
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


function InvoicePreview() {
	const searchParams = useSearchParams()
	const code = searchParams.get("code") || "";
	const price = searchParams.get("price") || "";
	const count = parseInt(searchParams.get("count")?.toString() || '') || 0;
	console.log({ count })
	const handlePrint = () => {
		window.print()
	}

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
				{Array.from({ length: count }, (_, i) => i + 1).map((c, index) => (
					<Grid.Col span={3} style={{ height: '1.8cm', width: '2.8cm', justifyItems: "center", margin: '15px' }}>
						<div
							key={index}
							style={{
								// width: '4.66cm',
								// height: '4.66cm',
								pageBreakInside: 'avoid',
								display: 'flex',
								flexDirection: "column",
							}}
						>
							<span className="text-sm mb-1">Ks {price}</span>
							<Barcode
								value={code}
								width={1}
								height={24}
								margin={0}
								displayValue={true}
								fontSize={10}
							/>
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

