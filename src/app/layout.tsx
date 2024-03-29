import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Minnie Book",
  description: "Expense management made easy",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["expense", "management", "minnie", "book"],
  authors: [{ name: "Abhishek V" }],

  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "icons/icon-128x128.png" },
  ],
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#1d232a" }],
  userScalable: false,
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="sunset">
      <body suppressHydrationWarning={true} className={inter.className}>
        <Toaster
          position="top-center"
          toastOptions={{
            className: "bg-gray-800 text-white",
          }}
        />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
