import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

{/* Make sure this works with the correct url */}
export const metadata: Metadata = {
  title: "Github Profile Widget",
  description: "Created by Greptile",
  openGraph: {
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/og`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <head>
        <Analytics />
        {/* Make sure this works with the correct url */}
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_APP_URL}/api/og`} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-black`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
