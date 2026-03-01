const defaultSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://christianfurr.dev";

export const siteUrl = defaultSiteUrl;

export const defaultSeo = {
  title: "Christian Furr — Full Stack Developer",
  description:
    "I build real-time systems and beautifully crafted web experiences.",
  siteName: "Christian Furr",
} as const;
