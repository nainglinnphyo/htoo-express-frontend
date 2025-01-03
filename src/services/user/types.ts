import { Role } from "../role/types";

export interface User {
	id: string;
	email: string;
	password: string;
	name: string;
	role: Role;
}

export interface UserListResponse {
	data: User[];
	totalCount: number;
}
