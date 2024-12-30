import { PaginationFilterProps } from "../branches/types";
import axios, { authJsonHeader } from "..";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CustomerListResponse } from "./types";

const getCustomerList = async ({
	pagination,
	filters,
}: PaginationFilterProps) => {
	const response = await axios.get(
		`customer?page=${pagination.page}&size=${pagination.size}&search=${filters?.search}`,
		{
			headers: authJsonHeader(),
		}
	);
	return response.data._data;
};

export const useGetCustomerList = ({
	pagination,
	filters,
}: PaginationFilterProps) =>
	useQuery<CustomerListResponse>({
		queryKey: ["customer-list"],
		queryFn: () => getCustomerList({ pagination, filters }),
		placeholderData: keepPreviousData,
	});
