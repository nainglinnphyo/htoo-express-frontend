


import { useCreateSize } from "@/services/products";
import { CreateSizePayload } from "@/services/products/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal, Space, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define props with TypeScript
interface SizeModelProps {
	opened: boolean;
	close: () => void;
}

const schema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
});

type Size = z.infer<typeof schema>;

export function SizeCreateModel({ opened, close, }: SizeModelProps) {

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue
	} = useForm<Size>({
		resolver: zodResolver(schema),
	});



	const createSize = useCreateSize()
	const onSubmit = (data: CreateSizePayload) => {
		createSize.mutate(
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
				<Space h="md" />
				<Button onClick={handleSubmit(onSubmit)}>Create</Button>
			</Box>
			{/* </Paper> */}
		</Modal>
	);
}
