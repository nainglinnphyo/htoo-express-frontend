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
});

type StockAdjustForm = z.infer<typeof schema>;

export function BarcodeModel({ opened, close, currentRow }: ProductModelProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<StockAdjustForm>({
		resolver: zodResolver(schema),
	});


	const onSubmit = (data: StockAdjustForm) => {
		if (!currentRow) {
			return
		}
		console.log(currentRow)
		window.location.replace(`https://htooexpress.vercel.app/dashboard/print?code=${currentRow.code}&price=${currentRow.sellingPrice}&count=${data.quantity}`)
	};

	return (
		<Modal opened={opened} onClose={close} title="Adjust Stock">
			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
				style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
			>

				{/* Quantity Input */}
				<NumberInput
					label="Quantity"
					min={0}
					error={errors.quantity?.message}
					onChange={(value) => setValue("quantity", Number(value) || 0)}
				/>
				{/* Submit Button */}
				<Button type="submit" fullWidth>
					Print
				</Button>
			</Box>
		</Modal>
	);
}
