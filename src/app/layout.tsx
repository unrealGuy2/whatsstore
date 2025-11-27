import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.scss";

// Initialize the Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhatsStore - WhatsApp Store Builder",
  description: "Create your mini e-commerce store and receive orders on WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}