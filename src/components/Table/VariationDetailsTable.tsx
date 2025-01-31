"use client";

import { Paper, Title, Space, Pagination, Select, TextInput, Group, Drawer, ActionIcon, Menu, Badge, Skeleton, ColorSwatch, Box, LoadingOverlay, Image, Text } from "@mantine/core";
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useFetchProductVariation } from "@/services/products";
import { Product, ProductVariation } from "@/services/products/types";
import { useRouter } from "next/navigation";
import { StockAdjust } from "../Product/StockAdjustModel";
import { VariationEditModel } from "../Product/VariationEditModel";
import useAuthStore from "@/store/authStore";
import { BarcodeModel } from "../Product/BarcodeModel";
import { CartDrawer } from "../CardDrawer";
import { useCartStore } from "@/store/barcodeStore";

export function VariationDetailsTable({ product, isProductLoading, sizeId }: { product?: Product, isProductLoading: boolean, sizeId: string }) {
	const router = useRouter()
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const [barCodeItem, setBarCodeItem] = useState<any>([]);

	const [opened, { open, close }] = useDisclosure(false);
	const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
	const [openedBarcode, { open: openBarcode, close: closeBarcode }] = useDisclosure(false);

	const { addItem } = useCartStore()

	const { user } = useAuthStore()


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
		() => {
			const baseColumns = [
				{
					accessorKey: "code",
					header: "Code",
				},
				{
					accessorKey: "color.name",
					header: "Color",
					Cell: ({ row }: any) => (
						<Box
							display={'flex'}
							style={{ alignItems: 'center', gap: '0.5rem', }}
						>
							<>{row.original.color?.name}</>
						</Box>
					),
				},
				{
					accessorKey: "sellingPrice",
					header: "Selling Price",
				},
				{
					accessorKey: "branchStock",
					header: "Branch Stock",
					Cell: ({ row }: any) => (
						<Text size="sm" fw={900}>{row.original.branchStock} left</Text>
					),
				},
				{
					accessorKey: "image",
					header: "Image",
					Cell: ({ row }: any) => (
						<Box
							display={'flex'}
							style={{ alignItems: 'center', gap: '0.5rem' }}
						>
							{row.original.image && row.original.image.length > 0 ? (
								row.original.image.map((d: any) => (
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
			];
			if (user?.email === "admin@gmail.com") {
				baseColumns.splice(3, 0, {
					accessorKey: "purchasedPrice",
					header: "Purchased Price",
				});
			}
			return baseColumns
		},
		[user?.email]
	);


	// Calculate total row count and page count
	const rowCount = data?.totalCount ?? 0;
	const pageCount = Math.ceil(rowCount / pagination.pageSize);

	const [selectedRow, setSelectedRow] = useState<ProductVariation | null>(null);

	const openModal = (row: ProductVariation) => {
		setSelectedRow(row);
		open()
	};

	const openEdtModal = (row: ProductVariation) => {
		setSelectedRow(row);
		openEdit()
	};

	const openBarcodeModel = (row: any) => {
		setSelectedRow(row);
		openBarcode()
	};

	const handleAddToBarCodeList = (row: any) => {
		// setBarCodeItem()
		const code = row.code;
		const price = row.sellingPrice;
		const quantity = row.quantity;
		const category = `${row.product.subCategory.name} / ${row.product.brand.name}`
		addItem({
			code,
			price, quantity, category
		})
		localStorage.setItem('barCodeItem', JSON.stringify({
			code,
			price,
			quantity,
			category
		}))
		console.log(JSON.parse(JSON.stringify(localStorage.getItem('barCodeItem'))))
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
		initialState: { density: 'md' },
		enableRowNumbers: true,
		rowNumberMode: 'static',
		renderRowActionMenuItems: ({ row }) => (
			<>
				<Menu.Item onClick={() => handleAddToBarCodeList(row.original)}>Add To Barcode</Menu.Item >
				<Menu.Item onClick={() => openBarcodeModel(row.original)}>Export Barcode</Menu.Item >
				<Menu.Item onClick={() => openEdtModal(row.original)}>Edit</Menu.Item >
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
			{selectedRow && <BarcodeModel opened={openedBarcode} close={closeBarcode} currentRow={selectedRow} />}
			{selectedRow && <StockAdjust opened={opened} close={close} currentRow={selectedRow} />}
			{selectedRow && <VariationEditModel opened={openedEdit} close={closeEdit} currentRow={selectedRow} refetch={refetch} />}

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
