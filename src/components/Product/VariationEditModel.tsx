"use client";

import React, { useEffect, useState } from "react";
import {
	Modal,
	Button,
	TextInput,
	NumberInput,
	Select,
	Box,
	Stack,
	FileInput,
	Image,
	SimpleGrid,
	Group,
	Text,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProductVariation, useFetchColor, useFetchSize, useUploadImage } from "@/services/products";
import { ProductVariation } from "@/services/products/types";

const schema = z.object({
	code: z.string().optional(),
	sizeId: z.string().min(1, "Size is required"),
	colorId: z.string().min(1, "Color is required"),
	sellingPrice: z.number().min(0, "Selling price must be non-negative"),
	purchasedPrice: z.number().min(0, "Purchased price must be non-negative"),
	images: z.array(z.string()).min(1, "At least one image is required"),
});

type FormValues = z.infer<typeof schema>;

interface VariationEditProps {
	opened: boolean;
	close: () => void;
	refetch: () => void;
	currentRow: ProductVariation;
}

export function VariationEditModel({ opened, close, currentRow, refetch }: VariationEditProps) {
	const { data: colors, isLoading: colorLoading } = useFetchColor();
	const { data: sizes, isLoading: sizeLoading } = useFetchSize();
	const imageUploader = useUploadImage();
	const updateVariation = useUpdateProductVariation();

	const {
		control,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
		reset,
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			code: currentRow.code || "",
			sizeId: currentRow.sizeId,
			colorId: currentRow.colorId,
			sellingPrice: currentRow.sellingPrice || 0,
			purchasedPrice: currentRow.purchasedPrice || 0,
			images: currentRow.images || (currentRow.image ? currentRow.image.map(img => img.path) : []),
		},
	});

	useEffect(() => {
		reset({
			code: currentRow.code || "",
			sizeId: currentRow.sizeId,
			colorId: currentRow.colorId,
			sellingPrice: currentRow.sellingPrice || 0,
			purchasedPrice: currentRow.purchasedPrice || 0,
			images: currentRow.images || (currentRow.image ? currentRow.image.map(img => img.path) : []),
		});
	}, [currentRow, reset]);

	const [previews, setPreviews] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isImageLoading, setIsImageLoading] = useState(false);
	const [imageError, setImageError] = useState<string>("");

	useEffect(() => {
		if (currentRow.images && currentRow.images.length > 0) {
			setPreviews(currentRow.images.map(img => `https://cloud.farytaxi.com/uploads/product/${img}.jpg`));
		} else if (currentRow.image && currentRow.image.length > 0) {
			setPreviews(currentRow.image.map(img => img.path));
		} else {
			setPreviews([]);
		}
	}, [currentRow]);

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = () => reject(new Error("Error reading file"));
			reader.readAsDataURL(file);
		});
	};

	const handleImageChange = async (files: File[] | null) => {
		if (!files) {
			setValue("images", []);
			setPreviews([]);
			setImageError("");
			return;
		}

		setIsImageLoading(true);

		const fileArray = Array.isArray(files) ? files : [files];
		const invalidFiles = fileArray.filter((file) => !file.type.startsWith("image/"));
		if (invalidFiles.length > 0) {
			setImageError("Only image files are allowed");
			setIsImageLoading(false);
			return;
		}

		if (fileArray.length + getValues("images").length > 5) {
			setImageError("You can only upload a maximum of 5 images");
			setIsImageLoading(false);
			return;
		}

		const uploadedImageIds: string[] = [];

		try {
			for (const file of fileArray) {
				const base64String = await convertToBase64(file);

				await new Promise<void>((resolve, reject) => {
					imageUploader.mutate(
						{ image: base64String },
						{
							onSuccess: (response) => {

								uploadedImageIds.push(`https://cloud.farytaxi.com/uploads/product/${response._data.id}.${response._data.fileType}`);
								// const newPreviews = uploadedImageIds.map(
								// 	(id) => `https://cloud.farytaxi.com/uploads/product/${id}.${response._data.fileType}`
								// );
								setValue("images", [...getValues("images"), ...uploadedImageIds]);
								setPreviews((prev) => [...prev, ...uploadedImageIds]);
								setImageError("");
								resolve();
							},
							onError: reject,
						}
					);
				});
			}
		} catch (error) {
			setImageError("Error uploading images. Please try again.");
		} finally {
			setIsImageLoading(false);
		}
	};

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		const images = data.images.map((d) => {
			const match = d.match(/\/([^/]+)\.(png|jpeg|jpg)$/);
			const identifier = match ? match[1] : '';
			return identifier
		})
		updateVariation.mutate(
			{
				id: currentRow.id!,
				...data,
				images: images
			},
			{
				onSuccess() {
					close();
					refetch();
					setIsSubmitting(false);
				},
				onError() {
					setIsSubmitting(false);
				},
			}
		);
	};
	console.log({ previews })
	return (
		<Modal opened={opened} onClose={close} title="Edit Product Variation" size="lg">
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack>
					<Group grow>
						<Controller
							name="code"
							control={control}
							render={({ field }) => (
								<TextInput
									label="Code"
									placeholder="Enter code"
									error={errors.code?.message}
									{...field}
								/>
							)}
						/>
						<Controller
							name="sizeId"
							control={control}
							render={({ field }) => (
								<Select
									searchable
									label="Size"
									placeholder={sizeLoading ? "Loading..." : "Select a Size"}
									data={sizes?.data.map((s) => ({ value: s.id, label: s.name })) || []}
									error={errors.sizeId?.message}
									{...field}
								/>
							)}
						/>
					</Group>
					<Group grow>
						<Controller
							name="colorId"
							control={control}
							render={({ field }) => (
								<Select
									searchable
									label="Color"
									placeholder={colorLoading ? "Loading..." : "Select a Color"}
									data={colors?.data.map((c) => ({
										value: c.id,
										label: c.name,
										hexCode: c.hexCode,
									})) || []}
									error={errors.colorId?.message}
									onChange={(value) => {
										field.onChange(value);
										// Trigger a re-render to update the color preview
										setValue('colorId', value || '', { shouldValidate: true });
									}}
									value={field.value}
								/>
							)}
						/>
						{getValues("colorId") && (
							<Box>
								<Text size="sm">Selected Color:</Text>
								<div
									style={{
										width: "20px",
										height: "20px",
										backgroundColor: colors?.data.find((c) => c.id === getValues("colorId"))?.hexCode || "#fff",
										border: "1px solid #ccc",
										display: "inline-block",
									}}
								></div>
								<Text size="xs" mt={4}>
									{colors?.data.find((c) => c.id === getValues("colorId"))?.name || ""}
								</Text>
							</Box>
						)}
					</Group>
					<Group grow>
						<Controller
							name="sellingPrice"
							control={control}
							render={({ field }) => (
								<NumberInput
									label="Selling Price"
									min={0}
									error={errors.sellingPrice?.message}
									{...field}
								/>
							)}
						/>
						<Controller
							name="purchasedPrice"
							control={control}
							render={({ field }) => (
								<NumberInput
									label="Purchased Price"
									min={0}
									error={errors.purchasedPrice?.message}
									{...field}
								/>
							)}
						/>
					</Group>
					<FileInput
						label="Upload Images"
						placeholder="Select images"
						multiple
						accept="image/*"
						onChange={handleImageChange}
						error={imageError}
					/>
					{previews.length > 0 && (
						<SimpleGrid cols={4} spacing="xs">
							{previews.map((preview, i) => (
								<Box key={i} style={{ position: "relative" }}>
									<Image src={preview} alt={`Preview ${i + 1}`} radius="md" fit="cover" height={100} />
									<Button
										size="xs"
										color="red"
										variant="filled"
										style={{ position: "absolute", top: 5, right: 5 }}
										onClick={() => {
											const images = getValues("images");
											images.splice(i, 1);
											setValue("images", images);
											setPreviews((prev) => prev.filter((_, idx) => idx !== i));
										}}
									>
										<IconTrash size="0.8rem" />
									</Button>
								</Box>
							))}
						</SimpleGrid>
					)}
				</Stack>
				<Group mt="md">
					<Button type="submit" loading={isSubmitting || isImageLoading}>
						Save Changes
					</Button>
					<Button variant="outline" onClick={close}>
						Cancel
					</Button>
				</Group>
			</form>
		</Modal>
	);
}

