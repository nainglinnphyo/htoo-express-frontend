import { Box, Image, Text, Stack } from '@mantine/core'

export function LogoAndAddress() {
	return (
		<Box className="logo-and-address" ta="center" mb="md" style={{ maxWidth: '300px', margin: '0 auto', alignItems: 'center' }}>
			<Image
				src="/static/images/Htoo.png"
				alt="Company Logo"
				width={80}
				height={80}
				fit="contain"
				mb="md"
			/>
			<Stack ta="center" w="100%">
				<Text fw={700}>Htoo Export Fashion</Text>
				<Text size="sm">NO(940) Thitsar Street, South Okkalapa</Text>
				<Text size="sm">Phone: (+959) 123456789</Text>
				<Text size="sm">Email: info@htooexport.com</Text>
			</Stack>
		</Box>
	)
}

