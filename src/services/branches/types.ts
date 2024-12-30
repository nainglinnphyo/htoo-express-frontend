export interface CreateBranchPayload {
	name: string;
	address: string;
	contactPerson: string;
	contactPhone: string;
}

export interface Branch {
	id: string;
	name: string;
	address: string;
	contactPerson: string;
	contactPhone: string;
}

export interface BranchResponse {
	data: Branch[];
	totalCount: number;
}

export interface PaginationFilterProps {
	pagination: {
		page: number;
		size: number;
	};
	filters?: {
		search: string;
	};
}
