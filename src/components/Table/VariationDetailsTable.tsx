"use client";

import { Paper, Title, Space, Pagination, Select, TextInput, Group, ActionIcon, Menu, Badge, Skeleton, ColorSwatch, Box, LoadingOverlay, Image, Text } from "@mantine/core";
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useFetchProductVariation } from "@/services/products";
import { Product, ProductVariation } from "@/services/products/types";
import { useRouter } from "next/navigation";
import { StockAdjust } from "../Product/StockAdjustModel";
import ButtonGroup from "../Button/ButtonGroup";

export function VariationDetailsTable({ product, isProductLoading, sizeId }: { product?: Product, isProductLoading: boolean, sizeId: string }) {
	const router = useRouter()
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 5,
	});

	const [opened, { open, close }] = useDisclosure(false);


	const [searchQuery, setSearchQuery] = useState('');
	// Custom hook to fetch data using pagination, sorting, and filtering
	const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);

	const { data, isError, isFetching, isLoading, refetch } = useFetchProductVariation({
		pagination: {
			page: pagination.pageIndex + 1, // Assuming 1-based index for pagination
			size: pagination.pageSize,
		},
		filters: {
			search: searchQuery,
		},

	}, product?.id || '', sizeId);
	const handleSearchChange = (e: any) => {
		const query = e.target.value;
		setSearchQuery(query);
	};

	useEffect(() => {
		if (!product) return;
		refetch();
	}, [pagination, refetch, searchQuery, debouncedSearchQuery]);

	const columns = useMemo<MRT_ColumnDef<ProductVariation>[]>(
		() => [
			// {
			// 	accessorKey: "size",
			// 	header: "Size",
			// },
			{
				accessorKey: "color.name",
				header: "Color",
				Cell: ({ row }) => (
					<Box
						display={'flex'}
						style={{ alignItems: 'center', gap: '0.5rem', }}
					>
						<>{row.original.color?.name}</>
						{/* <ColorSwatch
							color={row.original.color?.hexCode || ''}
							size={30}
						/> */}
					</Box>
				),
			},
			{
				accessorKey: "sellingPrice",
				header: "Selling Price",
			},
			{
				accessorKey: "purchasedPrice",
				header: "Purchased Price",
			},
			{
				accessorKey: "branchStock",
				header: "Branch Stock",
				Cell: ({ row }) => (
					<Text size="sm" fw={900}>{row.original.branchStock} left</Text>
				),
			},
			{
				accessorKey: "image",
				header: "Image",
				Cell: ({ row }) => (
					<Box
						display={'flex'}
						style={{ alignItems: 'center', gap: '0.5rem' }}
					>
						{row.original.image && row.original.image.length > 0 ? (
							row.original.image.map((d) => (
								<Image
									style={{ cursor: "pointer" }}
									src={d.path}
									alt=""
									radius="md"
									fit="contain"
									height={50}
									width={50}
									onClick={() => {
										const modal = document.createElement('div');
										modal.style.position = 'fixed';
										modal.style.top = '0';
										modal.style.left = '0';
										modal.style.width = '100%';
										modal.style.height = '100%';
										modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
										modal.style.display = 'flex';
										modal.style.justifyContent = 'center';
										modal.style.alignItems = 'center';
										modal.style.zIndex = '1000';

										const modalImage: any = document.createElement('img');
										modalImage.src = d.path;
										modalImage.alt = d.path;
										modalImage.style.maxWidth = '90%';
										modalImage.style.maxHeight = '90%';

										modal.appendChild(modalImage);
										document.body.appendChild(modal);

										modal.addEventListener('click', () => {
											document.body.removeChild(modal);
										});
									}}
								/>
							))
						) : (
							<span>No image available</span>
						)}
					</Box>
				),

			},
		],
		[]
	);






	// Calculate total row count and page count
	const rowCount = data?.totalCount ?? 0;
	const pageCount = Math.ceil(rowCount / pagination.pageSize);

	const [selectedRow, setSelectedRow] = useState<ProductVariation | null>(null);

	const openModal = (row: ProductVariation) => {
		setSelectedRow(row);
		open()
	};


	const table = useMantineReactTable({
		columns,
		data: data?.variation ?? [],
		enableRowActions: true,
		enableFilters: false,
		state: {
			isLoading,
			pagination
		},
		rowCount: data?.totalCount,
		enablePagination: false,
		positionActionsColumn: 'last',
		enableColumnResizing: true,
		columnResizeMode: 'onEnd',
		renderRowActionMenuItems: ({ row }) => (
			<>
				<Menu.Item onClick={() => openModal(row.original)}>Adjust Stock</Menu.Item >
			</>
		),
	})


	return (
		<Paper withBorder radius="md" p="md" mt="lg" >
			<Space h="md" />
			<TextInput
				placeholder="Search by code / name"
				value={searchQuery}
				onChange={handleSearchChange}
				style={{ marginBottom: '20px' }}
			/>
			{selectedRow && <StockAdjust opened={opened} close={close} currentRow={selectedRow} />}
			<MantineReactTable
				table={table}
			/>
			<Space h="md" />
			{/* Manual Pagination Control */}

			<Pagination
				onChange={(page) => setPagination({ ...pagination, pageIndex: page - 1 })
				}
				total={pageCount}
				withEdges
			/>
		</Paper >
	);
}
