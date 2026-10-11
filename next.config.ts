import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},
	reactStrictMode: true,
	productionBrowserSourceMaps: true,
	output: "export",
	basePath: "/pr",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
