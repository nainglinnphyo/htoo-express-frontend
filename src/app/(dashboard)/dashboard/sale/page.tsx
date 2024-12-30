'use client'

import { useCallback, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
	Button,
	Container,
	Grid,
	TextInput,
	Title,
	Text,
	Card,
	Group,
	Table,
	ScrollArea,
	ActionIcon,
	Tooltip,
	ThemeIcon,
	Divider,
	Select,
	Modal,
	Flex,
	Stack,
	Skeleton,
	Loader,
	LoadingOverlay,
} from '@mantine/core'
import { IconShoppingCart, IconPlus, IconUser, IconSearch } from '@tabler/icons-react'
import { useCreateInvoice, useGetProductVariationForVoucher } from '@/services/products'
import { useDebouncedValue } from '@mantine/hooks'
import { useRouter } from 'next/navigation'
import { FormattedNumber } from '@/components/Text/NumberFormatter'
import { AnimatePresence } from 'framer-motion'
import { AnimatedPageTransition } from '@/components/Product/AnimatedPageTransition'
import { AnimatedProductCard } from '@/components/Product/AnimatedProductCard'
import ScanPage from '../scan/page'

interface Product {
	id: string
	code: string
	name: string
	price: number
	category: string
	qty?: number
	amount?: number
}

const formSchema = z.object({
	customerName: z.string(),
	customerPhone: z.string(),
	address: z.string(),
	taxRate: z.number().min(0).max(100),
	note: z.string().optional()
})

type FormValues = z.infer<typeof formSchema>

