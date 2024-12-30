'use client'

import { PageContainer } from "@/components/PageContainer/PageContainer";
import { ProductCreateModel } from "@/components/Product/ProductModel";
import { ProductTable } from "@/components/Table/ProductTable";
import { Button } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

export default function ProductPage() {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<PageContainer title="Product">
			<ProductCreateModel opened={opened} close={close} />
			<Button onClick={open}>Create New Product</Button>
			<ProductTable />
		</PageContainer>
	);
}
