'use client'
import { PageContainer } from "@/components/PageContainer/PageContainer";
import { SizeCreateModel } from "@/components/Product/SizeModel";
import { SizeTable } from "@/components/Table/SizeTable";
import { Button } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

export default function BranchPage() {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<PageContainer title="Branch">
			<SizeCreateModel opened={opened} close={close} />
			<Button onClick={open}>Create New Size</Button>
			<SizeTable opened={opened} />
		</PageContainer>
	);
}
