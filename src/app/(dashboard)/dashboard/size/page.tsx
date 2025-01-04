'use client'
import { BranchModel } from "@/components/Branch/BranchModel";
import { PageContainer } from "@/components/PageContainer/PageContainer";
import { BranchTable } from "@/components/Table/BranchTable";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

export default function BranchPage() {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<PageContainer title="Branch">
			<BranchModel opened={opened} close={close} />
			<Button onClick={open}>Create New Branch</Button>
			<BranchTable />
		</PageContainer>
	);
}
