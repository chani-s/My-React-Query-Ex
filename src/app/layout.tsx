"use client";
import type { Metadata } from "next";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import "./globals.css";
import Link from "next/link";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Link href="/page1">Items</Link> || <Link href="/page2">Other page..</Link>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
