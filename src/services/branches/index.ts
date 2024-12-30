import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type {
	Branch,
	BranchResponse,
	CreateBranchPayload,
	PaginationFilterProps,
} from "./types";
import axios, { authJsonHeader } from "..";
import { toast } from "react-toastify";

const getBranches = async ({ pagination, filters }: PaginationFilterProps) => {
	const response = await axios.get(
		`branch?page=${pagination.page}&size=${pagination.size}&search=${filters.search}`,
		{
			headers: authJsonHeader(),
		}
	);
	return response.data._data;
};

const createBranch = async (payload: CreateBranchPayload) => {
	const response = await axios.post(
		"branch",
		{ ...payload },
		{ headers: authJsonHeader() }
	);
	return response.data;
};

export const useCreateBranch = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateBranchPayload) => createBranch(payload),
		onSuccess: (data) => {
			if (data) {
				toast.success(data._metadata.message, {
					position: "bottom-right",
				});
				queryClient.invalidateQueries({ queryKey: ["branches"] });
			}
		},
		onError: (e: unknown) => {
			toast.error(e.response.data._metadata.message, {
				position: "bottom-right",
			});
		},
	});
};

export const useBranch = ({ pagination, filters }: PaginationFilterProps) =>
	useQuery<BranchResponse>({
		queryKey: ["branches"],
		queryFn: () => getBranches({ pagination, filters }),
		placeholderData: keepPreviousData,
	});
