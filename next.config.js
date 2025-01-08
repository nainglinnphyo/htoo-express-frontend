module.exports = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		unoptimized: true,
		domains: ['https://6e70-103-25-240-98.ngrok-free.app', 'https://6e70-103-25-240-98.ngrok-free.app'], // List allowed domains
	},
	experimental: {
		optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
	},
};
