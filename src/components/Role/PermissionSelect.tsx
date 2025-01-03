import { MultiSelect, Text } from '@mantine/core'

interface PermissionSelectProps {
	label: string
	data: string[]
	onChange: (value: string[]) => void
}

export default function PermissionSelect({ label, data, onChange }: PermissionSelectProps) {
	return (
		<MultiSelect
			label={<Text>{label}</Text>}
			data={data.map(item => ({ value: item, label: item }))}
			placeholder="Select permissions"
			searchable
			clearable
			onChange={onChange}
			style={(theme) => ({
				item: {
					'&[data-selected]': {
						'&, &:hover': {
							backgroundColor: theme.colors.blue[2],
							color: theme.colors.blue[9],
						},
					},
				},
			})}
		/>
	)
}

