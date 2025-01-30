"use client"

import { useState } from "react"
import {
	Grid,
	Paper,
	Title,
	Text,
	useMantineTheme,
	Group,
	Stack,
	Select,
	SimpleGrid,
	Card,
	Badge,
	ActionIcon,
	Menu,
	Button,
} from "@mantine/core"
import {
	Line,
	Bar,
	PieChart,
	Pie,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Radar,
	ScatterChart,
	Scatter,
	ComposedChart,
	RadialBarChart,
	RadialBar,
} from "recharts"
import {
	ArrowUpRight,
	ArrowDownRight,
	DotIcon as DotsVertical,
	Download,
	RefreshCwIcon as Refresh,
	ChevronDown,
	Filter,
} from "lucide-react"

// Sample data
const salesData = [
	{ date: "2023-01", total: 4000, inStore: 2400, online: 1600, target: 4500 },
	{ date: "2023-02", total: 3000, inStore: 1398, online: 1602, target: 4500 },
	{ date: "2023-03", total: 5000, inStore: 3800, online: 1200, target: 4500 },
	{ date: "2023-04", total: 4500, inStore: 3908, online: 592, target: 4500 },
	{ date: "2023-05", total: 6000, inStore: 4800, online: 1200, target: 4500 },
	{ date: "2023-06", total: 5500, inStore: 3800, online: 1700, target: 4500 },
	{ date: "2023-07", total: 7000, inStore: 4300, online: 2700, target: 4500 },
]

const inventoryData = [
	{ name: "In Stock", value: 400, color: "blue" },
	{ name: "Low Stock", value: 300, color: "yellow" },
	{ name: "Out of Stock", value: 100, color: "red" },
	{ name: "On Order", value: 200, color: "green" },
]

const performanceData = [
	{ subject: "Sales", A: 120, B: 110, fullMark: 150 },
	{ subject: "Inventory", A: 98, B: 130, fullMark: 150 },
	{ subject: "Customer", A: 86, B: 130, fullMark: 150 },
	{ subject: "Revenue", A: 99, B: 100, fullMark: 150 },
	{ subject: "Growth", A: 85, B: 90, fullMark: 150 },
]

const categoryPerformance = [
	{ name: "Electronics", value: 400, fill: "#8884d8" },
	{ name: "Clothing", value: 300, fill: "#83a6ed" },
	{ name: "Food", value: 300, fill: "#8dd1e1" },
	{ name: "Books", value: 200, fill: "#82ca9d" },
	{ name: "Home", value: 278, fill: "#a4de6c" },
]

const hourlyTraffic = Array.from({ length: 24 }, (_, i) => ({
	hour: `${String(i).padStart(2, "0")}:00`,
	traffic: Math.floor(Math.random() * 1000) + 100,
	sales: Math.floor(Math.random() * 500) + 50,
}))

