"use client"

import { useEffect, useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
	Image,
	Button,
	Container,
	Grid,
	TextInput,
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
	LoadingOverlay,
	NumberInput,
} from "@mantine/core"
import { IconShoppingCart, IconPlus, IconUser, IconSearch } from "@tabler/icons-react"
import {
	useCreateInvoice,
	useGetProductVariationForVoucher,
	useGetProductVariationForVoucherDetail,
} from "@/services/products"
import { useDebouncedValue } from "@mantine/hooks"
import { useRouter } from "next/navigation"
import { FormattedNumber } from "@/components/Text/NumberFormatter"
import { AnimatePresence } from "framer-motion"
import { AnimatedPageTransition } from "@/components/Product/AnimatedPageTransition"
import { AnimatedProductCard } from "@/components/Product/AnimatedProductCard"
import { useCallback } from "react"

interface Product {
	id: string
	code: string
	name: string
	price: number
	category: string
	qty?: number
	amount?: number
	image: string[]
}

const formSchema = z.object({
	customerName: z.string(),
	customerPhone: z.string(),
	address: z.string(),
	taxRate: z.number().min(0).max(100),
	note: z.string().optional(),
	discountType: z.string(),
	discountValue: z.number().default(0),
})

type FormValues = z.infer<typeof formSchema>

