export interface CreateCategoryPayload {
	name: string;
	description: string;
}

export interface Category {
	id: string;
	name: string;
	description: string;
	subCategoryCount: number;
	subCategory: SubCategory[];
}

export interface SubCategory {
	id: string;
	category: Category;
	name: string;
	description: string;
}

export interface CategoryResponse {
	data: Category[];
	totalCount: number;
}

export interface SubCategoryResponse {
	data: SubCategory[];
	totalCount: number;
}

export interface CreateSubCategoryPayload {
	name: string;
	description: string;
	categoryId: string;
}
