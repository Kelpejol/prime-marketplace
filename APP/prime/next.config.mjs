/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
        port: "",
        pathname: '/ipfs/**',
      },
    ],
  },
  // fixes wallet connect dependency issue https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration
  webpack: (config) => {
    // Add your existing external dependencies
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Modify webpack configuration to handle SVGs using @svgr/webpack
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true, // Adjust options if necessary
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
