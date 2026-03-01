import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { EasterEggsProvider } from "@/components/easter-eggs/EasterEggsProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Christian Furr — Full Stack Developer",
  description:
    "I build real-time systems and beautifully crafted web experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div
          dangerouslySetInnerHTML={{
            __html: "<!-- Try the Konami code or type snake. -->",
          }}
          className="hidden"
          aria-hidden
        />
        <EasterEggsProvider>{children}</EasterEggsProvider>
      </body>
    </html>
  );
}
