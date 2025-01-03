'use client'

import { useState } from 'react'
import {
	Anchor,
	Button,
	Card,
	Checkbox,
	Group,
	PasswordInput,
	TextInput,
	Text,
} from "@mantine/core"
import { useRouter } from "next/navigation"
import useAuthStore from "@/store/authStore"

export function LoginForm() {
	const router = useRouter()
	const { login, isLoading, fetchUser } = useAuthStore()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError('')
		try {
			await login({ email, password })
			await fetchUser();
			router.push("/dashboard")
		} catch (err) {
			console.log(err)
			setError('Invalid email or password')
		}
	}

	return (
		<Card withBorder shadow="md" p={30} mt={30} radius="md">
			<form onSubmit={handleSubmit}>
				<TextInput
					label="Email"
					placeholder="test@example.com"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					error={error ? ' ' : undefined}
				/>
				<PasswordInput
					label="Password"
					placeholder="Your password"
					required
					mt="md"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					error={error ? ' ' : undefined}
				/>
				{error && (
					<Text color="red" size="sm" mt="sm">
						{error}
					</Text>
				)}
				{/* <Group mt="md" justify="space-between">
					<Checkbox label="Remember me" />
					<Anchor component="button" type="button" size="sm" onClick={() => router.push("/forgot-password")}>
						Forgot Password?
					</Anchor>
				</Group> */}
				<Button fullWidth mt="xl" type="submit" loading={isLoading}>
					Sign In
				</Button>
			</form>
		</Card>
	)
}

