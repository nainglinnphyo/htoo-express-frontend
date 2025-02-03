'use client'

import { PageContainer } from "@/components/PageContainer/PageContainer";
import { ProductCreateModel } from "@/components/Product/ProductModel";
import { ProductTable } from "@/components/Table/ProductTable";
import useAuthStore from "@/store/authStore";
import { Button, Group } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPage() {
	const [opened, { open, close }] = useDisclosure(false);
	const { user } = useAuthStore()
	const router = useRouter()
	const [productPermissions, setProductPermissions] = useState<string[]>([])

	useEffect(() => {
		if (user?.role?.tabsPermission) {
			const inventoryTabsPermissions = user.role.tabsPermission.filter((tab: any) =>
				tab.tabName.some((tn: any) => tn.name === 'product-list')
			)
			const allActions = inventoryTabsPermissions.flatMap((tab: any) => tab.actions)

			setProductPermissions(allActions)
		}
	}, [user])


	return (
		<PageContainer title="Product">
			<ProductCreateModel opened={opened} close={close} />
			<Group gap={10}>
				<Button leftSection={<IconPlus size={16} />} onClick={open}>
					Create New Product
				</Button>
				<Button leftSection={<IconSearch size={16} />} onClick={() => router.push("product/search")}>
					Search Variation
				</Button>
			</Group>
			<ProductTable />
		</PageContainer>
	);
}
