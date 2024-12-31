import { Card, Text, Group, Badge, Stack } from '@mantine/core';

interface ScannedProductProps {
	product: any;
}

export function ScannedProductCard({ product }: ScannedProductProps) {
	if (!product) return null;

	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Stack>
				<Text fw={500} size="lg">
					{product.name || 'Unknown Product'}
				</Text>
				{product.barcode && (
					<Group>
						<Badge color="blue">Barcode</Badge>
						<Text size="sm">{product.barcode}</Text>
					</Group>
				)}
				{product.price && (
					<Group>
						<Badge color="green">Price</Badge>
						<Text size="sm">${product.price.toFixed(2)}</Text>
					</Group>
				)}
				{product.category && (
					<Group>
						<Badge color="yellow">Category</Badge>
						<Text size="sm">{product.category}</Text>
					</Group>
				)}
				{product.description && (
					<Text size="sm" c="dimmed">
						{product.description}
					</Text>
				)}
			</Stack>
		</Card>
	);
}

