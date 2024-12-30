"use client";

import React, { useEffect, useState } from "react";
import {
	Group,
	Button,
	Paper,
	Text,
	NumberInput,
	Select,
	Box,
	Stack,
	FileInput,
	Image,
	SimpleGrid,
	ColorSwatch,
	Loader,
	TextInput,
	Badge,
	LoadingOverlay,
} from "@mantine/core";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProductVariation, useFetchColor, useFetchProductDetails, useFetchSize, useUploadImage } from "@/services/products";
import { useRouter, useSearchParams } from "next/navigation";

const schema = z.object({
	variations: z.array(
		z.object({
			code: z.string().min(1, "Code is required"),
			sizeId: z.string().min(1, "Size is required"),
			colorId: z.string().min(1, "Color is required"),
			sellingPrice: z.number().min(0, "Selling price must be non-negative"),
			purchasedPrice: z.number().min(0, "Purchased price must be non-negative"),
			images: z.array(z.string()).min(1, "At least one image is required"),
		})
	),
});

type FormValues = z.infer<typeof schema>;

const AddVariationPage = () => {
	const searchParams = useSearchParams();
	const productId = searchParams.get("productId") || "";
	const { data: colors, isLoading: colorLoading } = useFetchColor();
	const { data: sizes, isLoading: sizeLoading } = useFetchSize();
	const imageUploader = useUploadImage();

	const {
		control,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			variations: [{ sizeId: "", colorId: "", sellingPrice: 0, purchasedPrice: 0, images: [] }],
		},
	});

	const { fields, append, remove, move } = useFieldArray({
		control,
		name: "variations",
	});

	const [previews, setPreviews] = useState<{ [key: string]: string[] }>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isImageLoading, setIsImageLoading] = useState(false);
	const [imageErrors, setImageErrors] = useState<{ [key: number]: string }>({});

	const router = useRouter();
	const createProduct = useCreateProductVariation();

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = () => reject(new Error("Error reading file"));
			reader.readAsDataURL(file);
		});
	};

	const handleImageChange = async (files: File[] | null, index: number) => {
		if (!files) {
			setValue(`variations.${index}.images`, []);
			setPreviews((prev) => ({ ...prev, [index]: [] }));
			setImageErrors((prev) => ({ ...prev, [index]: "" }));
			return;
		}

		setIsImageLoading(true); // Set loading to true at the beginning of the process

		const fileArray = Array.isArray(files) ? files : [files];
		const invalidFiles = fileArray.filter((file) => !file.type.startsWith("image/"));
		if (invalidFiles.length > 0) {
			setImageErrors((prev) => ({ ...prev, [index]: "Only image files are allowed" }));
			setIsImageLoading(false);
			return;
		}

		if (fileArray.length + (getValues(`variations.${index}.images`) || []).length > 5) {
			setImageErrors((prev) => ({ ...prev, [index]: "You can only upload a maximum of 5 images" }));
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
								uploadedImageIds.push(response._data.id);
								const newPreviews = uploadedImageIds.map(
									(id) => `https://cloud.farytaxi.com/uploads/product/${id}.${response._data.fileType}`
								);

								setValue(`variations.${index}.images`, [
									...getValues(`variations.${index}.images`),
									...uploadedImageIds,
								]);

								setPreviews((prev) => ({
									...prev,
									[index]: [...(prev[index] || []), ...newPreviews],
								}));

								setImageErrors((prev) => ({ ...prev, [index]: "" }));
								resolve();
							},
							onError: reject,
						}
					);
				});
			}
		} catch (error) {
			setImageErrors((prev) => ({
				...prev,
				[index]: "Error uploading images. Please try again.",
			}));
		} finally {
			setIsImageLoading(false); // Set loading to false only after all uploads are complete
		}
	};

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		createProduct.mutate(
			{
				productId,
				variation: data.variations,
			},
			{
				onSuccess() {
					router.push(`/dashboard/product/variation?id=${productId}`);
					setIsSubmitting(false);
				},
				onError() {
					setIsSubmitting(false);
				},
			}
		);
	};

	const { data: product, isLoading, isError, refetch } = useFetchProductDetails(productId)

	useEffect(() => {
		refetch();
	}, [refetch, productId]);

	if (isLoading || !product) {
		return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
	}

	return (
		<Paper withBorder shadow="md" p="md" maw={800} mx="auto">
			<Text component="h2" fw="bold" fz="lg" mb="md">
				Add New Variations to <Badge>{product?.data.name}</Badge>
			</Text>

			<form onSubmit={handleSubmit(onSubmit)}>
				<DragDropContext onDragEnd={({ destination, source }) => move(source.index, destination?.index ?? source.index)}>
					<Droppable droppableId="variations" direction="vertical">
						{(provided) => (
							<div {...provided.droppableProps} ref={provided.innerRef}>
								{fields.map((item, index) => (
									<Draggable key={item.id} index={index} draggableId={item.id}>
										{(provided) => (
											<Paper withBorder p="sm" mb="sm" ref={provided.innerRef} {...provided.draggableProps}>
												<Group align="flex-start">
													<Box {...provided.dragHandleProps} pt={6}>
														<IconGripVertical size="1.2rem" />
													</Box>
													<Stack style={{ flex: 1 }}>
														<Group grow>
															<Controller
																name={`variations.${index}.code`}
																control={control}
																render={({ field }) => (
																	<TextInput
																		label="Code"
																		placeholder='Enter code'
																		error={errors.variations?.[index]?.code?.message}
																		{...field}
																	/>
																)}
															/>
															<Controller
																name={`variations.${index}.sizeId`}
																control={control}
																render={({ field }) => (
																	<Select
																		label="Size"
																		placeholder={sizeLoading ? "Loading..." : "Select a Size"}
																		data={sizes?.data.map((s) => ({ value: s.id, label: s.name })) || []}
																		error={errors.variations?.[index]?.sizeId?.message}
																		{...field}
																	/>
																)}
															/>
															<Controller
																name={`variations.${index}.colorId`}
																control={control}
																render={({ field }) => (
																	<Select
																		label="Color"
																		placeholder={colorLoading ? "Loading..." : "Select a Color"}
																		data={colors?.data.map((c) => ({ value: c.id, label: c.name })) || []}
																		error={errors.variations?.[index]?.colorId?.message}
																		{...field}
																	/>
																)}
															/>
														</Group>
														<Group grow>
															<Controller
																name={`variations.${index}.sellingPrice`}
																control={control}
																render={({ field }) => (
																	<NumberInput
																		label="Selling Price"
																		min={0}
																		error={errors.variations?.[index]?.sellingPrice?.message}
																		{...field}
																	/>
																)}
															/>
															<Controller
																name={`variations.${index}.purchasedPrice`}
																control={control}
																render={({ field }) => (
																	<NumberInput
																		label="Purchased Price"
																		min={0}
																		error={errors.variations?.[index]?.purchasedPrice?.message}
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
															onChange={(files) => handleImageChange(files, index)}
															error={imageErrors[index]}
														/>
														{previews[index]?.length > 0 && (
															<SimpleGrid cols={4} spacing="xs">
																{previews[index].map((preview, i) => (
																	<Box key={i} style={{ position: "relative" }}>
																		<Image src={preview} alt={`Preview ${i + 1}`} radius="md" fit="cover" height={100} />
																		<Button
																			size="xs"
																			color="red"
																			variant="filled"
																			style={{ position: "absolute", top: 5, right: 5 }}
																			onClick={() => {
																				const images = getValues(`variations.${index}.images`);
																				images.splice(i, 1);
																				setValue(`variations.${index}.images`, images);
																				setPreviews((prev) => {
																					const updatedPreviews = { ...prev };
																					updatedPreviews[index] = updatedPreviews[index]?.filter((_, idx) => idx !== i);
																					return updatedPreviews;
																				});
																			}}
																		>
																			<IconTrash size="0.8rem" />
																		</Button>
																	</Box>
																))}
															</SimpleGrid>
														)}
													</Stack>
												</Group>
											</Paper>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>

				<Group>
					<Button loading={isSubmitting || isImageLoading} onClick={() => append({ sizeId: "", colorId: "", sellingPrice: 0, purchasedPrice: 0, images: [], code: '' })}>
						Add Variation
					</Button>
					<Button type="submit" loading={isSubmitting || isImageLoading}>
						Save Variations
					</Button>
				</Group>
			</form>
		</Paper>
	);
};

export default AddVariationPage;
