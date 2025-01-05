'use client'
import { BranchModel } from "@/components/Branch/BranchModel";
import { PageContainer } from "@/components/PageContainer/PageContainer";
import { ColorCreateModel } from "@/components/Product/ColorModel";
import { ColorTable } from "@/components/Table/ColorTable";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

export default function ColorPage() {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<PageContainer title="Color">
			<ColorCreateModel close={close} opened={opened} />
			<Button onClick={open}>Create New Color</Button>
			<ColorTable opened={opened} />
		</PageContainer>
	);
}
