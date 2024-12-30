'use client'

import React, { useCallback, useEffect, useRef } from "react"
import BarcodeScannerComponent from "react-qr-barcode-scanner"

interface ScanPageProps {
	updateScanText: (text: string) => Promise<void>
}

export default function ScanPage({ updateScanText }: ScanPageProps) {
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
		}, 2000) // Reduced to 2 seconds for better UX
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
		<div className="relative">
			<BarcodeScannerComponent
				width={200}
				height={200}
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
			<div className="mt-2 text-sm text-gray-600">
				{data === "Not Found" ? "Waiting for scan..." : `Last scanned: ${data}`}
			</div>
		</div>
	)
}
