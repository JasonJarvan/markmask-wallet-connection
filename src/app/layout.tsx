'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig } from 'wagmi'
import { config } from '../config'

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient()

/**
 * The RootLayout component is the root layout for the entire application.
 * It wraps the entire application with the necessary providers and contexts.
 *
 * @param {Object} props - The props object containing the children.
 * @param {React.ReactNode} props.children - The children components to be rendered.
 * @return {JSX.Element} The root layout component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={config}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
