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

	return (
		<Container className="invoice-container">
			<div className="no-print" style={{ marginBottom: 10 }}>
				<Title order={3}>Invoice Preview</Title>
				<Text size="xs" mb="sm">Invoice ID: {data?.data.invoiceId}</Text>
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
					<Text size="xs"><strong>Customer:</strong> {data?.data.customer?.name}</Text>
					<Text size="xs"><strong>Phone:</strong> {data?.data.customer?.phone}</Text>
					<Text size="xs"><strong>Address:</strong> {data?.data.customer?.address}</Text>
				</Stack>

				{/* <Divider my="xs" /> */}

				<Table style={{ width: '100%', fontSize: '7pt' }}>
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
									<FormattedNumber value={product.perPrice} />
								</td>
								<td style={{ textAlign: 'right' }}>
									<FormattedNumber value={product.perPrice * product.quantity} />
								</td>
							</tr>
						))}
					</tbody>
				</Table>

				<Divider my="xs" />

				<Stack style={{ fontSize: '8pt' }}>
					<Flex justify="space-between">
						<Text>Subtotal:</Text>
						<FormattedNumber value={(data?.data.grossPrice || 0)} />
					</Flex>
					<Flex justify="space-between">
						<Text>Discount:</Text>
						<FormattedNumber value={data?.data.discountAmount || 0} />
					</Flex>
					<Flex justify="space-between">
						<Text>Tax:</Text>
						<FormattedNumber value={data?.data.tax || 0} />
					</Flex>
					<Divider my="xs" />
					<Flex justify="space-between">
						<Text fw={700}>Total:</Text>
						<FormattedNumber value={data?.data.grossPrice || 0} fw={700} />
					</Flex>
				</Stack>

				<Divider my="xs" />

				<Text size="xs">Thank you for your business!</Text>
			</motion.div>
		</Container>
	)
}

export default InvoicePreview

