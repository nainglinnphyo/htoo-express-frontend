import React from 'react';
import { Button, Group } from '@mantine/core';

const ButtonGroup = () => {
	return (
		<Group style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '8px' }}>
			<Button variant="subtle" color="dark" size="md" styles={(theme) => ({
				root: {
					borderRadius: '8px',
					fontWeight: 500,
					color: theme.colors.gray[7],
					backgroundColor: theme.white,
					':hover': {
						backgroundColor: theme.colors.gray[1],
					},
				},
			})}>
				Driver Cancel
			</Button>
			<Button variant="filled" size="md" styles={{
				root: {
					borderRadius: '8px',
					fontWeight: 600,
				},
			}}>
				User Cancel
			</Button>
		</Group >
	);
};

export default ButtonGroup;
