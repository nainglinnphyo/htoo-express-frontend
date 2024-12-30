"use client"

import { Button, Checkbox, Container, Divider, Grid, Paper, Select, Table, TextInput, Title, Text } from '@mantine/core'
import React from 'react'

function SaleVoucherPage() {
	return (
		<Container>
			<Grid>
				{/* Left Column: Products and Payment */}
				<Grid.Col span={12}>
					<Paper shadow="xs" p="md" mb="md">
						<Title order={4} mb="sm">
							Products
						</Title>
						<TextInput placeholder="Search products" mb="sm" />
						<Table>
							<thead>
								<tr>
									<th>Product</th>
									<th>Quantity</th>
									<th>Total</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>T-Shirts</td>
									<td>2</td>
									<td>$88.00</td>
								</tr>
								<tr>
									<td>Jackets</td>
									<td>2</td>
									<td>$88.00</td>
								</tr>
							</tbody>
						</Table>
						<Button mt="md" fullWidth>
							Add custom item
						</Button>
					</Paper>

					<Paper shadow="xs" p="md">
						<Title order={4} mb="sm">
							Payment
						</Title>
						<Text>Subtotal: $32.00</Text>
						<Text>Edit discount: -$4.00</Text>
						<Text>Edit shipping or delivery: Free Shipping</Text>
						<Text>Estimated tax: $3.20</Text>
						<Divider my="sm" />
						<Text>Total: $31.80</Text>
						<Checkbox mt="md" label="Payment due later" />
						<Button mt="md" fullWidth>
							Proceed to Payment
						</Button>
					</Paper>
				</Grid.Col>

				{/* Right Column: Customer Details */}
				<Grid.Col span={12} >
					<Paper shadow="xs" p="md" mb="md">
						<Title order={4} mb="sm">
							Customer Details
						</Title>
						<TextInput label="Name" placeholder="Robbi Darvis" mb="sm" disabled />
						<TextInput label="Email" placeholder="flowforge@gmail.com" mb="sm" disabled />
						<TextInput label="Phone" placeholder="085728472847" mb="sm" disabled />
						<TextInput label="Address" placeholder="1234 Elm Street, Springfield, Anytown" mb="sm" disabled />
						<Select
							label="Market"
							placeholder="Primary Market"
							data={['United States (USD $)', 'Europe (EUR €)', 'Asia (JPY ¥)']}
						/>
					</Paper>

					<Paper shadow="xs" p="md">
						<Title order={4} mb="sm">
							Notes & Tags
						</Title>
						<TextInput label="Notes" placeholder="Add any notes..." mb="sm" />
						<TextInput label="Tags" placeholder="Input Tags" mb="sm" />
						<Button fullWidth>Add Notes</Button>
					</Paper>
				</Grid.Col>
			</Grid>

			{/* Mobile View Buttons */}
			{/* <MediaQuery largerThan="md" styles={{ display: 'none' }}>
				<Group mt="md" position="center">
					<Button variant="outline">Discard</Button>
					<Button>Create Order</Button>
				</Group>
			</MediaQuery> */}
		</Container>
	)
}

export default SaleVoucherPage
