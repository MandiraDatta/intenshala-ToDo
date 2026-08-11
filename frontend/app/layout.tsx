import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pyramid - Login",
  description: "Let's get back on track. Login to your Pyramid account.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#fcfcfd] text-gray-900 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}