"use client";

import { Paper, Title, Space, Pagination, Select, TextInput, Group, ActionIcon, Menu, Badge, Skeleton, ColorSwatch, Box, LoadingOverlay, Text, useMantineTheme } from "@mantine/core";
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useFetchProduct, useFetchProductVariation, useFetchProductVariationSize } from "@/services/products";
import { Product, ProductVariation, SizeCount } from "@/services/products/types";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export function VariationTable({ product, isProductLoading }: { product?: Product, isProductLoading: boolean }) {
	const router = useRouter()
	const theme = useMantineTheme();
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});



	const [searchQuery, setSearchQuery] = useState('');
	// Custom hook to fetch data using pagination, sorting, and filtering
	const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);
	const { data, isError, isFetching, isLoading, refetch } = useFetchProductVariationSize({
		pagination: {
			page: pagination.pageIndex + 1, // Assuming 1-based index for pagination
			size: pagination.pageSize,
		},
		filters: {
			search: searchQuery,
		},

	}, product?.id || '');

	const handleSearchChange = (e: any) => {
		const query = e.target.value;
		setSearchQuery(query);
	};

	useEffect(() => {
		// if (!searchQuery.trim() && !pagination.pageIndex) return;
		refetch();
	}, [pagination, refetch, searchQuery, debouncedSearchQuery, isProductLoading]);
	const columns = useMemo<MRT_ColumnDef<SizeCount>[]>(
		() => [
			{
				accessorKey: "size",
				header: "Size",
			},
			{
				accessorKey: "count",
				header: "Color Count",
			},
			{
				accessorKey: "sizeStock",
				header: "Stock on size",
				Cell: ({ row }) => (
					<Text size="sm" fw={900} c={row.original.sizeStock <= 10 ? theme.colors.red[6] : ''} > {row.original.sizeStock} left</Text >
				),
			},
			// {
			// 	accessorKey: "color.name",
			// 	header: "Color",
			// 	Cell: ({ row }) => (
			// 		<Box
			// 			display={'flex'}
			// 			style={{ alignItems: 'center', gap: '0.5rem' }}
			// 		>
			// 			<>{row.original.color?.name}</>
			// 			<ColorSwatch
			// 				color={row.original.color?.hexCode || ''}
			// 				size={30}
			// 			/>
			// 		</Box>
			// 	),
			// },
		],
		[]
	);


	// Calculate total row count and page count
	const rowCount = data?.totalCount ?? 0;
	const pageCount = Math.ceil(rowCount / pagination.pageSize);


	const table = useMantineReactTable({
		columns,
		data: data?.sizes ?? [],
		enableRowActions: true,
		enableFilters: false,
		state: {
			isLoading,
		},
		enablePagination: false,
		positionActionsColumn: 'last',
		renderRowActionMenuItems: ({ row }) => (
			<>
				<Menu.Item onClick={() => router.push(`/dashboard/product/variation/size?sizeId=${row.original.id}&productId=${product?.id}&sizeName=${row.original.size}`)}>Size Details</Menu.Item >
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
