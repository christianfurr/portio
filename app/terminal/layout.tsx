import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminal | Christian Furr",
  description:
    "Interactive terminal-style page — run whoami, projects, contact, and more.",
};

export default function TerminalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
