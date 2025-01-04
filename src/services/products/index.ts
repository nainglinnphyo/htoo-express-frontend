import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import ky from "ky";
import type {
	BrandListResponse,
	BrandResponse,
	ColorResponse,
	CreateBrandPayload,
	createInvoicePayload,
	CreateProductPayload,
	CreateProductVariationPayload,
	handleStockAdjustPayload,
	ProductDetailsResponse,
	ProductResponse,
	ProductVariationForScanResponse,
	ProductVariationInvoiceResponse,
	ProductVariationResponse,
	ProductVariationSizeResponse,
	SizeResponse,
} from "./types";
import axios, { authJsonHeader } from "..";
import { toast } from "react-toastify";
import { PaginationFilterProps } from "../branches/types";

const getBrand = async () => {
	const response = await axios.get(`unit/brand`, {
		headers: authJsonHeader(),
	});
	return response.data._data;
};

export const useFetchBrand = () =>
	useQuery<BrandResponse>({
		queryKey: ["brand"],
		queryFn: () => getBrand(),
		placeholderData: keepPreviousData,
	});

const getSize = async () => {
	const response = await axios.get(`unit/size`, {
		headers: authJsonHeader(),
	});
	return response.data._data;
};

export const useFetchSize = () =>
	useQuery<SizeResponse>({
		queryKey: ["unit-size"],
		queryFn: () => getSize(),
		placeholderData: keepPreviousData,
	});

const getColor = async () => {
	const response = await axios.get(`unit/color`, {
		headers: authJsonHeader(),
	});
	return response.data._data;
};

export const useFetchColor = () =>
	useQuery<ColorResponse>({
		queryKey: ["unit-color"],
		queryFn: () => getColor(),
		placeholderData: keepPreviousData,
	});

const createProduct = async (payload: CreateProductPayload) => {
	const response = await axios.post(
		"product",
		{ ...payload },
		{ headers: authJsonHeader() }
	);
	return response.data;
};

const uploadImage = async (payload: { image: String }) => {
	console.log(payload);
	const response = await axios.post(
		"image",
		{ imageBase64: payload.image },
		{ headers: authJsonHeader() }
	);
	return response.data;
};

export const useUploadImage = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: { image: string }) => uploadImage(payload),
		onSuccess: (data) => {
			if (data) {
				toast.success(data._metadata.message, {
					position: "bottom-right",
				});
				queryClient.invalidateQueries({ queryKey: ["image"] });
			}
		},
		onError: (e: any) => {
			toast.error(e.response.data._metadata.message, {
				position: "bottom-right",
			});
		},
	});
};

export const useCreateProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateProductPayload) => createProduct(payload),
		onSuccess: (data) => {
			if (data) {
				toast.success(data._metadata.message, {
					position: "bottom-right",
				});
				queryClient.invalidateQueries({ queryKey: ["product"] });
			}
		},
		onError: (e: any) => {
			toast.error(e.response.data._metadata.message, {
				position: "bottom-right",
			});
		},
	});
};

const getProducts = async ({ pagination, filters }: PaginationFilterProps) => {
	const response = await axios.get(
		`product?page=${pagination.page}&size=${pagination.size}&search=${
			filters?.search ?? ""
		}`,
		{
			headers: authJsonHeader(),
		}
	);
	return response.data._data;
};

export const useFetchProduct = ({
	pagination,
	filters,
}: PaginationFilterProps) =>
	useQuery<ProductResponse>({
		queryKey: ["product"],
		queryFn: () => getProducts({ pagination, filters }),
		placeholderData: keepPreviousData,
	});

const getProductVariation = async (
	{ pagination, filters }: PaginationFilterProps,
	productId: string,
	sizeId: string
) => {
	const response = await axios.get(
		`product/variation?page=${pagination.page}&size=${pagination.size}&search=${filters?.search}&productId=${productId}&sizeId=${sizeId}`,
		{
			headers: authJsonHeader(),
		}
	);
	return response.data._data;
};

const getProductVariationSize = async (
	{ pagination, filters }: PaginationFilterProps,
	productId: string
) => {
	const response = await axios.get(
		`product/size?page=${pagination.page}&size=${pagination.size}&search=${filters?.search}&productId=${productId}`,
		{
			headers: authJsonHeader(),
		}
	);
	return response.data._data;
};

export const useFetchProductVariationSize = (
	{ pagination, filters }: PaginationFilterProps,
	productId: string
) =>
	useQuery<ProductVariationSizeResponse>({
		queryKey: [`product-variation-size-${productId}`],
		queryFn: () => getProductVariationSize({ pagination, filters }, productId),
		placeholderData: keepPreviousData,
	});

export const useFetchProductVariation = (
	{ pagination, filters }: PaginationFilterProps,
	productId: string,
	sizeId: string
) =>
	useQuery<ProductVariationResponse>({
		queryKey: [`product-variation-${productId}`],
		queryFn: () =>
			getProductVariation({ pagination, filters }, productId, sizeId),
		placeholderData: keepPreviousData,
	});

