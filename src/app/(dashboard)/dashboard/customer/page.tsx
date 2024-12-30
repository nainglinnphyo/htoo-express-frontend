'use client'

import { PageContainer } from "@/components/PageContainer/PageContainer";
import { ProductCreateModel } from "@/components/Product/ProductModel";
import { CustomerTable } from "@/components/Table/CustomerTable";
import { ProductTable } from "@/components/Table/ProductTable";
import { Button } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

export default function CustomerPage() {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<PageContainer title="Customer List">
			{/* <ProductCreateModel opened={opened} close={close} /> */}
			<Button onClick={open}>Create New Customer</Button>
			<CustomerTable />
		</PageContainer>
	);
}