export default function SaleVoucherPage() {
	const router = useRouter()
	const [productsData, setProductsData] = useState<Product[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [voucher, setVoucher] = useState<Product[]>([])
	const [productQuantities, setProductQuantities] = useState<Record<string, number>>({})
	const [confirmModalOpened, setConfirmModalOpened] = useState(false);
	const [formValue, setFormValue] = useState<any | null>(null);
	const [totalTax, setTotalTax] = useState(0);

	const playNotificationSound = () => {
		const audio = new Audio('/scan.mp3');
		audio.play()
	};

	const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);

	const { data, isLoading, refetch } = useGetProductVariationForVoucher({
		pagination: {
			page: 1,
			size: 100,
		},
		filters: {
			search: debouncedSearchQuery
		}
	})

	const updateProductsData = useCallback(() => {
		if (data) {
			const products: Product[] = data.data.map((p) => ({
				id: p.id || '',
				code: p.code,
				category: `${p.product?.brand?.name || ''} / ${p.product?.category.name || ''} / ${p.product?.subCategory.name || ''}`,
				name: `${p.product?.name || ''} / ${p.size?.name || ''} / ${p.color?.name || ''}`,
				price: p.sellingPrice || 0
			}));
			setProductsData(products)
		}
	}, [data]);

	useEffect(() => {
		updateProductsData();

	}, [updateProductsData]);

	useEffect(() => {
		refetch();
	}, [debouncedSearchQuery, refetch]);

	const { control, handleSubmit, formState: { errors }, } = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			customerName: '',
			customerPhone: '',
			address: '',
			taxRate: 0,
		},
	})

	const handleAddToVoucher = (product: Product) => {
		const existingProductIndex = voucher.findIndex(item => item.id === product.id)

		if (existingProductIndex !== -1) {
			// If product exists, update its quantity
			const newQuantity = (productQuantities[product.id] || 1) + 1
			handleQuantityChange(product.id, newQuantity)
		} else {
			// If product is new, add it to voucher with quantity 1
			setVoucher(prev => [...prev, { ...product, qty: 1 }])
			setProductQuantities(prev => ({ ...prev, [product.id]: 1 }))
		}
	}
	const handleRemoveFromVoucher = (productId: string) => {
		setVoucher((prev) => prev.filter((item) => item.id !== productId))
		setProductQuantities((prev) => {
			const newQuantities = { ...prev }
			delete newQuantities[productId]
			return newQuantities
		})
	}

	const handleQuantityChange = (productId: string, quantity: number) => {
		if (quantity < 1) {
			handleRemoveFromVoucher(productId)
		} else {
			setProductQuantities((prev) => ({ ...prev, [productId]: quantity }))
		}
	}

	const subtotal = voucher.reduce(
		(sum, item) => sum + item.price * (productQuantities[item.id] || 1),
		0
	)

	const handleChangeTax = (e: number) => {
		setTotalTax(subtotal * (e / 100))
	}

	const onSubmit = (data: FormValues) => {
		setFormValue(data)
		setConfirmModalOpened(true);
	};

	const createInvoice = useCreateInvoice()
	const handleConfirmedSubmit = () => {
		const taxAmount = subtotal * (Number(control._formValues.taxRate) / 100)
		const totalAmount = subtotal + taxAmount

		try {
			createInvoice.mutate({
				address: formValue?.address,
				name: formValue?.customerName,
				phone: formValue?.customerPhone,
				note: formValue?.note,
				grossPrice: totalAmount,
				taxAmount: taxAmount,
				variation: voucher.map((d) => {
					const preProduct = productQuantities[d.id]
					return {
						qty: preProduct,
						total: d.price * preProduct,
						variationId: d.id
					}
				})
			}, {
				onSuccess: (response) => {
					if (response._data) {
						router.push(`/dashboard/invoice/details?id=${response._data.createdInvoiceId}`)
					} else {
						router.push(`/dashboard/invoice`)
					}
				}
			})
		} catch (error) {
			console.log(error)
		}
		setConfirmModalOpened(false);
	}

	const closeConfirmModal = () => {
		setConfirmModalOpened(false);
	}

	const updateScanText = async (text: string) => {
		try {
			// Prevent processing empty codes
			if (!text?.trim()) return;

			const trimmedText = text.trim();

			// Clear previous search to avoid duplicate search results
			setSearchQuery('');

			// Fetch product data
			const result = await refetch();

			if (!result.data?.data) return;

			const scannedProduct = result.data.data.find(p => p.code === trimmedText);

			if (scannedProduct) {
				const product = {
					id: scannedProduct.id || '',
					code: scannedProduct.code,
					category: `${scannedProduct.product?.brand?.name || ''} / ${scannedProduct.product?.category.name || ''} / ${scannedProduct.product?.subCategory.name || ''}`,
					name: `${scannedProduct.product?.name || ''} / ${scannedProduct.size?.name || ''} / ${scannedProduct.color?.name || ''}`,
					price: scannedProduct.sellingPrice || 0,
				};


				setVoucher(prevVoucher => {
					const existingProductIndex = prevVoucher.findIndex(item => item.id === product.id);
					if (existingProductIndex !== -1) {
						// If product exists, update its quantity
						const updatedVoucher = [...prevVoucher];
						updatedVoucher[existingProductIndex] = {
							...updatedVoucher[existingProductIndex],
							qty: (updatedVoucher[existingProductIndex].qty || 0) + 1,
						};
						return updatedVoucher;
					} else {
						// If product is new, add it to voucher with quantity 1
						return [...prevVoucher, { ...product, qty: 1 }];
					}
				});

				setProductQuantities(prevQuantities => ({
					...prevQuantities,
					[product.id]: (prevQuantities[product.id] || 0) + 1,
				}));
				playNotificationSound()
			}
		} catch (error) {
			console.error('Error processing scanned product:', error);
		}
	};

	return (
		<AnimatedPageTransition>
			<Container size="xl" py="xl">
				<Title order={2} mb="lg">
					Sale Voucher
				</Title>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Grid>
						<Grid.Col span={{ base: 12, md: 8 }}>
							<Card shadow="sm" p="md" radius="md" withBorder mb="md">
								<Group mb="md">
									<Text fw={500} size="lg">
										Customer Information
									</Text>
									<ThemeIcon size="lg" color="blue" variant="light">
										<IconUser size={20} />
									</ThemeIcon>
								</Group>
								<Grid>
									<Grid.Col span={6}>
										<Controller
											name="customerName"
											control={control}
											render={({ field }) => (
												<TextInput
													label="Customer Name"
													placeholder="Enter customer name"
													error={errors.customerName?.message}
													{...field}
												/>
											)}
										/>
									</Grid.Col>
									<Grid.Col span={6}>
										<Controller
											name="customerPhone"
											control={control}
											render={({ field }) => (
												<TextInput
													label="Customer Phone"
													placeholder="Enter Phone"
													error={errors.customerPhone?.message}
													{...field}
												/>
											)}
										/>
									</Grid.Col>
								</Grid>
								<Grid>
									<Grid.Col span={6}>
										<Controller
											name="address"
											control={control}
											render={({ field }) => (
												<TextInput
													label="Customer Address"
													placeholder="Enter customer's address"
													error={errors.address?.message}
													{...field}
												/>
											)}
										/>
									</Grid.Col>
								</Grid>
							</Card>
							<Card shadow="sm" p="md" radius="md" withBorder mb="md">
								<Text fw={500} size="lg" mb="md">Barcode Scanner</Text>
								<Group>
									<ScanPage updateScanText={updateScanText} />
								</Group>
							</Card>
							<Group mb="md">
								<TextInput
									leftSection={<IconSearch style={{ width: 18, height: 18 }} />}
									placeholder="Search for a product"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									style={{ flexGrow: 1 }}
								/>
							</Group>
							<Card shadow="sm" p="xs" radius="md" withBorder>
								<Text fw={500} size="lg" mb="sm">
									Available Products
								</Text>
								<ScrollArea h={400}>
									<Table striped highlightOnHover>
										<thead>
											<tr>
												<th>Code</th>
												<th>Name</th>
												<th>Category</th>
												<th style={{ textAlign: 'right' }}>Price</th>
												<th style={{ textAlign: 'center' }}>Actions</th>
											</tr>
										</thead>
										<tbody>
											{isLoading ? <LoadingOverlay visible={true} /> : productsData.map((product) => (
												<tr key={product.id}>
													<td style={{ textAlign: 'center', padding: '1rem' }}>{product.code}</td>
													<td style={{ textAlign: 'center', padding: '1rem' }}>{product.name}</td>
													<td style={{ textAlign: 'center', padding: '1rem' }}>{product.category}</td>
													<td style={{ textAlign: 'right', padding: '1rem' }}>
														<Flex justify="flex-end" align="center">
															<Text size="sm" mr={4}>Ks</Text>
															<FormattedNumber value={Number(product.price.toFixed(2))} fw={600} />
														</Flex>
													</td>
													<td style={{ textAlign: 'center', padding: '1rem' }}>
														<Tooltip label="Add to Voucher">
															<ActionIcon color="blue" onClick={() => handleAddToVoucher(product)}>
																<IconPlus size={16} />
															</ActionIcon>
														</Tooltip>
													</td>
												</tr>
											))}
										</tbody>
									</Table>
								</ScrollArea>
							</Card>
						</Grid.Col>

						<Grid.Col span={{ base: 12, md: 4 }}>
							<Card shadow="sm" p="md" radius="md" withBorder>
								<Group mb="xs">
									<Text fw={500} size="lg">
										Sales Voucher
									</Text>
									<ThemeIcon size="lg" color="blue" variant="light">
										<IconShoppingCart size={20} />
									</ThemeIcon>
								</Group>
								<ScrollArea h={400} mb="md">
									{voucher.length === 0 ? (
										<Text mt="xl">
											No products added to the voucher.
										</Text>
									) : (
										<Stack>
											<AnimatePresence>
												{voucher.map((item) => (
													<AnimatedProductCard
														key={item.id}
														id={item.id}
														name={item.name}
														price={item.price}
														quantity={productQuantities[item.id] || 1}
														onQuantityChange={handleQuantityChange}
														onRemove={handleRemoveFromVoucher}
													/>
												))}
											</AnimatePresence>
										</Stack>
									)}
								</ScrollArea>
								<Divider my="sm" />
								<Stack>
									<Flex justify="space-between">
										<Text>Subtotal:</Text>
										<Flex align="center">
											<Text size="sm" mr={4}>Ks</Text>
											<FormattedNumber value={Number(subtotal.toFixed(2))} fw={600} />
										</Flex>
									</Flex>
									<Flex justify="space-between" align="center">
										<Controller
											name="taxRate"
											control={control}
											render={({ field }) => (
												<Select
													label="Tax Rate"
													placeholder="Select tax rate"
													value={field.value.toString()}
													onChange={(value: any) => {
														handleChangeTax(value)
														field.onChange(Number(value))
													}}
													error={errors.taxRate?.message}
													data={[
														{ value: '0', label: '0%' },
														{ value: '5', label: '5%' },
														{ value: '10', label: '10%' },
														{ value: '15', label: '15%' },
													]}
													style={{ width: '100px' }}
												/>
											)}
										/>
										<Flex align="center">
											<Text size="sm" mr={4}>Ks</Text>
											<FormattedNumber value={Number((subtotal * (Number(control._formValues.taxRate) / 100)).toFixed(2))} fw={600} />
										</Flex>
									</Flex>
								</Stack>
								<Divider my="sm" />
								<Flex justify="space-between" align="center">
									<Text fw={500} size="lg">Total:</Text>
									<Flex align="center">
										<Text size="sm" mr={4}>Ks</Text>
										<FormattedNumber value={Number((subtotal * (1 + Number(control._formValues.taxRate) / 100)).toFixed(2))} fw={600} size="lg" />
									</Flex>
								</Flex>
								<Button type="submit" fullWidth mt="md" disabled={voucher.length === 0}>
									Complete Sale
								</Button>
							</Card>
						</Grid.Col>
					</Grid>
				</form>
				<Modal opened={confirmModalOpened} onClose={closeConfirmModal} title="Confirm Sale">
					<Text>Are you sure you want to complete this sale?</Text>
					<Group mt="md">
						<Button onClick={closeConfirmModal} variant="outline">Cancel</Button>
						<Button onClick={handleConfirmedSubmit} color="blue">Confirm</Button>
					</Group>
				</Modal>
			</Container>
		</AnimatedPageTransition>
	)
}

