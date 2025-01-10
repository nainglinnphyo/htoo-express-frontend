import { Box, Image, Text, Stack } from '@mantine/core'

export function LogoAndAddress() {
	return (
		<Box className="logo-and-address" ta="center" mb="md" style={{ maxWidth: '300px', margin: '0 auto', alignItems: 'center' }}>
			{/* <Image
				src="/static/images/Htoo.png"
				alt="Company Logo"
				width={70}
				height={70}
				fit="contain"
				mb="sm"
			/> */}
			<Stack ta="center" w="100%">
				<Text fw={900} size="md">Htoo Export Fashion</Text>
				<Text fw={900} size="sm">NO(940) Thitsar Street, South Okkalapa</Text>
				<Text fw={900} size="sm">Phone: (+959) 123456789</Text>
				<Text fw={900} size="sm">Email: info@htooexport.com</Text>
			</Stack>
		</Box>
	)
}

