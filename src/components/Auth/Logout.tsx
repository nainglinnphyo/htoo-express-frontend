
'use client'

import useAuthStore from '@/store/authStore'
import { Button } from '@mantine/core'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Logout() {
	const { logout } = useAuthStore()
	const router = useRouter()

	const handleLogout = async () => {
		// e.preventDefault()
		try {
			await logout()
			router.push("/login")
		} catch (err) {
			console.log(err)
		}

	}
	return (
		<Button onClick={handleLogout}>Logout</Button>
	)
}
