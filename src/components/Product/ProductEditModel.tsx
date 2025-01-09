import { useCategory } from "@/services/categories";
import { useEditProduct, useFetchBrand } from "@/services/products";
import { CreateProductPayload, Product as IProduct } from "@/services/products/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal, Select, Space, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define props with TypeScript
interface ProductEditModalProps {
	opened: boolean;
	close: () => void;
	product: IProduct; // The product data to edit
	refetch: () => void;
}

const schema = z.object({
	id: z.string(),
	shortName: z.string().optional(),
	name: z.string().min(1, { message: "Name is required" }),
	brandId: z.string().min(1, { message: "Brand is required" }),
	categoryId: z.string().min(1, { message: "Category is required" }),
	subCategoryId: z.string().min(1, { message: "SubCategory is required" }),
	description: z.string().min(1, { message: "description is required" }),

});

type Product = z.infer<typeof schema>;

export function ProductEditModal({ opened, close, product }: ProductEditModalProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue
	} = useForm<Product>({
		resolver: zodResolver(schema),
		defaultValues: product
	});

	const updateProduct = useEditProduct();
	const onSubmit = (data: CreateProductPayload) => {
		console.log({ data })
		updateProduct.mutate(
			{ ...data, productId: product.id },
			{
				onSuccess() {
					close();
				},
			},
		)
	};

	const { data: categories, isLoading: categoryLoading } = useCategory({
		pagination: {
			page: 1,
			size: 100
		}
	});

	const [selectedCategory, setSelectedCategory] = useState<string | null>(product.categoryId);

	const { data: brands, isLoading } = useFetchBrand();

	useEffect(() => {
		if (product) {
			Object.entries(product).forEach(([key, value]) => {
				setValue(key as keyof Product, value);
			});
			setSelectedCategory(product.categoryId);
		}
	}, [product, setValue]);

	return (
		<Modal opened={opened} onClose={close} title="Edit Product">
			<Box component="form" onSubmit={handleSubmit(onSubmit)}>
				<Space h="sm" />

				<Select
					searchable
					label="Brand"
					placeholder={isLoading ? "Loading..." : "Select a brand"}
					data={brands?.data.map(brand => ({
						value: brand.id,
						label: brand.name,
					})) || []}
					error={errors.brandId?.message}
					value={product.brandId}
					onChange={(value) => setValue("brandId", value || "")}
				/>

				<Select
					searchable
					label="Category"
					placeholder={categoryLoading ? "Loading..." : "Select a category"}
					data={categories?.data.map(category => ({
						value: category.id,
						label: category.name,
					})) || []}
					value={selectedCategory}
					onChange={(value) => {
						setValue("categoryId", value || "")
						setSelectedCategory(value)
					}}
					error={errors.categoryId?.message}
				/>

				<Select
					searchable
					label="SubCategory"
					placeholder={categoryLoading ? "Loading..." : "Select a sub category"}
					data={categories?.data.find((d) => d.id === selectedCategory)?.subCategory.map(category => ({
						value: category.id,
						label: category.name,
					})) || []}
					error={errors.subCategoryId?.message}
					value={product.subCategoryId}
					onChange={(value) => setValue("subCategoryId", value || "")}
				/>

				<TextInput
					label="Product name"
					error={errors.name?.message}
					{...register("name")}
				/>

				<TextInput
					label="Product Short Name"
					error={errors.shortName?.message}
					{...register("shortName")}
				/>

				<TextInput
					label="Description"
					error={errors.description?.message}
					{...register("description")}
				/>

				<Space h="md" />
				<Button type="submit">Update Product</Button>
			</Box>
		</Modal>
	);
}

