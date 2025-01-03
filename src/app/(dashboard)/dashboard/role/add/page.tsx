'use client'
import RoleCreationForm from '@/components/Role/RoleCreationForm'
import { Anchor, Breadcrumbs, Container, Title } from '@mantine/core'
import React from 'react'


const items = [
	{ title: 'Role', link: '/dashboard/role' },
	{ title: `Create Role`, link: `#` },
].map((item, index) => (
	<Anchor href={item.link} key={index}>
		{item.title}
	</Anchor>
));

function RoleCreatePage() {
	return (
		<Container size="lg" py="xl">
			<Breadcrumbs style={{ paddingBlock: 10 }}>{items}</Breadcrumbs>
			<RoleCreationForm />
		</Container>
	)
}

export default RoleCreatePage
