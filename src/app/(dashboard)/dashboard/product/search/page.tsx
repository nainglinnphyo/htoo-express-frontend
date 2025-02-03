"use client"

import { useState, useEffect } from "react"
import { TextInput, Grid, Card, Image, Text, Badge, Group, useMantineTheme } from "@mantine/core"
import { ProductVariation } from "@/services/products/types"


// Mock data for demonstration
const mockData: ProductVariation[] = [
	{
		id: "1",
		code: "PV001",
		colorId: "C1",
		sizeId: "S1",
		size: { id: "S1", name: "Small" },
		color: { id: "C1", name: "Red", hexCode: 'xsdfd' },
		images: ["https://www.7-eleven.com/_next/image?url=https%3A%2F%2Fimages.contentstack.io%2Fv3%2Fassets%2Fbltbb619fd5c667ba2d%2Fbltf3056885a5a54731%2F609d909b388040592cded965%2FBudweiser_can_1800x1800_transparent.png&w=3840&q=75"],
		product: {
			id: "P1", name: "T-Shirt",
			code: "",
			description: "",
			category: {
				name: 'category one',
				id: "",
				description: "",
				subCategoryCount: 0,
				subCategory: []
			},
			subCategory: {
				id: "",
				category: {
					id: "",
					name: "",
					description: "",
					subCategoryCount: 0,
					subCategory: []
				},
				name: "",
				description: ""
			},
			categoryId: "",
			subCategoryId: "",
			brandId: ""
		},
		purchasedPrice: 10,
		sellingPrice: 20,
		branchStock: 100,
	},
	// Add more mock data as needed
]

export default function page() {
	const [searchTerm, setSearchTerm] = useState("")
	const [filteredProducts, setFilteredProducts] = useState<ProductVariation[]>(mockData)
	const theme = useMantineTheme()

	useEffect(() => {
		const filtered = mockData.filter(
			(product) =>
				product.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.product?.name.toLowerCase().includes(searchTerm.toLowerCase()),
		)
		setFilteredProducts(filtered)
	}, [searchTerm])

	return (
		<div>
			<TextInput
				placeholder="Search products..."
				mb="md"
				value={searchTerm}
				onChange={(event) => setSearchTerm(event.currentTarget.value)}
			/>
			<Grid>
				{filteredProducts.map((product) => (
					<Grid.Col key={product.id} span={4}>
						<Card shadow="sm" padding="lg">
							<Card.Section>
								<Image
									src={product.images[0] || "https://via.placeholder.com/150"}
									height={200}
									width={200}
									alt={product.product?.name}

								/>
							</Card.Section>

							<Group mt="md" mb="xs">
								<Text w={500}>{product.product?.name}</Text>
								<Badge color="pink" variant="light">
									{product.code}
								</Badge>
							</Group>

							<Text size="sm" c="dimmed">
								Size: {product.size?.name}, Color: {product.color?.name}
							</Text>

							<Text mt="xs" c="dimmed" size="sm">
								Price: ${product.sellingPrice}
							</Text>

							<Text mt="xs" c="dimmed" size="sm">
								Stock: {product.branchStock}
							</Text>
						</Card>
					</Grid.Col>
				))}
			</Grid>
		</div>
	)
}

