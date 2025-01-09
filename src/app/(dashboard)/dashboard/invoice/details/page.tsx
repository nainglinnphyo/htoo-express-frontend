'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
	Container,
	Card,
	Text,
	Group,
	ThemeIcon,
	Grid,
	Table,
	Flex,
	Stack,
	Divider,
	LoadingOverlay,
	Title,
	Paper,
	Button,
} from '@mantine/core'
import { IconUser, IconShoppingCart, IconFileInvoice, IconPrinter } from '@tabler/icons-react'
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
	console.log(data)

	const handlePrint = () => {
		window.print();
	}

	if (isLoading || !invoiceId) {
		return <LoadingOverlay visible={true} />
	}

	return (
		<Container size="md" py="xl" className="invoice-container">
			<motion.div initial="hidden" animate="visible" variants={fadeIn}>
				<LogoAndAddress />
				<Paper shadow="md" p="xl" radius="md" withBorder mb="xl" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }} className="invoice-header no-print">
					<Group mb="md">
						<Group>
							<Title order={2}>Invoice Preview</Title>
							<ThemeIcon size="xl" radius="md" variant="light">
								<IconFileInvoice size={28} />
							</ThemeIcon>
						</Group>
						<Button
							leftSection={<IconPrinter size={20} />}
							onClick={handlePrint}
							className="print-button"
						>
							Print
						</Button>
					</Group>
					<Text size="sm" color="dimmed" fw={600}>Invoice ID: {data?.data.invoiceId}</Text>
				</Paper>

				<Card shadow="sm" p="lg" radius="md" withBorder mb="xl" className="customer-info no-print">
					<Group mb="md">
						<ThemeIcon size="lg" color="blue" variant="light" radius="md">
							<IconUser size={20} />
						</ThemeIcon>
						<Text fw={500} size="lg">Customer Information</Text>
					</Group>
					<Grid>
						<Grid.Col span={6}>
							<Text><strong>Name:</strong> {data?.data.customer?.name}</Text>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text><strong>Phone:</strong> {data?.data.customer?.phone}</Text>
						</Grid.Col>
						<Grid.Col span={12}>
							<Text><strong>Address:</strong> {data?.data.customer?.address}</Text>
						</Grid.Col>
					</Grid>
				</Card>

				<Card shadow="sm" p="lg" radius="md" withBorder className="invoice-details">
					<Group mb="md" className='no-print'>
						<ThemeIcon size="lg" color="blue" variant="light" radius="md">
							<IconShoppingCart size={20} />
						</ThemeIcon>
						<Text fw={500} size="lg">Invoice Details</Text>
					</Group>
					<Table highlightOnHover style={{ width: '100%' }}>
						<thead>
							<tr>
								<th style={{ textAlign: 'start' }}>Product</th>
								<th className='no-print' style={{ textAlign: 'start' }}>Category</th>
								<th style={{ textAlign: 'right' }}>Price</th>
								<th style={{ textAlign: 'right' }}>Quantity</th>
								<th style={{ textAlign: 'right' }}>Total</th>
							</tr>
						</thead>
						<tbody>
							{data?.data.invoiceOrderProduct.map((product) => (
								<tr key={product.productVariation.id}>
									<td>{product.productVariation.product?.name} / {product.productVariation.size?.name} / {product.productVariation.color?.name}</td>
									<td className='no-print'>  {product.productVariation.product?.category.name} / {product.productVariation.product?.subCategory.name}</td>
									<td style={{ textAlign: 'right' }}>
										<Flex justify="flex-end" align="center">
											<Text size="sm" mr={4}>Ks</Text>
											<FormattedNumber value={product.perPrice} />
										</Flex>
									</td>
									<td style={{ textAlign: 'right' }}>{product.quantity}</td>
									<td style={{ textAlign: 'right' }}>
										<Flex justify="flex-end" align="center">
											<Text size="sm" mr={4}>Ks</Text>
											<FormattedNumber value={product.perPrice * product.quantity} />
										</Flex>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Divider my="md" variant="dashed" />
					<Stack align="stretch" style={{ width: '100%' }}>
						<Flex justify="space-between">
							<Text color="dimmed">Subtotal:</Text>
							<Flex align="center">
								<Text size="sm" mr={4}>Ks</Text>
								<FormattedNumber value={(data?.data.grossPrice || 0)} fw={500} />
							</Flex>
						</Flex>
						<Flex justify="space-between">
							<Text color="dimmed">Discount Price:</Text>
							<Flex align="center">
								<Text size="sm" mr={4}>Ks</Text>
								<FormattedNumber value={data?.data.discountAmount || 0} fw={500} />
							</Flex>
						</Flex>
						<Flex justify="space-between">
							<Text color="dimmed">Tax:</Text>
							<Flex align="center">
								<Text size="sm" mr={4}>Ks</Text>
								<FormattedNumber value={data?.data.tax || 0} fw={500} />
							</Flex>
						</Flex>
						<Divider my="sm" />
						<Flex justify="space-between">
							<Text fw={700} size="lg">Total:</Text>
							<Flex align="center">
								<Text size="sm" mr={4}>Ks</Text>
								<FormattedNumber value={data?.data.grossPrice || 0} fw={700} size="lg" />
							</Flex>
						</Flex>
					</Stack>
				</Card>
			</motion.div>
		</Container>
	)
}

export default InvoicePreview

