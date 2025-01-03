import { PaginationFilterProps } from "../branches/types";
import axios, { authJsonHeader } from "..";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { CreateRolePayloadPayload, RoleListResponse } from "./types";
import { toast } from "react-toastify";

const getRoleList = async ({ pagination, filters }: PaginationFilterProps) => {
	const response = await axios.get(
		`role?page=${pagination.page}&size=${pagination.size}&search=${filters?.search}`,
		{
			headers: authJsonHeader(),
		}
	);
	return response.data._data;
};

export const useGetRoleList = ({
	pagination,
	filters,
}: PaginationFilterProps) =>
	useQuery<RoleListResponse>({
		queryKey: ["role"],
		queryFn: () => getRoleList({ pagination, filters }),
		placeholderData: keepPreviousData,
	});

const createRole = async (payload: CreateRolePayloadPayload) => {
	const response = await axios.post(
		"role",
		{ ...payload },
		{ headers: authJsonHeader() }
	);
	return response.data;
};

export const useCreateRole = () => {
	// const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateRolePayloadPayload) => createRole(payload),
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
