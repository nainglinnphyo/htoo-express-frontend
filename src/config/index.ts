import {
	IconComponents,
	IconBuildingWarehouse,
	IconDashboard,
	IconLock,
	IconMoodSmile,
	IconShoppingBag,
} from "@tabler/icons-react";
import type { NavItem } from "@/types/nav-item";

export const navLinks: NavItem[] = [
	{ label: "Dashboard", icon: IconDashboard, link: "/dashboard" },
	{
		label: "Inventory",
		icon: IconBuildingWarehouse,
		initiallyOpened: true,
		links: [
			{
				label: "Products",
				link: "/dashboard/product",
			},
			{
				label: "Categories",
				link: "/dashboard/category",
			},
			{
				label: "Sub Categories",
				link: "/dashboard/subcategory",
			},
			{
				label: "Branches",
				link: "/dashboard/branch",
			},
			{
				label: "Brand",
				link: "/dashboard/brand",
			},
			{
				label: "Size",
				link: "/dashboard/size",
			},
			{
				label: "Color",
				link: "/dashboard/color",
			},
		],
	},

	{
		label: "POS",
		icon: IconShoppingBag,
		initiallyOpened: true,
		links: [
			{
				label: "Customer",
				link: "/dashboard/customer",
			},
			{
				label: "Sale",
				link: "/dashboard/sale",
			},
			{
				label: "Invoice",
				link: "/dashboard/invoice",
			},
		],
	},

	{
		label: "User Management",
		icon: IconShoppingBag,
		initiallyOpened: true,
		links: [
			{
				label: "User List",
				link: "/dashboard/user",
			},
			{
				label: "Role",
				link: "/dashboard/role",
			},
			{
				label: "Permission",
				link: "/dashboard/permission",
			},
		],
	},

	{
		label: "Components",
		icon: IconComponents,
		initiallyOpened: true,
		links: [
			{
				label: "Table",
				link: "/dashboard/table",
			},
			{
				label: "Form",
				link: "/dashboard/form",
			},
		],
	},
	{
		label: "Auth",
		icon: IconLock,
		initiallyOpened: true,
		links: [
			{
				label: "Login",
				link: "/login",
			},
			{
				label: "Register",
				link: "/register",
			},
		],
	},
	{
		label: "Sample",
		icon: IconMoodSmile,
		initiallyOpened: true,
		links: [
			{
				label: "Landing",
				link: "/",
			},
		],
	},
];