export function EnhancedPOSDashboard() {
	const theme = useMantineTheme()
	// const [dateRange, setDateRange] = useState<DateRangePickerValue>([null, null])
	const [selectedLocation, setSelectedLocation] = useState<string | null>("all")

	const locations = [
		{ value: "all", label: "All Locations" },
		{ value: "store1", label: "Store 1" },
		{ value: "store2", label: "Store 2" },
		{ value: "online", label: "Online Store" },
	]

	return (
		<Stack spacing="md" p="md">
			{/* Header Section */}
			<Group position="apart" align="flex-end">
				<div>
					<Title order={2}>POS Dashboard</Title>
					<Text color="dimmed" size="sm">
						Comprehensive overview of your business metrics
					</Text>
				</div>
				<Group>
					<Select
						label="Location"
						placeholder="Select location"
						data={locations}
						value={selectedLocation}
						onChange={setSelectedLocation}
						icon={<Filter size={14} />}
					/>

					<Menu shadow="md" width={200}>
						<Menu.Target>
							<ActionIcon variant="light" size="lg">
								<DotsVertical size={16} />
							</ActionIcon>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item icon={<Download size={14} />}>Export Data</Menu.Item>
							<Menu.Item icon={<Refresh size={14} />}>Refresh</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</Group>
			</Group>

			{/* KPI Cards */}
			<SimpleGrid cols={4} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
				<Card withBorder p="md">
					<Group position="apart">
						<Text size="xs" transform="uppercase" weight={700} color="dimmed">
							Total Revenue
						</Text>
						<Badge color="green" variant="light">
							<Group spacing={4}>
								<ArrowUpRight size={14} />
								<Text>12%</Text>
							</Group>
						</Badge>
					</Group>
					<Group align="flex-end" spacing="xs" mt={12}>
						<Text size="xl" weight={700}>
							$48,700
						</Text>
						<Text size="sm" color="dimmed" mb={1}>
							USD
						</Text>
					</Group>
					<Text size="xs" color="dimmed" mt={8}>
						Compared to $43,500 last month
					</Text>
				</Card>

				<Card withBorder p="md">
					<Group position="apart">
						<Text size="xs" transform="uppercase" weight={700} color="dimmed">
							Total Orders
						</Text>
						<Badge color="green" variant="light">
							<Group spacing={4}>
								<ArrowUpRight size={14} />
								<Text>8%</Text>
							</Group>
						</Badge>
					</Group>
					<Group align="flex-end" spacing="xs" mt={12}>
						<Text size="xl" weight={700}>
							1,567
						</Text>
						<Text size="sm" color="dimmed" mb={1}>
							orders
						</Text>
					</Group>
					<Text size="xs" color="dimmed" mt={8}>
						Compared to 1,450 last month
					</Text>
				</Card>

				<Card withBorder p="md">
					<Group position="apart">
						<Text size="xs" transform="uppercase" weight={700} color="dimmed">
							Average Order Value
						</Text>
						<Badge color="red" variant="light">
							<Group spacing={4}>
								<ArrowDownRight size={14} />
								<Text>3%</Text>
							</Group>
						</Badge>
					</Group>
					<Group align="flex-end" spacing="xs" mt={12}>
						<Text size="xl" weight={700}>
							$31.07
						</Text>
						<Text size="sm" color="dimmed" mb={1}>
							per order
						</Text>
					</Group>
					<Text size="xs" color="dimmed" mt={8}>
						Compared to $32.03 last month
					</Text>
				</Card>

				<Card withBorder p="md">
					<Group position="apart">
						<Text size="xs" transform="uppercase" weight={700} color="dimmed">
							Customer Retention
						</Text>
						<Badge color="green" variant="light">
							<Group spacing={4}>
								<ArrowUpRight size={14} />
								<Text>5%</Text>
							</Group>
						</Badge>
					</Group>
					<Group align="flex-end" spacing="xs" mt={12}>
						<Text size="xl" weight={700}>
							68%
						</Text>
						<Text size="sm" color="dimmed" mb={1}>
							retention
						</Text>
					</Group>
					<Text size="xs" color="dimmed" mt={8}>
						Compared to 63% last month
					</Text>
				</Card>
			</SimpleGrid>

			{/* Charts Grid */}
			<Grid gutter="md">
				{/* Sales Overview */}
				<Grid.Col span={8}>
					<Paper p="md" radius="md" withBorder>
						<Group position="apart" mb="md">
							<div>
								<Title order={3}>Sales Overview</Title>
								<Text size="sm" color="dimmed">
									Monthly sales performance
								</Text>
							</div>
							<Button variant="light" rightIcon={<ChevronDown size={14} />}>
								This Month
							</Button>
						</Group>
						<ResponsiveContainer width="100%" height={300}>
							<ComposedChart data={salesData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Area type="monotone" dataKey="total" fill={theme.colors.blue[1]} stroke={theme.colors.blue[6]} />
								<Line type="monotone" dataKey="target" stroke={theme.colors.red[6]} strokeDasharray="5 5" />
								<Bar dataKey="online" fill={theme.colors.green[6]} />
								<Bar dataKey="inStore" fill={theme.colors.violet[6]} />
							</ComposedChart>
						</ResponsiveContainer>
					</Paper>
				</Grid.Col>

				{/* Performance Radar */}
				<Grid.Col span={4}>
					<Paper p="md" radius="md" withBorder>
						<Title order={3} mb="md">
							Performance Metrics
						</Title>
						<ResponsiveContainer width="100%" height={300}>
							<RadarChart data={performanceData}>
								<PolarGrid />
								<PolarAngleAxis dataKey="subject" />
								<PolarRadiusAxis angle={30} domain={[0, 150]} />
								<Radar
									name="Target"
									dataKey="A"
									stroke={theme.colors.blue[6]}
									fill={theme.colors.blue[6]}
									fillOpacity={0.6}
								/>
								<Radar
									name="Actual"
									dataKey="B"
									stroke={theme.colors.green[6]}
									fill={theme.colors.green[6]}
									fillOpacity={0.6}
								/>
								<Legend />
							</RadarChart>
						</ResponsiveContainer>
					</Paper>
				</Grid.Col>

				{/* Hourly Traffic */}
				<Grid.Col span={6}>
					<Paper p="md" radius="md" withBorder>
						<Title order={3} mb="md">
							Hourly Traffic & Sales
						</Title>
						<ResponsiveContainer width="100%" height={300}>
							<ComposedChart data={hourlyTraffic}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="hour" />
								<YAxis yAxisId="left" />
								<YAxis yAxisId="right" orientation="right" />
								<Tooltip />
								<Legend />
								<Area
									yAxisId="left"
									type="monotone"
									dataKey="traffic"
									fill={theme.colors.grape[1]}
									stroke={theme.colors.grape[6]}
								/>
								<Line yAxisId="right" type="monotone" dataKey="sales" stroke={theme.colors.orange[6]} />
							</ComposedChart>
						</ResponsiveContainer>
					</Paper>
				</Grid.Col>

				{/* Category Performance */}
				<Grid.Col span={6}>
					<Paper p="md" radius="md" withBorder>
						<Title order={3} mb="md">
							Category Performance
						</Title>
						<ResponsiveContainer width="100%" height={300}>
							<RadialBarChart innerRadius="10%" outerRadius="80%" data={categoryPerformance}>
								<RadialBar
									minAngle={15}
									label={{ fill: "#666", position: "insideStart" }}
									background
									clockWise={true}
									dataKey="value"
								/>
								<Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
								<Tooltip />
							</RadialBarChart>
						</ResponsiveContainer>
					</Paper>
				</Grid.Col>

				{/* Inventory Status */}
				<Grid.Col span={4}>
					<Paper p="md" radius="md" withBorder>
						<Title order={3} mb="md">
							Inventory Status
						</Title>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={inventoryData}
									cx="50%"
									cy="50%"
									labelLine={false}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
									label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
								>
									{inventoryData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={theme.colors[entry.color][6]} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</Paper>
				</Grid.Col>

				{/* Sales Scatter Plot */}
				<Grid.Col span={8}>
					<Paper p="md" radius="md" withBorder>
						<Title order={3} mb="md">
							Sales Distribution
						</Title>
						<ResponsiveContainer width="100%" height={300}>
							<ScatterChart>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis type="number" dataKey="total" name="Total Sales" />
								<YAxis type="number" dataKey="online" name="Online Sales" />
								<Tooltip cursor={{ strokeDasharray: "3 3" }} />
								<Scatter name="Sales Distribution" data={salesData} fill={theme.colors.blue[6]} />
							</ScatterChart>
						</ResponsiveContainer>
					</Paper>
				</Grid.Col>
			</Grid>
		</Stack>
	)
}

