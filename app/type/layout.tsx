import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typing test | Christian Furr",
  description:
    "Type the quote and see your WPM and accuracy. A quick typing test.",
};

export default function TypeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
