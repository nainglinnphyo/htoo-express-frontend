'use client'

import { CategoryCreateModel } from "@/components/Category/CategoryModel";
import { PageContainer } from "@/components/PageContainer/PageContainer";
import { CategoryTable } from "@/components/Table/CategoryTable";
import { Button } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

export default function BranchPage() {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<PageContainer title="Category">
			<CategoryCreateModel opened={opened} close={close} />
			<Button onClick={open}>Create New Category</Button>
			<CategoryTable />
		</PageContainer>
	);
}
