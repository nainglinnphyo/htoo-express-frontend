'use client'

import { PageContainer } from "@/components/PageContainer/PageContainer";
import { BrandCreateModel } from "@/components/Product/BrandModel";
import { BrandTable } from "@/components/Table/BrandTable";
import { Button } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

export default function BranchPage() {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<PageContainer title="Brand">
			<BrandCreateModel opened={opened} close={close} />
			<Button onClick={open}>Create New Brand</Button>
			<BrandTable opened={opened} />
		</PageContainer>
	);
}
