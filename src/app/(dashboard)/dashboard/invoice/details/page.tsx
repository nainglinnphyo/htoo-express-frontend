'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
	Container,
	Text,
	Table,
	Flex,
	Stack,
	Divider,
	LoadingOverlay,
	Title,
	Button,
} from '@mantine/core'
import { IconPrinter } from '@tabler/icons-react'
import { FormattedNumber } from '@/components/Text/NumberFormatter'
import { useGetInvoiceDetails } from '@/services/invoice'
import { useSearchParams } from 'next/navigation'
import './print.css'
import { LogoAndAddress } from '@/components/Invoice/LogoAndAddress'

const fadeIn = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.5 } }
}

function InvoicePreview() {
	const searchParams = useSearchParams();
	const invoiceId = searchParams.get('id') || '';

	const { data, isLoading, refetch } = useGetInvoiceDetails(invoiceId)
	useEffect(() => {
		if (invoiceId) {
			refetch()
		}
	}, [invoiceId])

	const handlePrint = () => {
		window.print();
	}

	if (isLoading || !invoiceId) {
		return <LoadingOverlay visible={true} />
	}
	console.log({ data })
	return (
		<Container className="invoice-container">
			<div className="no-print">
				<Title order={3}>Invoice Preview</Title>
				<Text size="sm" mb="sm" fw={900}>Invoice ID: {data?.data.invoiceId}</Text>
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

			<motion.div initial="hidden" animate="visible" variants={fadeIn}>
				<LogoAndAddress />
				<Divider my="xs" />
				<Stack className='no-print'>
					<Text size="sm" fw={900}><strong>Customer:</strong> {data?.data.customer?.name}</Text>
					<Text size="sm" fw={900}><strong>Phone:</strong> {data?.data.customer?.phone}</Text>
					<Text size="sm" fw={900}><strong>Address:</strong> {data?.data.customer?.address}</Text>
				</Stack>

				<Table style={{ width: '100%' }} className='important-font'>
					<thead>
						<tr>
							<th style={{ textAlign: 'start' }}>Item</th>
							<th style={{ textAlign: 'right' }}>Qty</th>
							<th style={{ textAlign: 'right' }}>Price</th>
							<th style={{ textAlign: 'right' }}>Total</th>
						</tr>
					</thead>
					<tbody>
						{data?.data.invoiceOrderProduct.map((product) => (
							<tr key={product.productVariation.id}>
								<td>{product.productVariation.product?.name} {product.productVariation.size?.name} {product.productVariation.color?.name}</td>
								<td style={{ textAlign: 'right' }}>{product.quantity}</td>
								<td style={{ textAlign: 'right' }}>
									<Text className='important-font'> {product.perPrice}</Text>
								</td>
								<td style={{ textAlign: 'right' }}>
									<Text className='important-font'> {(product.perPrice) * product.quantity} </Text>
								</td>
							</tr>
						))}
					</tbody>
				</Table>

				<Divider my="xs" />

				<Stack style={{ fontWeight: 900 }}>
					<Flex justify="space-between" className='important-font'>
						<Text size="sm" fw={900} className='important-font'>Subtotal:</Text>
						<Text className='important-font'>{data?.data.grossPrice}</Text>
					</Flex>
					<Flex justify="space-between">
						<Text size="sm" fw={900} className='important-font'>Discount:</Text>
						<Text className='important-font'>{data?.data.discountAmount}</Text>
					</Flex>
					{/* <Flex justify="space-between">
						<Text size="sm" fw={900} className='important-font'>Payment Method:</Text>
						<Text className='important-font'>{data?.data.paymentMethod}</Text>
					</Flex> */}
					<Flex justify="space-between">
						<Text size="sm" fw={900} className='important-font'>Tax:</Text>
						<Text className='important-font'>{data?.data.tax}</Text>
					</Flex>
					{/* <Divider my="xs" /> */}
					<Flex justify="space-between">
						<Text size="sm" fw={900} className='important-font'>Total:</Text>
						<Text className='important-font'>{data?.data.grossPrice}</Text>
					</Flex>
				</Stack>

				<Divider my="xs" />

				<Text size="sm" fw={900}>Thank you for your business!</Text>
			</motion.div>
		</Container>
	)
}

export default InvoicePreview

