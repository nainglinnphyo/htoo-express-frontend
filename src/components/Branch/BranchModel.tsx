import { useCreateBranch } from "@/services/branches";
import { CreateBranchPayload } from "@/services/branches/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal, Paper, Space, Text, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define props with TypeScript
interface BranchModelProps {
	opened: boolean;
	close: () => void;
}

const schema = z.object({
	name: z.string().min(1, { message: "Branch is required" }),
	address: z.string().min(1, { message: "Address is required" }),
	contactPerson: z.string().min(1, { message: "Contact person is required" }),
	contactPhone: z.string().min(1, { message: "Contact phone is required" }),
});

type Branch = z.infer<typeof schema>;

export function BranchModel({ opened, close, }: BranchModelProps) {



	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<Branch>({
		resolver: zodResolver(schema),
	});



	const createBranch = useCreateBranch()

	const onSubmit = (data: CreateBranchPayload) => {

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
				<TextInput
					label="Branch Name"
					error={errors.name?.message}
					{...register("name")}
				/>
				<Space h="sm" />
				<TextInput
					label="Address"
					error={errors.address?.message}
					{...register("address")}
				/>
				<TextInput
					label="Contact Phone"
					error={errors.contactPerson?.message}
					{...register("contactPhone")}
				/>
				<TextInput
					label="Contact Person"
					error={errors.contactPerson?.message}
					{...register("contactPerson")}
				/>
				<Space h="md" />
				<Button onClick={handleSubmit(onSubmit)}>Create</Button>
			</Box>
			{/* </Paper> */}
		</Modal>
	);
}
