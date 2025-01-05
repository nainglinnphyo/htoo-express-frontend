

import { useCreateColor } from "@/services/products";
import { CreateColorPayload } from "@/services/products/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, ColorInput, Modal, Select, Space, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define props with TypeScript
interface ColorModelProps {
	opened: boolean;
	close: () => void;
}

const schema = z.object({
	hexCode: z.string().optional(),
	name: z.string().min(1, { message: "Name is required" }),
});

type Color = z.infer<typeof schema>;

export function ColorCreateModel({ opened, close, }: ColorModelProps) {

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue
	} = useForm<Color>({
		resolver: zodResolver(schema),
	});



	const createColor = useCreateColor()
	const onSubmit = (data: CreateColorPayload) => {
		createColor.mutate(
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

	return (
		<Modal opened={opened} onClose={close} title="Create New Product">
			{/* <Paper withBorder shadow="md" p="md" w="400px"> */}
			<Box<"form">>

				<Space h="sm" />


				<TextInput
					label="Color name"
					error={errors.name?.message}
					{...register("name")}
				/>
				<Space h="sm" />

				<ColorInput
					label="Pick color"
					swatches={['#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
					onChange={(value) => setValue("hexCode", value || "")}
					error={errors.hexCode?.message}
				/>

				<Space h="md" />
				<Button onClick={handleSubmit(onSubmit)}>Create</Button>
			</Box>
			{/* </Paper> */}
		</Modal>
	);
}
