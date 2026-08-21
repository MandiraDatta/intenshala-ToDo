import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pyramid - Task & Project Management",
  description: "Task management and Kanban board application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-[#FCFCFD] dark:bg-[#0A0A0A] text-neutral-900 dark:text-[#F5F5F5] antialiased min-h-screen flex flex-col transition-colors duration-200">
        <ThemeProvider>
          <UserProvider>
            <WorkspaceProvider>{children}</WorkspaceProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}