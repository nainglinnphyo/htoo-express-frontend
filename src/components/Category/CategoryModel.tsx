
import { useCreateCategory } from "@/services/categories";
import { CreateCategoryPayload } from "@/services/categories/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal, Space, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define props with TypeScript
interface CategoryModelProps {
	opened: boolean;
	close: () => void;
}

const schema = z.object({
	name: z.string().min(1, { message: "name is required" }),
	description: z.string().min(1, { message: "description is required" }),
});

type Category = z.infer<typeof schema>;

export function CategoryCreateModel({ opened, close, }: CategoryModelProps) {

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<Category>({
		resolver: zodResolver(schema),
	});



	const createBranch = useCreateCategory()

	const onSubmit = (data: CreateCategoryPayload) => {

		createBranch.mutate(
			{
				...data,
			},
			{
				onError(e) {
					console.log(e)
				},
				onSuccess() {
					reset(); // Clear form state
					close();
					// console.log('success')
				},
			},
		)
	};


	return (
		<Modal opened={opened} onClose={close} title="Create New Branch">
			{/* <Paper withBorder shadow="md" p="md" w="400px"> */}
			<Box<"form">>

				<Space h="sm" />
				<TextInput
					label="Category name"
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
