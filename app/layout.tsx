import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { EasterEggsProvider } from "@/components/easter-eggs/EasterEggsProvider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { defaultSeo, siteUrl } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

/*
 * SOFT and WONK are loaded alongside opsz because the Broadsheet design drives
 * all four axes from scroll position. Without them Fraunces falls back to a
 * static instance and the kinetic type has nothing to interpolate.
 */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultSeo.title,
  description: defaultSeo.description,
  keywords: [
    "full stack developer",
    "real-time systems",
    "web development",
    "Christian Furr",
  ],
  authors: [{ name: "Christian Furr", url: siteUrl }],
  creator: "Christian Furr",
  icons: {
    icon: "/icon",
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon", sizes: "152x152", type: "image/png" },
      { url: "/apple-icon", sizes: "167x167", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en",
    url: siteUrl,
    siteName: defaultSeo.siteName,
    title: defaultSeo.title,
    description: defaultSeo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSeo.title,
    description: defaultSeo.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personId = `${siteUrl}/#person`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: "Christian Furr",
        url: siteUrl,
        description: defaultSeo.description,
        jobTitle: "Full Stack Developer",
        sameAs: ["https://github.com/christianfurr"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: defaultSeo.siteName,
        description: defaultSeo.description,
        publisher: { "@id": personId },
      },
    ],
  };

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: "<!-- Try the Konami code or type snake. -->",
          }}
          className="hidden"
          aria-hidden
        />
        <ConvexAuthNextjsServerProvider>
          <ConvexClientProvider>
            <EasterEggsProvider>{children}</EasterEggsProvider>
          </ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
        <Analytics />
      </body>
    </html>
  );
}
