"use client"

import { useState, useEffect, useRef } from "react"
import { TextInput, Grid, Card, Image, Text, Badge, Group, Container, Loader } from "@mantine/core"
import { useGetVariationByGroup } from "@/services/products"
import type { ProductVariation } from "@/services/products/types"
import { useDebouncedValue } from "@mantine/hooks"

export default function ProductCatalog() {
	const [searchTerm, setSearchTerm] = useState("")
	const inputRef = useRef<HTMLInputElement>(null)

	const [debouncedSearchQuery] = useDebouncedValue(searchTerm, 200)

	const { data, isLoading, error, refetch } = useGetVariationByGroup(debouncedSearchQuery)

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}, [])

	useEffect(() => {
		// console.log("API Response:", data)
		refetch()
	}, [searchTerm, refetch, data, debouncedSearchQuery]) // Added 'data' to dependencies

	const processedData = data?.data.map((item: ProductVariation) => ({
		...item,
		images: item.images || [],
		product: item.product || {},
		size: item.size || {},
		color: item.color || {},
	}))

	return (
		<Container size="xl" py="xl">
			<TextInput
				ref={inputRef}
				placeholder="Search products..."
				mb="xl"
				value={searchTerm}
				onChange={(event) => setSearchTerm(event.currentTarget.value)}
			/>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Text>No products found</Text>
			) : (
				<Grid>
					{processedData.map((product: ProductVariation) => (
						<Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
							<Card shadow="sm" padding="lg" radius="md" withBorder>
								<Card.Section>
									{
										product?.image && (
											<Image
												src={product?.image[0]?.path || "/placeholder.svg"}
												height={200}
												alt={product.product?.name || "Product image"}
												fit="cover"
											/>
										)
									}

								</Card.Section>

								<Group p="apart" mt="md" mb="xs">
									<Text w={500}> {product.product?.brand?.name} / {product.product?.subCategory?.name} / {product.product?.name} </Text>
									<Badge color="pink" variant="light">
										{product.code}
									</Badge>
								</Group>

								<Text size="sm" c="dimmed">
									Size: {product.size?.name}, Color: {product.color?.name}
								</Text>

								<Group p="apart" mt="md">
									<Text size="sm" w={500}>
										Price: {product.sellingPrice} Ks
									</Text>
									<Text size="sm" w={800}>
										Stock: {product.branchStock}
									</Text>
								</Group>
							</Card>
						</Grid.Col>
					))}
				</Grid>
			)}
		</Container>
	)
}

