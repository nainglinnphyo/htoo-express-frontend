"use client";

import { Paper, Space, Pagination, TextInput, Text, Badge, Menu } from "@mantine/core";
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useGetInvoiceList } from "@/services/invoice";
import { Invoice } from "@/services/invoice/types";
import { useRouter } from "next/navigation";

export function InvoiceTable() {
	const router = useRouter()
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});



	const [searchQuery, setSearchQuery] = useState('');
	// Custom hook to fetch data using pagination, sorting, and filtering
	const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);
	const { data, isError, isFetching, isLoading, refetch } = useGetInvoiceList({
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

	const columns = useMemo<MRT_ColumnDef<Invoice>[]>(
		() => [
			{
				accessorKey: "invoiceId",
				header: "Invoice No",
				Cell: ({ row }) => (
					<Text size="sm" fw={900}><Badge>{row.original.invoiceId}</Badge></Text>
				),
			},
			{
				accessorKey: "customer.name",
				header: "Customer name",
			},
			{
				accessorKey: "grossPrice",
				header: "Gross Price",
				Cell: ({ row }) => (
					<Text size="sm" fw={900}>{row.original.grossPrice} Ks</Text>
				),
			},
			{
				accessorKey: "discountPrice",
				header: "Discount Price",
				Cell: ({ row }) => (
					<Text size="sm" fw={900}>{row.original.grossPrice} Ks</Text>
				),
			},
			{
				accessorKey: "discountPrice",
				header: "Total Price",
				Cell: ({ row }) => (
					<Text size="sm" fw={900}>{row.original.grossPrice} Ks</Text>
				),
			},
			{
				accessorKey: "tax",
				header: "Tax",
				Cell: ({ row }) => (
					<Text size="sm" fw={900}>{row.original.tax} Ks</Text>
				),
			},
			{
				accessorKey: "branch.name",
				header: "Branch",
			},
			{
				accessorKey: "actionedBy.email",
				header: "Invoice By",
			},
			{
				accessorKey: "totalProductCount",
				header: "Total Product",
				Cell: ({ row }) => (
					<Text size="sm" fw={900}>{row.original.invoiceOrderProduct.reduce((a, b) => {
						return a + b.quantity
					}, 0)}</Text>
				),
			},
		],
		[]
	);


	// Calculate total row count and page count
	const rowCount = data?.totalCount ?? 0;
	const pageCount = Math.ceil(rowCount / pagination.pageSize);


	const table = useMantineReactTable({
		columns,
		data: data?.data ?? [],
		enableRowActions: true,
		enableFilters: false,
		state: {
			isLoading,
		},
		enablePagination: false,
		initialState: { density: 'md' },
		enableRowNumbers: true,
		rowNumberMode: 'static',
		positionActionsColumn: 'last',
		renderRowActionMenuItems: ({ row }) => (
			<>
				<Menu.Item onClick={() => router.push(`/dashboard/invoice/details?id=${row.original.id}`)}>Details</Menu.Item >
			</>
		),
	})



	return (
		<Paper withBorder radius="md" p="md" mt="lg">
			<Space h="md" />
			<TextInput
				placeholder="Search by name"
				value={searchQuery}
				onChange={handleSearchChange}
				style={{ marginBottom: '20px' }}
			/>
			<MantineReactTable
				table={table}
			// enableFilters={false}
			// columns={columns}
			// data={data?.data ?? []}
			// state={{
			// 	isLoading,
			// }}
			// enablePagination={false}
			/>
			<Space h="md" />
			{/* Manual Pagination Control */}

			<Pagination
				onChange={(page) => setPagination({ ...pagination, pageIndex: page - 1 })}
				total={pageCount}
				withEdges
			/>
		</Paper>
	);
}
