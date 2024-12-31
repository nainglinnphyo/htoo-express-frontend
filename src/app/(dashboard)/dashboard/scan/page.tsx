'use client'

import { Badge, Card, Group, Image, Paper, Stack, Text } from "@mantine/core"
import React, { useCallback, useEffect, useRef } from "react"
import BarcodeScannerComponent from "react-qr-barcode-scanner"

// interface ScanPageProps {
// 	updateScanText: (text: string) => Promise<void>
// 	scannedProduct: any
// }

function ScanPage({ updateScanText, scannedProduct }: any) {
	const [data, setData] = React.useState("Not Found")
	const canScanRef = useRef(true)
	const lastScannedRef = useRef("")
	const timeoutRef = useRef<NodeJS.Timeout>()

	const handleScan = useCallback(async (text: string) => {
		// Prevent duplicate scans within the cooldown period
		if (text === lastScannedRef.current) {
			return
		}

		// Update the last scanned value
		lastScannedRef.current = text
		setData(text)

		// Disable scanning temporarily
		canScanRef.current = false

		try {
			await updateScanText(text)
		} catch (error) {
			console.error('Error processing scan:', error)
		}

		// Clear existing timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		// Set new timeout to re-enable scanning
		timeoutRef.current = setTimeout(() => {
			canScanRef.current = true
			lastScannedRef.current = ""
		}, 1500) // Reduced to 2 seconds for better UX
	}, [updateScanText])

	// Cleanup timeouts on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	return (
		<div className="relative" style={{ display: 'flex', justifyContent: `${scannedProduct ? 'space-around' : ''}`, alignItems: "center", width: '100%' }}>
			<div>
				<BarcodeScannerComponent
					width={300}
					height={300}
					onUpdate={(err, result) => {
						if (result && canScanRef.current) {
							const text = result.getText()
							if (text) {
								handleScan(text)
							}
						} else if (!result) {
							setData("Not Found")
						}
					}}
				/>
				<div>{data === "Not Found" ? "Waiting for scan..." : `Last scanned: ${data}`}</div>
			</div>
			<div className="mt-2 text-sm text-gray-600">
				{scannedProduct ? (
					<Card shadow="sm" padding="lg" radius="md" withBorder className="mt-4">
						<Card.Section display={'flex'}>
							{scannedProduct.image.length > 0 ? (
								scannedProduct.image.map((d: any) => {
									return (
										<Image
											w={100}
											h={100}
											src={d}
											height={160}
											alt={d}
										/>
									)
								})
							) : ''}
						</Card.Section>

						<Group mt="md" mb="xs">
							<Text fw={500}>{scannedProduct.name}</Text>
							<Badge color="pink" variant="light">
								Ks {scannedProduct.price}
							</Badge>
						</Group>
						<Stack>
							<Text size="sm" c="dimmed">Code: {scannedProduct.code}</Text>
							<Text size="sm" c="dimmed">Category: {scannedProduct.category}</Text>
						</Stack>
					</Card>
				) : ''}
			</div>
		</div>
	)
}

export default ScanPage
