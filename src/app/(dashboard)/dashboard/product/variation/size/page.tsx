'use client'

import { PageContainer } from "@/components/PageContainer/PageContainer";
import { VariationDetailsTable } from "@/components/Table/VariationDetailsTable";
import { useFetchProductDetails } from "@/services/products";
import { Button, LoadingOverlay } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { Breadcrumbs, Anchor } from '@mantine/core';



function ProductSizePage() {
	const searchParams = useSearchParams()
	const productId = searchParams.get("productId") || "";
	const sizeId = searchParams.get("sizeId") || "";
	const sizeName = searchParams.get("sizeName") || "";

	if (!productId || !sizeId || !sizeName) {
		return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
	}
	const { data, isLoading, isError, refetch } = useFetchProductDetails(productId)


	useEffect(() => {
		refetch();
	}, [refetch, productId]);

	const items = [
		{ title: 'Products', href: '/dashboard/product' },
		{ title: `${data?.data.name}`, href: `/dashboard/product/variation?id=${data?.data.id}` },
		{ title: `${sizeName}`, href: '#' },
	].map((item, index) => (
		<Anchor href={item.href} key={index}>
			{item.title}
		</Anchor>
	));

	if (!data) {
		return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
	}


	return (
		<PageContainer title="Product">
			<Breadcrumbs>{items}</Breadcrumbs>
			<VariationDetailsTable product={data?.data} isProductLoading={isLoading} sizeId={sizeId} />
		</PageContainer>
	);
}

export default ProductSizePage
