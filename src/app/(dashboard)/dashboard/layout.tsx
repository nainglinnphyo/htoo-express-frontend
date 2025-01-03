"use client";

import { useEffect, useState } from "react";
import {
	AppShell,
	Burger,
	Text,
	useMantineColorScheme,
	useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBuildingWarehouse } from "@tabler/icons-react";

import { AdminHeader } from "@/components/Headers/AdminHeader";
import { Navbar } from "@/components/Navbar/Navbar";
import { navLinks } from "@/config";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import useAuthStore from "@/store/authStore";
import { NavItem } from "@/types/nav-item";
import { DISABLE_PERMISSION } from "@/utils";

interface Props {
	children: React.ReactNode;
}

const inventoryTabs = ['sub-category-list', 'customer-list', 'product-list', 'branch-list'];
const posTabs = ['customer-list', 'sale-list', 'invoice-list'];
const userTabs = ['user-list', 'role-list'];
const dashboardTabs = ['dashboard-list'];

export default function DashboardLayout({ children }: Props) {
	const [opened, { toggle }] = useDisclosure();
	const { colorScheme } = useMantineColorScheme();
	const theme = useMantineTheme();
	const [authNavItems, setAuthNavItems] = useState<NavItem[]>([]);

	const { user } = useAuthStore();

	useEffect(() => {
		let newAuthNavItems: NavItem[] = [];

		if (user?.role?.tabsPermission) {

			const inventoryTabsPermissions = user.role.tabsPermission.filter((tab: any) =>
				tab.tabName.some((tn: any) => inventoryTabs.includes(tn.name))
			);

			const posTabsPermissions = user.role.tabsPermission.filter((tab: any) =>
				tab.tabName.some((tn: any) => posTabs.includes(tn.name))
			);
			const userTabsPermissions = user.role.tabsPermission.filter((tab: any) =>
				tab.tabName.some((tn: any) => userTabs.includes(tn.name))
			);

			const dashboardTabsPermissions = user.role.tabsPermission.filter((tab: any) =>
				tab.tabName.some((tn: any) => dashboardTabs.includes(tn.name))
			);

			if (dashboardTabsPermissions.length > 0) {
				const dashboardLinks = dashboardTabsPermissions.flatMap((tab: any) =>
					tab.tabName
						.filter((tn: any) => dashboardTabs.includes(tn.name))
						.map((tn: any) => ({
							label: `${tn.name.replace('-list', '')}`,
							link: `${tn.name.replace('-list', '')}`
						}))
				);

				newAuthNavItems.push({
					icon: IconBuildingWarehouse,
					label: 'Dashboard',
					link: "/dashboard"
				});
			}

			if (inventoryTabsPermissions.length > 0) {
				const inventoryLinks = inventoryTabsPermissions.flatMap((tab: any) =>
					tab.tabName
						.filter((tn: any) => inventoryTabs.includes(tn.name))
						.map((tn: any) => ({
							label: `${tn.name.replace('-list', '')}`,
							link: `/dashboard/${tn.name.replace('-list', '')}`
						}))
				);

				newAuthNavItems.push({
					icon: IconBuildingWarehouse,
					label: 'Inventory',
					initiallyOpened: false,
					links: inventoryLinks
				});
			}

			if (posTabsPermissions.length > 0) {
				const posLinks = posTabsPermissions.flatMap((tab: any) =>
					tab.tabName
						.filter((tn: any) => posTabs.includes(tn.name))
						.map((tn: any) => ({
							label: `${tn.name.replace('-list', '')}`,
							link: `/dashboard/${tn.name.replace('-list', '')}`
						}))
				);

				newAuthNavItems.push({
					icon: IconBuildingWarehouse,
					label: 'Pos',
					initiallyOpened: false,
					links: posLinks
				});
			}
			if (userTabsPermissions.length > 0) {
				const userLinks = userTabsPermissions.flatMap((tab: any) =>
					tab.tabName
						.filter((tn: any) => userTabs.includes(tn.name))
						.map((tn: any) => ({
							label: `${tn.name.replace('-list', '')}`,
							link: `/dashboard/${tn.name.replace('-list', '')}`
						}))
				);

				newAuthNavItems.push({
					icon: IconBuildingWarehouse,
					label: 'User Management',
					initiallyOpened: false,
					links: userLinks
				});
			}


		}

		setAuthNavItems(newAuthNavItems);
	}, [user?.role?.tabsPermission]);

	const bg = colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0];

	return (
		<ProtectedRoute>
			<AppShell
				header={{ height: 60 }}
				navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: !opened } }}
				padding="md"
				transitionDuration={500}
				transitionTimingFunction="ease"
			>
				<AppShell.Navbar>
					<Navbar data={DISABLE_PERMISSION ? navLinks : authNavItems} hidden={!opened} />
				</AppShell.Navbar>
				<AppShell.Header>
					<AdminHeader
						burger={
							<Burger
								opened={opened}
								onClick={toggle}
								hiddenFrom="sm"
								size="sm"
								mr="xl"
							/>
						}
					/>
				</AppShell.Header>
				<AppShell.Main bg={bg}>{children}</AppShell.Main>
				<AppShell.Footer>
					<Text w="full" size="sm" c="gray">
						Copyright © {new Date().getFullYear()} Jotyy
					</Text>
				</AppShell.Footer>
			</AppShell>
		</ProtectedRoute>
	);
}

