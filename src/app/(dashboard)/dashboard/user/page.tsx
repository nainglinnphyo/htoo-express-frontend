'use client'

import { PageContainer } from '@/components/PageContainer/PageContainer'
import { RoleTable } from '@/components/Table/RoleTable'
import { UserTable } from '@/components/Table/UserTable'
import { Button, Container } from '@mantine/core'
import { useRouter } from 'next/navigation'
import React from 'react'


function UserPage() {
	const router = useRouter()
	return (
		<PageContainer title="User List">
			{/* <Button onClick={() => router.push(`/dashboard/user/add`)}>Add New Role</Button> */}
			<UserTable />
		</PageContainer>
	)
}

export default UserPage