const getProductDetails = async (productId: string) => {
	const response = await axios.get(`product/${productId}`, {
		headers: authJsonHeader(),
	});

	return response.data._data;
};

export const useFetchProductDetails = (productId: string) =>
	useQuery<ProductDetailsResponse>({
		queryKey: ["product-details"],
		queryFn: () => getProductDetails(productId),
		placeholderData: keepPreviousData,
	});

const createProductVariation = async (
	payload: CreateProductVariationPayload
) => {
	const response = await axios.post(
		"product/variation",
		{ ...payload },
		{ headers: authJsonHeader() }
	);
	return response.data;
};

export const useCreateProductVariation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateProductVariationPayload) =>
			createProductVariation(payload),
		onSuccess: (data) => {
			if (data) {
				toast.success(data._metadata.message, {
					position: "bottom-right",
				});
				queryClient.invalidateQueries({ queryKey: ["product-variation"] });
			}
		},
		onError: (e: any) => {
			toast.error(e.response.data._metadata.message, {
				position: "bottom-right",
			});
		},
	});
};

const handleStockAdjust = async (payload: handleStockAdjustPayload) => {
	const response = await axios.post(
		"stock/branch",
		{ ...payload },
		{ headers: authJsonHeader() }
	);
	return response.data;
};

export const useHandleStockAdjust = () => {
	// const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: handleStockAdjustPayload) =>
			handleStockAdjust(payload),
		onSuccess: (data) => {
			if (data) {
				toast.success(data._metadata.message, {
					position: "bottom-right",
				});
				// queryClient.invalidateQueries({ queryKey: ["product-variation"] });
			}
		},
		onError: (e: any) => {
			toast.error(e.response.data._metadata.message, {
				position: "bottom-right",
			});
		},
	});
};

// search product from voucher
const getProductVariationForVoucher = async ({
	pagination,
	filters,
}: PaginationFilterProps) => {
	const response = await axios.get(
		`product/variation-invoice?page=${pagination.page}&size=${
			pagination.size
		}&search=${filters?.search || ""}`,
		{
			headers: authJsonHeader(),
		}
	);
	return response.data._data;
};

export const useGetProductVariationForVoucher = ({
	pagination,
	filters,
}: PaginationFilterProps) =>
	useQuery<ProductVariationInvoiceResponse>({
		queryKey: [`product-variation-size-voucher`],
		queryFn: () => getProductVariationForVoucher({ pagination, filters }),
		placeholderData: keepPreviousData,
	});

const createInvoice = async (payload: createInvoicePayload) => {
	const response = await axios.post(
		"invoice",
		{ ...payload },
		{ headers: authJsonHeader() }
	);
	return response.data;
};

export const useCreateInvoice = () => {
	return useMutation({
		mutationFn: (payload: createInvoicePayload) => createInvoice(payload),
		onSuccess: (data) => {
			if (data) {
				toast.success(data._metadata.message, {
					position: "bottom-right",
				});
				// queryClient.invalidateQueries({ queryKey: ["product-variation"] });
			}
		},
		onError: (e: any) => {
			toast.error(e.response.data._metadata.message, {
				position: "bottom-right",
			});
		},
	});
};

const getProductVariationForScan = async (code: string) => {
	const response = await axios.get(`product/variation/${code}`, {
		headers: authJsonHeader(),
	});
	return response.data._data;
};

export const useGetProductVariationForScan = (code: string) =>
	useQuery<ProductVariationForScanResponse>({
		queryKey: [`product-variation-${code}`],
		queryFn: () => getProductVariationForScan(code),
		placeholderData: keepPreviousData,
	});

const getBrandList = async ({ pagination, filters }: PaginationFilterProps) => {
	const response = await axios.get(
		`brand?page=${pagination.page}&size=${pagination.size}&search=${filters?.search}`,
		{
			headers: authJsonHeader(),
		}
	);
	return response.data._data;
};

export const useFetchBrandList = ({
	pagination,
	filters,
}: PaginationFilterProps) =>
	useQuery<BrandListResponse>({
		queryKey: ["brand-list"],
		queryFn: () => getBrandList({ pagination, filters }),
		placeholderData: keepPreviousData,
	});

const createBrand = async (payload: CreateBrandPayload) => {
	const response = await axios.post(
		"brand",
		{ ...payload },
		{ headers: authJsonHeader() }
	);
	return response.data;
};

export const useCreateBrand = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateBrandPayload) => createBrand(payload),
		onSuccess: (data) => {
			if (data) {
				toast.success(data._metadata.message, {
					position: "bottom-right",
				});
				queryClient.invalidateQueries({ queryKey: ["brand"] });
			}
		},
		onError: (e: any) => {
			toast.error(e.response.data._metadata.message, {
				position: "bottom-right",
			});
		},
	});
};
