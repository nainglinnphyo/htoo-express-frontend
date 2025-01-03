'use client'

import { useState } from 'react'
import { Button, TextInput, Stack, Title, Accordion, Box, Tabs, Switch } from '@mantine/core'
import { useForm } from '@mantine/form'
import PermissionSelect from './PermissionSelect'
import TablePermissions from './TablePermissions'
import { useCreateRole } from '@/services/role'
import { useRouter } from 'next/navigation'
import resources from 'role.json'

export default function RoleCreationForm() {
	const router = useRouter()
	const [permissions, setPermissions] = useState<any>({})
	const [activeTab, setActiveTab] = useState<string | null>("product")
	const [loading, setLoading] = useState<boolean>(false)
	const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({})

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
			const permissionResource: {
				resource: string,
				tabs: { name: string; action: string[] }[],
				tables: { name: string; columns: string[] }[]
			}[] = []

			Object.keys(permissions).forEach(key => {
				const tabs: { name: string; action: string[] }[] = [];

				permissions[key].actions && Object.keys(permissions[key].actions).forEach(k => {
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
			console.log(payload)
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

	const handlePermissionChange = (resource: string, type: string, name: string, value: any) => {
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

	const toggleAllPermissions = (resource: string) => {
		const newToggleState = !toggleStates[resource]
		setToggleStates(prev => ({ ...prev, [resource]: newToggleState }))

		const resourceData = resources.find(r => r.resource === resource)
		if (!resourceData) return

		// Toggle all tab actions
		resourceData.tab.forEach(tab => {
			handlePermissionChange(resource, 'actions', tab.name, newToggleState ? tab.action : [])
		})

		// Toggle all table columns
		resourceData.table.forEach(table => {
			handlePermissionChange(resource, 'tables', table.name, newToggleState ? table.column : [])
		})
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
							<Box mt="md" mb="md">
								<Switch
									label={`Toggle All ${resource.resource.charAt(0).toUpperCase() + resource.resource.slice(1)} Permissions`}
									checked={toggleStates[resource.resource] || false}
									onChange={() => toggleAllPermissions(resource.resource)}
								/>
							</Box>
							<Accordion variant="contained">
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
												value={permissions[resource.resource]?.actions?.[tab.name] || []}
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
												value={permissions[resource.resource]?.tables?.[table.name] || []}
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
		</form>
	)
}

