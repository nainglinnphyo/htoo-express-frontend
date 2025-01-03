'use client'


import { useState } from 'react'
import { Button, TextInput, Stack, Title, Accordion, Box, Tabs } from '@mantine/core'
import { useForm } from '@mantine/form'
import PermissionSelect from './PermissionSelect'
import TablePermissions from './TablePermissions'
import { useCreateRole } from '@/services/role'
import { useRouter } from 'next/navigation'

const resources = [
	{
		resource: "product",
		tab: [
			{
				name: "product-list",
				action: ["list", "create", "add-variation", "variation-details", "adjust-stock"]
			}
		],
		table: [
			{
				name: "product-list-table",
				column: ["code", "name", "description", "brand", "category", "sub-category", "variation-count", "action"]
			},
			{
				name: "variation-list-table",
				column: ["name", "variation-count", "stock", "action"]
			},
			{
				name: "variation-details-table",
				column: ["color", "selling-price", "stock", "image", "action"]
			}
		]
	},
	{
		resource: "category",
		tab: [
			{
				name: "category-list",
				action: ["list", "create"]
			}
		],
		table: [
			{
				name: "category-list-table",
				column: ["name", "description", "subCategoryCount", "action"]
			}
		]
	},
	{
		resource: "sub-category",
		tab: [
			{
				name: "sub-category-list",
				action: ["list", "create"]
			}
		],
		table: [
			{
				name: "category-list-table",
				column: ["name", "description", "subCategoryCount", "action"]
			}
		]
	},
	{
		resource: "branch",
		tab: [
			{
				name: "branch-list",
				action: ["list", "create"]
			}
		],
		table: [
			{
				name: "branch-list-table",
				column: ["name", "address", "contactPerson", "contactPhone", "action"]
			}
		]
	},
	{
		resource: "customer",
		tab: [
			{
				name: "customer-list",
				action: ["list", "create"]
			}
		],
		table: [
			{
				name: "category-list-table",
				column: ["name", "phone", "address", "action"]
			}
		]
	},
	{
		resource: "sale",
		tab: [
			{
				name: "sale-list",
				action: ["create"]
			}
		],
		table: []
	},
	{
		resource: "invoice",
		tab: [
			{
				name: "invoice-list",
				action: ["create"]
			}
		],
		table: [
			{
				name: "invoice-list-table",
				column: ["invoice-no", "customer", "total-price", "tax", "invoice-by", "product-count", "action"]
			}
		]
	},
	{
		resource: "user",
		tab: [
			{
				name: "user-list",
				action: ["create"]
			}
		],
		table: [
			{
				name: "user-list-table",
				column: ["name", "email", "password", "action"]
			}
		]
	},
	{
		resource: "role",
		tab: [
			{
				name: "role-list",
				action: ["create"]
			}
		],
		table: [
			{
				name: "role-list-table",
				column: []
			}
		]
	}
]

export default function RoleCreationForm() {
	const router = useRouter()
	const [permissions, setPermissions] = useState<any>({})
	const [activeTab, setActiveTab] = useState<string | null>("product")
	const [loading, setLoading] = useState<boolean>(false)

	const form = useForm({
		initialValues: {
			roleName: '',
		},
		validate: {
			roleName: (value) => (value.length < 2 ? 'Role name must have at least 2 characters' : null),
		},
	})
	const createRole = useCreateRole()

	const handleSubmit = async (values: any) => {
		setLoading(true);
		try {
			const permissionResource:
				{
					resource: string,
					tabs: { name: string; action: string[] }[],
					tables: { name: string; columns: string[] }[]

				}[] = []
			Object.keys(permissions).forEach(key => {
				const tabs: { name: string; action: string[] }[] = [];

				permissions[key].tabs && Object.keys(permissions[key].actions).forEach(k => {
					tabs.push({
						name: k,
						action: permissions[key].actions[k]
					})
				})

				const tables: { name: string; columns: string[] }[] = [];
				permissions[key].tables && Object.keys(permissions[key].tables).forEach(k => {
					tables.push({
						name: k,
						columns: permissions[key].tables[k]
					})
				})
				permissionResource.push({
					resource: key,
					tabs: tabs,
					tables: tables
				})
			})
			const payload = {
				name: values.roleName,
				permissionResource: permissionResource
			}

			await createRole.mutateAsync({
				...payload
			});

			router.push(`/dashboard/role`);
		} catch (error) {
			console.error("Error creating role:", error);
			// Handle error (e.g., show error message to user)
		} finally {
			setLoading(false);
		}
	}

	const handlePermissionChange = (resource: any, type: any, name: any, value: any) => {
		setPermissions((prev: { [x: string]: { [x: string]: any } }) => ({
			...prev,
			[resource]: {
				...prev[resource],
				[type]: {
					...prev[resource]?.[type],
					[name]: value
				}
			}
		}))
	}

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack>
				<TextInput
					required
					label="Role Name"
					placeholder="Enter role name"
					size="md"
					{...form.getInputProps('roleName')}
				/>

				<Tabs value={activeTab} onChange={setActiveTab}>
					<Tabs.List grow>
						{resources.map((resource) => (
							<Tabs.Tab key={resource.resource} value={resource.resource}>
								{resource.resource.charAt(0).toUpperCase() + resource.resource.slice(1)}
							</Tabs.Tab>
						))}
					</Tabs.List>

					{resources.map((resource) => (
						<Tabs.Panel key={resource.resource} value={resource.resource}>
							<Accordion variant="contained" mt="md">
								{resource.tab.map((tab) => (
									<Accordion.Item key={tab.name} value={`${resource.resource}-${tab.name}-actions`}>
										<Accordion.Control>
											<Title order={4}>{tab.name} Actions</Title>
										</Accordion.Control>
										<Accordion.Panel>
											<PermissionSelect
												label={`${tab.name} Actions`}
												data={tab.action}
												onChange={(value) => handlePermissionChange(resource.resource, 'actions', tab.name, value)}
											/>
										</Accordion.Panel>
									</Accordion.Item>
								))}

								{resource.table.map((table) => (
									<Accordion.Item key={table.name} value={table.name}>
										<Accordion.Control>
											<Title order={4}>{table.name} Permissions</Title>
										</Accordion.Control>
										<Accordion.Panel>
											<TablePermissions
												tableName={table.name}
												columns={table.column}
												onChange={(value) => handlePermissionChange(resource.resource, 'tables', table.name, value)}
											/>
										</Accordion.Panel>
									</Accordion.Item>
								))}
							</Accordion>
						</Tabs.Panel>
					))}
				</Tabs>

				<Box mt="md">
					<Button loading={loading} type="submit" size="md">Create Role</Button>
				</Box>
			</Stack>
		</form >
	)
}
