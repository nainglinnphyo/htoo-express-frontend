export interface Role {
	id: string;
	name: string;
	permissionResource: PermissionResource[];
}

export interface RoleListResponse {
	data: Role[];
	totalCount: number;
}

export interface CreateRolePayloadPayload {
	name: string;
}

export interface PermissionResource {
	resource: string;
	tabs: {
		name: string;
		action: string[];
	}[];
	tables: {
		name: string;
		columns: string[];
	}[];
}
