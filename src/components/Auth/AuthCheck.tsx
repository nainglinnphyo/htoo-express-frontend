'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import { LoadingOverlay } from '@mantine/core'

interface AuthCheckProps {
	children: React.ReactNode
	redirectTo: string
	shouldBeAuthenticated: boolean
}

export function AuthCheck({ children, redirectTo, shouldBeAuthenticated }: AuthCheckProps) {
	const router = useRouter()
	const { isAuthenticated, isLoading, fetchUser, hasStoredToken, user } = useAuthStore()
	const [isChecking, setIsChecking] = useState(true)

	useEffect(() => {
		const checkAuth = async () => {
			if (!isAuthenticated() && !isLoading && hasStoredToken()) {
				await fetchUser()
			}

			if (shouldBeAuthenticated !== isAuthenticated()) {
				router.push(redirectTo)
			}
			setIsChecking(false)
		}

		checkAuth()
	}, [isAuthenticated, fetchUser, hasStoredToken, router, shouldBeAuthenticated, redirectTo])
	if (isChecking) {
		return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
	}
	return <>{children}</>
}

