"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#A3A3A3]">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-[#171717] dark:hover:text-[#F5F5F5] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="font-medium">Pyramid</span>
      </Link>

      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 text-[#A3A3A3] dark:text-[#737373]" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-[#171717] dark:hover:text-[#F5F5F5] transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-[#171717] dark:text-[#F5F5F5]">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
