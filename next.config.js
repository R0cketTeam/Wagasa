/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = { nextConfig, images: { loader: "custom" } }

module.exports = {
  env: {
    BASE_SEPOLIA_PROVIDER: process.env.BASE_SEPOLIA_PROVIDER,
    WAGASA_CONTRACT: process.env.WAGASA_CONTRACT,
    THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID,
    URL_PATH: process.env.URL_PATH
  },
};