export default function SaleVoucherPage() {
	const router = useRouter()
	const [productsData, setProductsData] = useState<Product[]>([])
	const [searchQuery, setSearchQuery] = useState("")
	const [voucher, setVoucher] = useState<Product[]>([])
	const [productQuantities, setProductQuantities] = useState<Record<string, number>>({})
	const [confirmModalOpened, setConfirmModalOpened] = useState(false)
	const [formValue, setFormValue] = useState<FormValues | null>(null)
	const [totalTax, setTotalTax] = useState(0)
	const [discountType, setDiscountType] = useState("MMK")
	const [discountValue, setDiscountValue] = useState(0)
	const [discountAmount, setDiscountAmount] = useState(0)
	const [scanText, setScanText] = useState("")

	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}, [])

	const playNotificationSound = () => {
		const audio = new Audio("/scan.mp3")
		audio.play()
	}

	const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 200)

	const { data, isLoading, refetch } = useGetProductVariationForVoucher({
		pagination: {
			page: 1,
			size: 20,
		},
		filters: {
			search: debouncedSearchQuery,
		},
	})

	const {
		data: details,
		isLoading: detailsLoading,
		refetch: detailRefetch,
	} = useGetProductVariationForVoucherDetail(scanText)

	const updateProductsData = useCallback(() => {
		if (data) {
			const products: Product[] = data.data.map((p) => ({
				id: p.id || "",
				code: p.code || "",
				category: `${p.product?.brand?.name || ""} / ${p.product?.category.name || ""} / ${p.product?.subCategory.name || ""
					}`,
				name: `${p.product?.name || ""} / ${p.size?.name || ""} / ${p.color?.name || ""}`,
				price: p.sellingPrice || 0,
				image: p.image?.map((d) => d.path) || [],
			}))
			setProductsData(products)
		}
	}, [data])

	const updateScanProduct = useCallback(() => {
		if (details) {
			if (scanText && details && details.data) {
				const scannedProduct = {
					id: details.data.id || "",
					code: details.data.code || "",
					category: `${details.data.product?.brand?.name || ""} / ${details.data.product?.category.name || ""} / ${details.data.product?.subCategory.name || ""}`,
					name: `${details.data.product?.name || ""} / ${details.data.size?.name || ""} / ${details.data.color?.name || ""}`,
					price: details.data.sellingPrice || 0,
					image: details.data.image?.map((d: any) => d.path) || [],
				}
				handleAddToVoucher(scannedProduct)
				playNotificationSound()
				setScanText("") // Clear the scan text after processing
			}
		}
	}, [details])

	useEffect(() => {
		updateProductsData()
	}, [updateProductsData])

	useEffect(() => {
		updateScanProduct()
	}, [updateScanProduct])

	useEffect(() => {
		refetch()
	}, [debouncedSearchQuery, refetch])

	useEffect(() => {
		detailRefetch()
	}, [scanText])

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			customerName: "",
			customerPhone: "",
			address: "",
			taxRate: 0,
			discountType: "MMK",
			discountValue: 0,
		},
	})

	const handleAddToVoucher = (product: Product) => {
		const existingProductIndex = voucher.findIndex((item) => item.id === product.id)

		if (existingProductIndex !== -1) {
			const newQuantity = (productQuantities[product.id] || 1) + 1
			handleQuantityChange(product.id, newQuantity)
		} else {
			setVoucher((prev) => [...prev, { ...product, qty: 1 }])
			setProductQuantities((prev) => ({ ...prev, [product.id]: 1 }))
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

	const subtotal = voucher.reduce((sum, item) => sum + item.price * (productQuantities[item.id] || 1), 0)

	const handleChangeTax = (e: number) => {
		setTotalTax(subtotal * (e / 100))
	}

	const handleDiscountAmountChange = (value: number | undefined) => {
		if (!value) value = 0

		// Validate and cap the discount value based on type
		if (discountType === "PERCENTAGE") {
			value = Math.min(value, 100) // Cap percentage at 100%
			const calculatedDiscount = (value / 100) * subtotal
			setDiscountAmount(calculatedDiscount)
		} else {
			value = Math.min(value, subtotal) // Cap MMK amount at subtotal
			setDiscountAmount(value)
		}

		setDiscountValue(value)
		setValue("discountValue", value)
	}

	const handleDiscountTypeChange = (type: string | null) => {
		if (!type) return

		setDiscountType(type)
		// Reset discount value when changing type
		setDiscountValue(0)
		setDiscountAmount(0)
		setValue("discountValue", 0)
		setValue("discountType", type)
	}

	const onSubmit = (data: FormValues) => {
		setFormValue(data)
		setConfirmModalOpened(true)
	}

	const createInvoice = useCreateInvoice()

	const handleConfirmedSubmit = () => {
		if (!formValue) return

		const taxAmount = subtotal * (Number(formValue.taxRate) / 100)
		const finalTotal = subtotal - discountAmount + taxAmount
		try {
			createInvoice.mutate(
				{
					address: formValue.address,
					name: formValue.customerName,
					phone: formValue.customerPhone,
					note: formValue.note,
					grossPrice: subtotal,
					totalPrice: finalTotal,
					taxAmount: taxAmount,
					discountType: formValue.discountType,
					discountValue: formValue.discountValue,
					discountAmount: discountAmount,
					variation: voucher.map((d) => ({
						qty: productQuantities[d.id],
						total: d.price * productQuantities[d.id],
						variationId: d.id,
					})),
				},
				{
					onSuccess: (response) => {
						if (response._data) {
							router.push(`/dashboard/invoice/details?id=${response._data.createdInvoiceId}`)
						} else {
							router.push("/dashboard/invoice")
						}
					},
				},
			)
		} catch (error) {
			console.error(error)
		}
		setConfirmModalOpened(false)
	}

	const taxRate = watch("taxRate")
	const taxAmount = subtotal * (Number(taxRate) / 100)
	const total = subtotal - discountAmount + taxAmount

	const handleScan = (text: string) => {
		setScanText(text)
		setSearchQuery(text)
	}

	console.log(scanText)

	return (
		<AnimatedPageTransition>
			<Container size="xl">
				<Card shadow="sm" radius="md" withBorder mb="md">
					<Text fw={500} size="lg">
						Barcode Scanner
					</Text>
					<Group>
						<TextInput
							leftSection={<IconSearch style={{ width: 18, height: 18 }} />}
							placeholder="Scan Here"
							value={scanText}
							ref={inputRef}
							onChange={(e) => handleScan(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleScan(scanText)
									setScanText("")
								}
							}}
							style={{ flexGrow: 1 }}
						/>
					</Group>
				</Card>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Grid>
						<Grid.Col span={{ base: 12, md: 8 }}>
							<Group mb="md">
								<TextInput
									leftSection={<IconSearch style={{ width: 18, height: 18 }} />}
									placeholder="Search for a product"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									style={{ flexGrow: 1 }}
								/>
							</Group>
							<Card shadow="sm" p="xs" radius="md" withBorder mb="md">
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
												<th style={{ textAlign: "right" }}>Price</th>
												<th style={{ textAlign: "center" }}>Actions</th>
											</tr>
										</thead>
										<tbody>
											{isLoading ? (
												<tr>
													<td colSpan={5}>
														<LoadingOverlay visible={true} />
													</td>
												</tr>
											) : (
												productsData.map((product) => (
													<tr key={product.id}>
														<td style={{ textAlign: "center", padding: "1rem" }}>{product.code}</td>
														<td style={{ textAlign: "center", padding: "1rem" }}>{product.name}</td>
														<td style={{ textAlign: "center", padding: "1rem" }}>{product.category}</td>
														<td style={{ textAlign: "right", padding: "1rem" }}>
															<Flex justify="flex-end" align="center">
																<Text size="sm" mr={4}>
																	Ks
																</Text>
																<FormattedNumber value={Number(product.price.toFixed(2))} fw={600} />
															</Flex>
														</td>
														<td>
															{product.image &&
																product.image.length > 0 &&
																product.image.map((d: any) => (
																	<Image
																		style={{ cursor: "pointer" }}
																		src={d || "/placeholder.svg"}
																		alt=""
																		radius="md"
																		fit="contain"
																		height={50}
																		width={50}
																		onClick={() => {
																			const modal = document.createElement("div")
																			modal.style.position = "fixed"
																			modal.style.top = "0"
																			modal.style.left = "0"
																			modal.style.width = "100%"
																			modal.style.height = "100%"
																			modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
																			modal.style.display = "flex"
																			modal.style.justifyContent = "center"
																			modal.style.alignItems = "center"
																			modal.style.zIndex = "1000"

																			const modalImage: any = document.createElement("img")
																			modalImage.src = d
																			modalImage.alt = d
																			modalImage.style.maxWidth = "90%"
																			modalImage.style.maxHeight = "90%"

																			modal.appendChild(modalImage)
																			document.body.appendChild(modal)

																			modal.addEventListener("click", () => {
																				document.body.removeChild(modal)
																			})
																		}}
																	/>
																))}
														</td>
														<td style={{ textAlign: "center", padding: "1rem" }}>
															<Tooltip label="Add to Voucher">
																<ActionIcon color="blue" onClick={() => handleAddToVoucher(product)}>
																	<IconPlus size={16} />
																</ActionIcon>
															</Tooltip>
														</td>
													</tr>
												))
											)}
										</tbody>
									</Table>
								</ScrollArea>
							</Card>
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
										<Text mt="xl">No products added to the voucher.</Text>
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
											<Text size="sm" mr={4}>
												Ks
											</Text>
											<FormattedNumber value={Number(subtotal.toFixed(2))} fw={600} />
										</Flex>
									</Flex>

									{/* Discount Section */}
									<Flex direction="column" gap="xs">
										<Flex justify="space-between" align="center">
											<Controller
												name="discountType"
												control={control}
												render={({ field }) => (
													<Select
														label="Discount Type"
														placeholder="Select type"
														value={discountType}
														onChange={handleDiscountTypeChange}
														data={[
															{ value: "MMK", label: "MMK" },
															{ value: "PERCENTAGE", label: "Percentage" },
														]}
														style={{ width: "120px" }}
													/>
												)}
											/>
											<Controller
												name="discountValue"
												control={control}
												render={({ field }) => (
													<NumberInput
														label="Discount Value"
														placeholder={`Enter ${discountType === "PERCENTAGE" ? "%" : "MMK"}`}
														min={0}
														max={discountType === "PERCENTAGE" ? 100 : subtotal}
														value={discountValue}
														onChange={(value) => handleDiscountAmountChange(Number(value))}
														error={errors.discountValue?.message}
														style={{ width: "150px" }}
													/>
												)}
											/>
										</Flex>
										{discountAmount > 0 && (
											<Flex justify="space-between">
												<Text size="sm" color="dimmed">
													Discount Amount:
												</Text>
												<Flex align="center">
													<Text size="sm" mr={4}>
														Ks
													</Text>
													<FormattedNumber value={Number(discountAmount.toFixed(2))} />
												</Flex>
											</Flex>
										)}
									</Flex>

									{/* Tax Section */}
									<Flex justify="space-between" align="center">
										<Controller
											name="taxRate"
											control={control}
											render={({ field }) => (
												<Select
													label="Tax Rate"
													placeholder="Select tax rate"
													value={field.value.toString()}
													onChange={(value) => {
														handleChangeTax(Number(value || 0))
														field.onChange(Number(value || 0))
													}}
													error={errors.taxRate?.message}
													data={[
														{ value: "0", label: "0%" },
														{ value: "5", label: "5%" },
														{ value: "10", label: "10%" },
														{ value: "15", label: "15%" },
													]}
													style={{ width: "100px" }}
												/>
											)}
										/>
										<Flex align="center">
											<Text size="sm" mr={4}>
												Ks
											</Text>
											<FormattedNumber value={Number(taxAmount.toFixed(2))} fw={600} />
										</Flex>
									</Flex>
								</Stack>
								<Divider my="sm" />
								<Flex justify="space-between" align="center">
									<Text fw={500} size="lg">
										Total:
									</Text>
									<Flex align="center">
										<Text size="sm" mr={4}>
											Ks
										</Text>
										<FormattedNumber value={Number(total.toFixed(2))} fw={600} size="lg" />
									</Flex>
								</Flex>
								<Button type="submit" fullWidth mt="md" disabled={voucher.length === 0}>
									Complete Sale
								</Button>
							</Card>
						</Grid.Col>
					</Grid>
				</form>
				<Modal opened={confirmModalOpened} onClose={() => setConfirmModalOpened(false)} title="Confirm Sale">
					<Text>Are you sure you want to complete this sale?</Text>
					<Group mt="md">
						<Button onClick={() => setConfirmModalOpened(false)} variant="outline">
							Cancel
						</Button>
						<Button onClick={handleConfirmedSubmit} color="blue">
							Confirm
						</Button>
					</Group>
				</Modal>
			</Container>
		</AnimatedPageTransition>
	)
}

