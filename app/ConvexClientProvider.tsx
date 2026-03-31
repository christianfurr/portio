"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

let convex: ConvexReactClient | null = null;

function getConvexClient(): ConvexReactClient | null {
  if (convex) return convex;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  convex = new ConvexReactClient(url);
  return convex;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = getConvexClient();
  if (!client) return <>{children}</>;
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
