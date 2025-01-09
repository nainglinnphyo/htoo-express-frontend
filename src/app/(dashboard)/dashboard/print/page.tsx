'use client'

import { useState } from 'react'
import { Box, Button, Container, Flex, Grid, Paper, Space, Text } from '@mantine/core'
import Barcode from 'react-barcode'

const barcodeData = [
	'123456789012',
	'123456789012',
	'123456789012',
	'123456789012',
	'123456789012',
	'123456789012',
	'123456789012',
	'123456789012',
	'123456789012',
	'123456789012',
	'123456789012',
	'123456789012',
	'123456789012',
	'123456789012',
	'123456789012',
]

export default function CenteredBarcodeGrid() {
	const [isPrinting, setIsPrinting] = useState(false)

	const handlePrint = () => {
		setIsPrinting(true)
		window.print()
		setIsPrinting(false)
	}

	return (
		<Container className="bg-gray-100 p-4">
			<Button
				onClick={handlePrint}
				className="mb-4"
				style={{ display: isPrinting ? 'none' : 'block' }}
			>
				Print Barcodes
			</Button>
			<Space mb={'md'} />
			<Grid gutter="xs">
				{barcodeData.map((code, index) => (
					<Grid.Col key={index} span={4}>
						<Paper
							className="flex items-center justify-center bg-white p-4"
							style={{
								pageBreakInside: 'avoid',
								border: '1px solid #e9ecef',
								height: '110px', // Adjust this value to change the height of each paper
							}}
						>
							<Flex direction={'column'} align={'center'}>
								<Text>Ks 12,000</Text>
								<Barcode
									value={code}
									width={1.5}
									height={50}
									margin={5}
									displayValue={true}
									fontSize={12}
								/>
							</Flex>
						</Paper>
					</Grid.Col>
				))}
			</Grid>
			<style jsx global>{`
        @media print {
          @page {
            size: auto;
            margin: 10mm;
          }
          body {
            background-color: #ffffff;
          }
          .mantine-Button-root {
            display: none !important;
          }
        }
      `}</style>
		</Container >
	)
}

