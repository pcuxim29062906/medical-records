import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@mui/material', '@emotion/react', '@emotion/styled'],
};

module.exports = {
  allowedDevOrigins: ['192.168.0.109'],
}

export default nextConfig;