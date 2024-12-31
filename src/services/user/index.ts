import { PaginationFilterProps } from "../branches/types";
import axios, { authJsonHeader } from "..";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { UserListResponse } from "./types";

const getUserList = async ({ pagination, filters }: PaginationFilterProps) => {
	const response = await axios.get(
		`user?page=${pagination.page}&size=${pagination.size}&search=${filters?.search}`,
		{
			headers: authJsonHeader(),
		}
	);
	return response.data._data;
};

export const useGetUserList = ({
	pagination,
	filters,
}: PaginationFilterProps) =>
	useQuery<UserListResponse>({
		queryKey: ["brand"],
		queryFn: () => getUserList({ pagination, filters }),
		placeholderData: keepPreviousData,
	});
