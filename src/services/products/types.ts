import { Category, SubCategory } from "../categories/types";

export interface Brand {
	id: string;
	name: string;
	shortName?: string;
}

export interface Product {
	id: string;
	code: string;
	name: string;
	description: string;
	brand?: Brand;
	variationCount?: number;
	category: Category;
	subCategory: SubCategory;
}

export interface Size {
	id: string;
	name: string;
}

export interface SizeResponse {
	data: Size[];
}

export interface BrandResponse {
	data: Brand[];
}

export interface ProductResponse {
	data: Product[];
	totalCount: number;
}

export interface Color {
	id: string;
	name: string;
	hexCode: string;
}

export interface ColorResponse {
	data: Color[];
}

export interface CreateProductPayload {
	code?: string;
	name: string;
	description: string;
	categoryId: string;
	subCategoryId: string;
	brandId: string;
}

export interface ProductVariationResponse {
	variation: ProductVariation[];
	totalCount: number;
}

export interface ProductDetailsResponse {
	data: Product;
}

export interface ProductVariation {
	id?: string;
	code?: string;
	colorId: string;
	sizeId: string;
	size?: Size;
	color?: Color;
	images: string[];
	product?: Product;
	purchasedPrice?: number;
	sellingPrice?: number;
	branchStock?: number;
	image?: {
		path: string;
	}[];
}

export interface CreateProductVariationPayload {
	productId: string;
	variation: ProductVariation[];
}

export interface ProductVariationSizeResponse {
	sizes: SizeCount[];
	totalCount: number;
}

export interface SizeCount {
	id: string;
	size: string;
	count: number;
	sizeStock: number;
}

export interface handleStockAdjustPayload {
	sign: string;
	quantity: number;
	productVariationId?: string;
}

export interface ProductVariationInvoiceResponse {
	data: ProductVariation[];
	totalCount: number;
}

export interface createInvoicePayload {
	note?: string;
	phone?: string;
	name?: string;
	address?: string;
	grossPrice: number;
	taxAmount: number;
	discountType: string;
	totalPrice: number;
	discountValue: number;
	discountAmount: number;
	variation: {
		variationId: string;
		total: number;
		qty: number;
	}[];
}

export interface ProductVariationForScanResponse {
	data: ProductVariation[];
	totalCount: number;
}

export interface CreateBrandPayload {
	name: string;
	shortName?: string;
}

export interface BrandListResponse {
	data: Brand[];
	totalCount: number;
}

export interface CreateColorPayload {
	name: string;
	hexCode?: string;
}

export interface ColorListResponse {
	data: Color[];
	totalCount: number;
}

export interface CreateSizePayload {
	name: string;
}

export interface SizeListResponse {
	data: Size[];
	totalCount: number;
}

export interface UpdateProductVariationPayload {
	id?: string;
	code?: string;
	colorId: string;
	sizeId: string;
	size?: Size;
	color?: Color;
	images: string[];
	product?: Product;
	purchasedPrice?: number;
	sellingPrice?: number;
	branchStock?: number;
	image?: {
		path: string;
	}[];
}
