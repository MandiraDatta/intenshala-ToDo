"use client";

import { useRef, useEffect } from "react";
import { Check } from "lucide-react";
import { VisibleFields } from "./types";

interface FieldsMenuProps {
  visibleFields: VisibleFields;
  onToggleField: (field: keyof VisibleFields) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FieldsMenu({
  visibleFields,
  onToggleField,
  isOpen,
  onClose,
}: FieldsMenuProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const fieldsList: { key: keyof VisibleFields; label: string }[] = [
    { key: "project", label: "Project Name" },
    { key: "priority", label: "Priority" },
    { key: "members", label: "Lead" },
    { key: "dueDate", label: "Due Date" },
    { key: "status", label: "Status" },
    { key: "teams", label: "Teams" },
    { key: "labels", label: "Labels" },
    { key: "reporter", label: "Reporter" },
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-1 w-[16rem] bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl shadow-xl z-50 p-3 flex flex-col gap-2 select-none animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="text-xs font-semibold text-[#171717] dark:text-[#F5F5F5] pb-1 border-b border-[#F0F0F0] dark:border-[#262626]">
        Visible Fields
      </div>
      <div className="flex flex-col gap-0.5">
        {fieldsList.map(({ key, label }) => {
          const isChecked = visibleFields[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggleField(key)}
              className="flex h-8 items-center justify-between px-2.5 py-1.5 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded-lg text-xs font-medium text-[#171717] dark:text-[#F5F5F5] transition-colors cursor-pointer w-full text-left"
            >
              <span className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">
                {label}
              </span>
              <div
                className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                  isChecked
                    ? "bg-[#171717] dark:bg-[#F5F5F5] text-white dark:text-black"
                    : "border border-[#D4D4D4] dark:border-[#2A2A2A] bg-white dark:bg-[#111111]"
                }`}
              >
                {isChecked && <Check size={10} strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
