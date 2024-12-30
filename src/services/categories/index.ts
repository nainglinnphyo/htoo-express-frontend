import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import axios, { authJsonHeader } from "..";
import { toast } from "react-toastify";
import { PaginationFilterProps } from "../branches/types";
import {
	CategoryResponse,
	CreateCategoryPayload,
	CreateSubCategoryPayload,
	SubCategoryResponse,
} from "./types";

const getCategories = async ({
	pagination,
	filters,
}: PaginationFilterProps) => {
	const response = await axios.get(
		`category?page=${pagination.page}&size=${pagination.size}&search=${
			filters?.search ?? ""
		}`,
		{
			headers: authJsonHeader(),
		}
	);
	return response.data._data;
};

const getSubCategories = async ({
	pagination,
	filters,
}: PaginationFilterProps) => {
	const response = await axios.get(
		`category/sub?page=${pagination.page}&size=${pagination.size}&search=${
			filters?.search ?? ""
		}`,
		{
			headers: authJsonHeader(),
		}
	);
	return response.data._data;
};

const createCategory = async (payload: CreateCategoryPayload) => {
	const response = await axios.post(
		"category",
		{ ...payload },
		{ headers: authJsonHeader() }
	);
	return response.data;
};

const createSubCategory = async (payload: CreateSubCategoryPayload) => {
	const response = await axios.post(
		"category/sub",
		{ ...payload },
		{ headers: authJsonHeader() }
	);
	return response.data;
};

export const useCreateSubCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateSubCategoryPayload) =>
			createSubCategory(payload),
		onSuccess: (data) => {
			if (data) {
				toast.success(data._metadata.message, {
					position: "bottom-right",
				});
				queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
			}
		},
		onError: (e: any) => {
			toast.error(e.response.data._metadata.message, {
				position: "bottom-right",
			});
		},
	});
};

export const useCreateCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
		onSuccess: (data) => {
			if (data) {
				toast.success(data._metadata.message, {
					position: "bottom-right",
				});
				queryClient.invalidateQueries({ queryKey: ["categories"] });
			}
		},
		onError: (e: any) => {
			toast.error(e.response.data._metadata.message, {
				position: "bottom-right",
			});
		},
	});
};

export const useCategory = ({ pagination, filters }: PaginationFilterProps) =>
	useQuery<CategoryResponse>({
		queryKey: ["categories"],
		queryFn: () => getCategories({ pagination, filters }),
		placeholderData: keepPreviousData,
	});

export const useSubCategory = ({
	pagination,
	filters,
}: PaginationFilterProps) =>
	useQuery<SubCategoryResponse>({
		queryKey: ["sub-categories"],
		queryFn: () => getSubCategories({ pagination, filters }),
		placeholderData: keepPreviousData,
	});
