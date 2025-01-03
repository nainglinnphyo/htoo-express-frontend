'use client'

import { Checkbox, Stack, Text } from '@mantine/core'
import { useState } from 'react'

interface TablePermissionsProps {
	tableName: string
	columns: string[]
	onChange: (value: string[]) => void
}

export default function TablePermissions({ tableName, columns, onChange }: TablePermissionsProps) {
	const [selectedColumns, setSelectedColumns] = useState<string[]>([])

	const handleChange = (column: string, checked: boolean) => {
		const updatedColumns = checked
			? [...selectedColumns, column]
			: selectedColumns.filter(c => c !== column)
		setSelectedColumns(updatedColumns)
		onChange(updatedColumns)
	}

	return (
		<Stack>
			<Text>{tableName} Columns</Text>
			{columns.map(column => (
				<Checkbox
					key={column}
					label={column}
					checked={selectedColumns.includes(column)}
					onChange={(event) => handleChange(column, event.currentTarget.checked)}
				/>
			))}
		</Stack>
	)
}


