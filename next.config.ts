import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
// Only enable on non-NixOS systems or when explicitly requested
if (process.env.ENABLE_CLOUDFLARE_DEV === "true" || (process.platform !== "linux" || !process.env.NIX_PATH)) {
  import("@opennextjs/cloudflare").then(({ initOpenNextCloudflareForDev }) => {
    initOpenNextCloudflareForDev();
  });
}
