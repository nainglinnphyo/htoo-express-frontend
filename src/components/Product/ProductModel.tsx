
import { useCategory } from "@/services/categories";
import { useCreateProduct, useFetchBrand, useFetchProduct, useUploadImage } from "@/services/products";
import { CreateProductPayload } from "@/services/products/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal, Select, Space, TextInput } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define props with TypeScript
interface ProductModelProps {
	opened: boolean;
	close: () => void;
}

const schema = z.object({
	code: z.string().min(1, { message: "Code is required" }),
	name: z.string().min(1, { message: "Name is required" }),
	brandId: z.string().min(1, { message: "Brand is required" }),
	categoryId: z.string().min(1, { message: "Category is required" }),
	subCategoryId: z.string().min(1, { message: "SubCategory is required" }),
	description: z.string().min(1, { message: "description is required" }),
});

type Product = z.infer<typeof schema>;

export function ProductCreateModel({ opened, close, }: ProductModelProps) {

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue
	} = useForm<Product>({
		resolver: zodResolver(schema),
	});



	const createProduct = useCreateProduct()
	const onSubmit = (data: CreateProductPayload) => {
		createProduct.mutate(
			{
				...data,
			},
			{
				onSuccess() {
					reset(); // Clear form state
					close();
					// console.log('success')
				},
			},
		)
	};

	const { data: categories, isLoading: categoryLoading } = useCategory({
		pagination: {
			page: 1,
			size: 100
		}
	})

	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)


	const { data: brands, isLoading } = useFetchBrand();

	return (
		<Modal opened={opened} onClose={close} title="Create New Product">
			{/* <Paper withBorder shadow="md" p="md" w="400px"> */}
			<Box<"form">>

				<Space h="sm" />

				<Select
					label="Brand"
					placeholder={isLoading ? "Loading..." : "Select a category"}
					data={brands?.data.map(brand => ({
						value: brand.id,
						label: brand.name,
					})) || []}
					error={errors.brandId?.message}
					onChange={(value) => setValue("brandId", value || "")}
				/>

				<Select
					label="Category"
					placeholder={categoryLoading ? "Loading..." : "Select a category"}
					data={categories?.data.map(category => ({
						value: category.id,
						label: category.name,
					})) || []}
					onChange={(value) => {
						setValue("categoryId", value || "")
						setSelectedCategory(value)
					}}
					error={errors.categoryId?.message}
				/>
				<Select
					label="SubCategory"
					placeholder={categoryLoading ? "Loading..." : "Select a sub category"}
					data={categories?.data.find((d) => d.id === selectedCategory)?.subCategory.map(category => ({
						value: category.id,
						label: category.name,
					})) || []}
					error={errors.subCategoryId?.message}
					onChange={(value) => setValue("subCategoryId", value || "")}
				/>

				<TextInput
					label="Code"
					error={errors.code?.message}
					{...register("code")}
				/>

				<TextInput
					label="Product name"
					error={errors.name?.message}
					{...register("name")}
				/>
				<TextInput
					label="Description"
					error={errors.description?.message}
					{...register("description")}
				/>

				<Space h="md" />
				<Button onClick={handleSubmit(onSubmit)}>Create</Button>
			</Box>
			{/* </Paper> */}
		</Modal>
	);
}
