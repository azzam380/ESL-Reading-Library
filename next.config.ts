import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: false, // Disables SWC minification to bypass SWC WASM serialisation issues on Windows
};

export default nextConfig;
