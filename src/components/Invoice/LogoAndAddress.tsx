import { Box, Image, Text, Stack } from '@mantine/core'

export function LogoAndAddress() {
	return (
		<Box className="logo-and-address print-only" ta="center" mb="md" style={{ maxWidth: '300px', margin: '0 auto', alignItems: 'center' }}>
			<Image
				src="/htoo.png"
				alt="Company Logo"
				width={80}
				height={80}
				fit="contain"
				mb="md"
			/>
			<Stack ta="center" w="100%">
				<Text fw={700}>Htoo Export Fashion</Text>
				<Text size="sm">123 Business Street, Suite 100</Text>
				<Text size="sm">Cityville, State 12345</Text>
				<Text size="sm">Phone: (555) 123-4567</Text>
				<Text size="sm">Email: info@yourcompany.com</Text>
			</Stack>
		</Box>
	)
}

