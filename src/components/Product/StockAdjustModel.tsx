import { useCategory } from "@/services/categories";
import { useHandleStockAdjust } from "@/services/products";
import { handleStockAdjustPayload, ProductVariation } from "@/services/products/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal, NumberInput, SegmentedControl, Space } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define props with TypeScript
interface ProductModelProps {
	opened: boolean;
	currentRow?: ProductVariation;
	close: () => void;
}

// Validation schema using zod
const schema = z.object({
	quantity: z.number().min(1, { message: "Quantity is required and must be greater than 0" }).refine((val) => val > 0, { message: "Quantity cannot be 0" }),
	sign: z.enum(["PLUS", "MINUS"], { required_error: "Sign is required" }).default('PLUS'),
});

type StockAdjustForm = z.infer<typeof schema>;

export function StockAdjust({ opened, close, currentRow }: ProductModelProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<StockAdjustForm>({
		resolver: zodResolver(schema),
	});

	const handleStockAdjust = useHandleStockAdjust();

	const onSubmit = (data: StockAdjustForm) => {
		handleStockAdjust.mutate(
			{
				productVariationId: currentRow.id || "",
				...data,
			},
			{
				onSuccess: () => {
					reset(); // Clear form state
					close(); // Close the modal
				},
			}
		);
	};

	return (
		<Modal opened={opened} onClose={close} title="Adjust Stock">
			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
				style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
			>
				{/* Stock Adjustment Type */}
				<SegmentedControl
					onChange={(value) => setValue("sign", value as "PLUS" | "MINUS")}
					data={[
						{ label: "Add Stock", value: "PLUS" },
						{ label: "Reduce Stock", value: "MINUS" },
					]}
				/>

				{/* Quantity Input */}
				<NumberInput
					label="Quantity"
					min={0}
					error={errors.quantity?.message}
					onChange={(value) => setValue("quantity", Number(value) || 0)}
				/>
				{/* Submit Button */}
				<Button type="submit" fullWidth>
					Submit
				</Button>
			</Box>
		</Modal>
	);
}
