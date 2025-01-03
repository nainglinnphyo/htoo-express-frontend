import { Checkbox } from '@mantine/core'

interface TablePermissionsProps {
	tableName: string;
	columns: string[];
	onChange: (value: string[]) => void;
	value: string[]; // Add this line
}

export default function TablePermissions({ tableName, columns, onChange, value }: TablePermissionsProps) {
	const handleChange = (column: string, checked: boolean) => {
		const newValue = checked
			? [...value, column]
			: value.filter(c => c !== column);
		onChange(newValue);
	};

	return (
		<div>
			{columns.map(column => (
				<Checkbox
					key={column}
					label={column}
					checked={value.includes(column)}
					onChange={(event) => handleChange(column, event.currentTarget.checked)}
				/>
			))}
		</div>
	)
}

