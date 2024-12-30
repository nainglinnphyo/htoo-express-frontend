export interface Customer {
	id: string;
	name: string;
	phone: string;
	address: string;
}

export interface CustomerListResponse {
	data: Customer[];
	totalCount: number;
}
