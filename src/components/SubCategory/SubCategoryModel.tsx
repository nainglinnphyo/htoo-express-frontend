
import { useCategory, useCreateCategory, useCreateSubCategory } from "@/services/categories";
import { CreateSubCategoryPayload } from "@/services/categories/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal, Select, Space, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define props with TypeScript
interface SubCategoryModelProps {
	opened: boolean;
	close: () => void;
}

const schema = z.object({
	categoryId: z.string().min(1, { message: "Category is required" }),
	name: z.string().min(1, { message: "name is required" }),
	description: z.string().min(1, { message: "description is required" }),
});

type SubCategory = z.infer<typeof schema>;

export function SubCategoryCreateModel({ opened, close, }: SubCategoryModelProps) {

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue
	} = useForm<SubCategory>({
		resolver: zodResolver(schema),
	});



	const createSubCategory = useCreateSubCategory()

	const onSubmit = (data: CreateSubCategoryPayload) => {

		createSubCategory.mutate(
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

	const { data: categories, isLoading } = useCategory({
		pagination: {
			page: 1,
			size: 200
		}
	});


	return (
		<Modal opened={opened} onClose={close} title="Create New SubCategory">
			{/* <Paper withBorder shadow="md" p="md" w="400px"> */}
			<Box<"form">>

				<Space h="sm" />

				<Select
					searchable
					label="Category"
					placeholder={isLoading ? "Loading..." : "Select a category"}
					data={categories?.data.map(category => ({
						value: category.id,
						label: category.name,
					})) || []}
					error={errors.categoryId?.message}
					onChange={(value) => setValue("categoryId", value || "")}
				/>
				<TextInput
					label="Sub Category name"
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
