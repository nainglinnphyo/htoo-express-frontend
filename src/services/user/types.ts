export interface User {
	id: string;
	email: string;
}

export interface UserListResponse {
	data: User[];
	totalCount: number;
}
