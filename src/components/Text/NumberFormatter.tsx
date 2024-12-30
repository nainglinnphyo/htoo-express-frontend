import { Text, TextProps } from '@mantine/core';
import { formatNumber } from './FormatNumber';

interface FormattedNumberProps extends Omit<TextProps, 'children'> {
	value: number;
}

export function FormattedNumber({ value, ...props }: FormattedNumberProps) {
	return (
		<Text {...props}>
			{formatNumber(value)}
		</Text>
	);
}

