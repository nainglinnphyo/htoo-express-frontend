

import { useCreateBrand } from "@/services/products";
import { CreateBrandPayload } from "@/services/products/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal, Space, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define props with TypeScript
interface BrandModelProps {
	opened: boolean;
	close: () => void;
}

const schema = z.object({
	shortName: z.string().optional(),
	name: z.string().min(1, { message: "Name is required" }),
});

type Brand = z.infer<typeof schema>;

export function BrandCreateModel({ opened, close, }: BrandModelProps) {

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue
	} = useForm<Brand>({
		resolver: zodResolver(schema),
	});



	const createBrand = useCreateBrand()
	const onSubmit = (data: CreateBrandPayload) => {
		createBrand.mutate(
			{
				...data,
			},
			{
				onSuccess() {
					reset(); // Clear form state
					close();
				},
			},
		)

		reset()
	};

	return (
		<Modal opened={opened} onClose={close} title="Create New Product">
			{/* <Paper withBorder shadow="md" p="md" w="400px"> */}
			<Box<"form">>

				<Space h="sm" />

				<TextInput
					label="Brand name"
					error={errors.name?.message}
					{...register("name")}
				/>
				<TextInput
					label="Brand Short Name"
					error={errors.shortName?.message}
					{...register("shortName")}
				/>
				<Space h="md" />
				<Button onClick={handleSubmit(onSubmit)}>Create</Button>
			</Box>
			{/* </Paper> */}
		</Modal>
	);
}
