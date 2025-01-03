import { MultiSelect } from '@mantine/core'

interface PermissionSelectProps {
	label: string;
	data: string[];
	onChange: (value: string[]) => void;
	value: string[]; // Add this line
}

export default function PermissionSelect({ label, data, onChange, value }: PermissionSelectProps) {
	return (
		<MultiSelect
			label={label}
			data={data}
			onChange={onChange}
			value={value} // Add this line
			placeholder="Select permissions"
		/>
	)
}

