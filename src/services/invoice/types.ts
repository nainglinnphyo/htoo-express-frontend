import { Branch } from "../branches/types";
import { Customer } from "../customer/types";
import { ProductVariation } from "../products/types";
import { User } from "../user/types";

export interface Invoice {
	id: string;
	invoiceId: string;
	phone: string;
	customer: Customer;
	grossPrice: number;
	tax: number;
	note?: string;
	createdAt: string;
	actionedBy: User;
	branch: Branch;
	invoiceOrderProduct: {
		productVariation: ProductVariation;
		perPrice: number;
		quantity: number;
	}[];
}

export interface InvoiceListResponse {
	data: Invoice[];
	totalCount: number;
}

export interface InvoiceDetailsResponse {
	data: Invoice;
}
