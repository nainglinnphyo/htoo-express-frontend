"use client";

import { Paper, Title, Space, Pagination, Select, TextInput, Text } from "@mantine/core";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useGetRoleList } from "@/services/role";
import { Role } from "@/services/role/types";

export function RoleTable() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});



	const [searchQuery, setSearchQuery] = useState('');
	// Custom hook to fetch data using pagination, sorting, and filtering
	const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);
	const { data, isError, isFetching, isLoading, refetch } = useGetRoleList({
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

	const columns = useMemo<MRT_ColumnDef<Role>[]>(
		() => [
			{
				accessorKey: "name",
				header: "Role Name",
			},
			{
				accessorKey: "userCount",
				header: "User Count",
			},
			// {
			// 	accessorKey: "subCategoryCount",
			// 	header: "Sub Category Count",
			// },
		],
		[]
	);


	// Calculate total row count and page count
	const rowCount = data?.totalCount ?? 0;
	const pageCount = Math.ceil(rowCount / pagination.pageSize);



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
				enableFilters={false}
				columns={columns}
				data={data?.data ?? []}
				state={{
					isLoading,
				}}
				enablePagination={false}
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
