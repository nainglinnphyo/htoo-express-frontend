"use client";

import { Paper, Title, Space, Pagination, Select, TextInput, Group, ActionIcon, Menu } from "@mantine/core";
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useFetchProduct } from "@/services/products";
import { Product } from "@/services/products/types";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export function ProductTable() {
	const router = useRouter()
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});



	const [searchQuery, setSearchQuery] = useState('');
	// Custom hook to fetch data using pagination, sorting, and filtering
	const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);
	const { data, isError, isFetching, isLoading, refetch } = useFetchProduct({
		pagination: {
			page: pagination.pageIndex + 1, // Assuming 1-based index for pagination
			size: pagination.pageSize,
		},
		filters: {
			search: searchQuery,
		},
	});

	const handleSearchChange = (e: any) => {
		const query = e.target.value;
		setSearchQuery(query);
	};

	useEffect(() => {
		// if (!searchQuery.trim() && !pagination.pageIndex) return;
		refetch();
	}, [pagination, refetch, searchQuery, debouncedSearchQuery]);

	const columns = useMemo<MRT_ColumnDef<Product>[]>(
		() => [
			// {
			// 	accessorKey: "code",
			// 	header: "Code",
			// },
			{
				accessorKey: "name",
				header: "Product Name",
			},
			{
				accessorKey: "description",
				header: "Description",
			},
			{
				accessorKey: "brand.name",
				header: "Brand name",
			},
			{
				accessorKey: "category.name",
				header: "Category name",
			},
			{
				accessorKey: "subCategory.name",
				header: "Sub Category name",
			},
			{
				accessorKey: "variationCount",
				header: "Variation Count",
			},
		],
		[]
	);


	// Calculate total row count and page count
	const rowCount = data?.totalCount ?? 0;
	const pageCount = Math.ceil(rowCount / pagination.pageSize);

	// const handleEdit = (rowData) => {
	// 	console.log('Editing row:', rowData);
	// 	// Add your edit logic here
	// };

	// const handleDelete = (id) => {
	// 	console.log('Deleting row with ID:', id);
	// 	// Add your delete logic here
	// };

	const table = useMantineReactTable({
		columns,
		data: data?.data ?? [],
		enableRowActions: true,
		enableFilters: false,
		state: {
			isLoading,
		},
		enablePagination: false,
		positionActionsColumn: 'last',
		renderRowActionMenuItems: ({ row }) => (
			<>
				<Menu.Item onClick={() => router.push(`/dashboard/product/variation/add?productId=${row.original.id}`)}>
					Export Code
				</Menu.Item >
				<Menu.Item onClick={() => router.push(`/dashboard/product/variation/add?productId=${row.original.id}`)}>
					Add Variation
				</Menu.Item >
				<Menu.Item onClick={() => router.push(`/dashboard/product/variation?id=${row.original.id}`)}>Variation</Menu.Item >
			</>
		),
	})

	return (
		<Paper withBorder radius="md" p="md" mt="lg" >
			<Title order={5}>Product List</Title>
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
