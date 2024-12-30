"use client"

import { PageContainer } from '@/components/PageContainer/PageContainer'
import { VariationTable } from '@/components/Table/VariationTable'
import { useFetchProductDetails, useFetchProductVariation } from '@/services/products';
import { Anchor, Breadcrumbs, Button, LoadingOverlay } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Box } from 'iconsax-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function VariationPage() {

	const router = useRouter()

	const searchParams = useSearchParams();
	const id = searchParams.get('id') || '';


	const { data, isLoading, isError, refetch } = useFetchProductDetails(id)

	useEffect(() => {
		refetch();
	}, [refetch, id]);

	if (isLoading || !data) {
		return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
	}

	const items = [
		{ title: 'Products', link: '/dashboard/product' },
		{ title: `${data?.data.name}`, link: `#` },
	].map((item, index) => (
		<Anchor href={item.link} key={index}>
			{item.title}
		</Anchor>
	));

	return (
		<PageContainer title={`${data?.data.name}`}>
			<Breadcrumbs style={{ paddingBlock: 10 }}>{items}</Breadcrumbs>
			<Button onClick={() => router.push(`/dashboard/product/variation/add?productId=${data?.data.id}`)}>Add New Variation</Button>
			<VariationTable product={data?.data} isProductLoading={isLoading} />
		</PageContainer >
	)
}

export default VariationPage
