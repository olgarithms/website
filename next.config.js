// @ts-check
/** @type {import('next').NextConfig} */

const { fetchSchedule } = require("./lib/schedule");
const live = require("./data/live.json");

const getScheduleDays = async () => {
  const schedule = await fetchSchedule();

  const potentialUnsortedDays = Array.from(new Set(Object.keys(schedule.days)));

  return potentialUnsortedDays.sort((a, b) => {
    const aDate = new Date(a);
    const bDate = new Date(b);

    return aDate.getTime() - bDate.getTime();
  });
};

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    const days = await getScheduleDays();

    const redirects = [
      {
        source: "/cfp",
        destination: "https://program.europython.eu/europython-2022/cfp",
        permanent: true,
      },
      {
        source: "/sponsor-information",
        destination: "/sponsor/information",
        permanent: true,
      },
      {
        source: "/live",
        destination: `/live/${live.rooms[0].slug}`,
        permanent: false,
      },
    ];

    if (days.length > 0) {
      redirects.push({
        source: "/schedule",
        destination: `/schedule/${days[0]}`,
        permanent: false,
      });
    }

    return redirects;
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
