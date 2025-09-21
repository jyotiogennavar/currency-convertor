import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Currency Converter",
  description: "Currency Converter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>{children}</main>
        <footer className="mt-auto px-6 py-6 container mx-auto text-sm flex justify-between items-center">
          <p className="text-gray-500">
            Made by
            <Link
              href="https://jyotiogennavar.com"
              target="_blank"
              className="text-gray-500 underline hover:text-gray-300"
            >
              jyotiogennavar.com
            </Link>
          </p>
          <Link
            href="https://jyotiogennavar.com"
            className="text-gray-500 underline hover:text-gray-300"
          >
            Read how this was built
          </Link>
        </footer>
      </body>
    </html>
  );
}
