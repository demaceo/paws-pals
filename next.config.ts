import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "place.dog" },
      { protocol: "https", hostname: "images.dog.ceo" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "res.cloudinary.com" }, // Cloudinary CDN
    ],
  },
};

export default nextConfig;
