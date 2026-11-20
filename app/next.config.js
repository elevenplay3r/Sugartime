/** @type {import('next').NextConfig} */
const nextConfig = {
  // Send every page of the site to the Instagram profile.
  // permanent: false = a temporary (307) redirect, so it is easy to undo later.
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "https://www.instagram.com/sugartime.in?cnvx=MTdybmYyMjE5bm1k",
        permanent: false,
      },
    ];
  },
};
module.exports = nextConfig;
