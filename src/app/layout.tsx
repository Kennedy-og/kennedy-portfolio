import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Kennedy | Data Analytics Portfolio",
  description:
    "Professional portfolio for data analytics, dashboard design, and business insight work.",
  keywords: ["data analytics", "portfolio", "dashboard", "business intelligence", "insights"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kennedy | Data Analytics Portfolio",
    description:
      "Professional portfolio for data analytics, dashboard design, and business insight work.",
    siteName: "Kennedy Portfolio",
    type: "website",
    url: "/",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kennedy | Data Analytics Portfolio",
    description:
      "Professional portfolio for data analytics, dashboard design, and business insight work.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-stone-100 text-neutral-900 dark:bg-neutral-950 dark:text-white"
      >
        {children}
      </body>
    </html>
  );
}
