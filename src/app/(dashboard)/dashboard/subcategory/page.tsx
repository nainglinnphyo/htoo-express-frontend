'use client'

import { PageContainer } from "@/components/PageContainer/PageContainer";
import { SubCategoryCreateModel } from "@/components/SubCategory/SubCategoryModel";
import { SubCategoryTable } from "@/components/Table/SubCategoryTable";
import { Button } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

export default function CreateSubCategoryPage() {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<PageContainer title="Sub Category">
			<SubCategoryCreateModel opened={opened} close={close} />
			<Button onClick={open}>Create New Sub Category</Button>
			<SubCategoryTable />
		</PageContainer>
	);
}
