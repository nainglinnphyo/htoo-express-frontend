import { PaginationFilterProps } from "../branches/types";
import axios, { authJsonHeader } from "..";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { InvoiceDetailsResponse, InvoiceListResponse } from "./types";

const getInvoiceList = async ({
	pagination,
	filters,
}: PaginationFilterProps) => {
	const response = await axios.get(
		`invoice?page=${pagination.page}&size=${pagination.size}&search=${filters?.search}`,
		{
			headers: authJsonHeader(),
		}
	);
	return response.data._data;
};

export const useGetInvoiceList = ({
	pagination,
	filters,
}: PaginationFilterProps) =>
	useQuery<InvoiceListResponse>({
		queryKey: ["invoice-list"],
		queryFn: () => getInvoiceList({ pagination, filters }),
		placeholderData: keepPreviousData,
	});

const getInvoiceDetails = async (invoiceId: string) => {
	const response = await axios.get(`invoice/${invoiceId}`, {
		headers: authJsonHeader(),
	});
	return response.data._data;
};

export const useGetInvoiceDetails = (invoiceId: string) =>
	useQuery<InvoiceDetailsResponse>({
		queryKey: [`invoice-details=${invoiceId}`],
		queryFn: () => getInvoiceDetails(invoiceId),
		placeholderData: keepPreviousData,
	});
