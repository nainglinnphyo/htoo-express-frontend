'use client'

import { PageContainer } from '@/components/PageContainer/PageContainer'
import { RoleTable } from '@/components/Table/RoleTable'
import { Button, Container } from '@mantine/core'
import { useRouter } from 'next/navigation'
import React from 'react'


function RolePage() {
	const router = useRouter()
	return (
		<PageContainer title="Role List">
			<Button onClick={() => router.push(`/dashboard/role/add`)}>Add New Role</Button>
			<RoleTable />
		</PageContainer>
	)
}

export default RolePage
