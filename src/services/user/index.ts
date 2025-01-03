import { PaginationFilterProps } from "../branches/types";
import axios, { authJsonHeader } from "..";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { UserListResponse } from "./types";

const getUserList = async ({ pagination, filters }: PaginationFilterProps) => {
	const response = await axios.get(
		`auth/users?page=${pagination.page}&size=${pagination.size}&search=${filters?.search}`,
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
		queryKey: ["user"],
		queryFn: () => getUserList({ pagination, filters }),
		placeholderData: keepPreviousData,
	});
