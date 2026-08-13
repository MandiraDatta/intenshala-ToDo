"use client";
import Image from "next/image";
import {useState} from "react";
import { ChevronDownIcon, ChevronsUpDown, LayoutDashboard ,GalleryVerticalEnd} from "lucide-react";

export default function Sidebar()
{
const [isOpen,setIsOpen]=useState(true);

  return (
    <aside
      className="
        w-[10rem]
        sm:w-[12rem]
        md:w-[14rem]
        lg:w-[16rem]
        min-h-screen
        shrink-0
        border-r border-neutral-200
        bg-[#FAFAFA]
        flex flex-col
      "
    >
      {/* Header */}
      <div className="w-full h-[4rem] border-b border-neutral-200 flex items-center p-2">
        <div className="w-full flex items-center gap-2 p-[0.3rem] min-w-0 hover:bg-[#F5F5F5] transition-colors">

          {/* Avatar */}
          <div className="w-8 h-8 shrink-0  bg-[#FFFFFF] rounded-2xl">
            <Image src="/Pasted image.png" alt="Avatar" width={32} height={32} className="rounded-2xl" />
          </div>

          {/* Name */}
          <div className="min-w-0 flex-1 font-sans font-bold text-sm leading-none truncate">
            Dexter
          </div>

          {/* Profile dropdown */}
          <div className="w-4 h-4 shrink-0">
            <ChevronsUpDown className="w-4 h-4" />
          </div>

        </div>
      </div>

      {/* Sidebar Content */}
      <div className="w-full flex flex-col p-2">

        {/* Workspace Selector */}
        <div className="w-full h-8 flex items-center px-3">
          
          {/* Workspace text */}
          <div className="flex-1 min-w-0 font-sans font-medium text-sm  truncate">
            Workspace
          </div>

          {/* Dropdown icon */}
          
          <button  onClick={() => setIsOpen(!isOpen)} className="w-4 h-4 shrink-0 flex items-center justify-center">
            <ChevronDownIcon className={`w-4 h-4 treansition-transform duration-300  ${isOpen ? 'rotate-0':"-rotate-180"}`} />
          </button>

        </div>

        {/* Navigation */}
        {
          isOpen && 
        <div className="w-full h-[4.5rem] flex flex-col gap-1">

          {/* Tasks */}
          <div className="w-full h-9 gap-3 pt-2 pb-2 pl-3 pr-3  rounded-xl hover:bg-[#F5F5F5] transition-colors flex items-center">
           <div className="relative w-4 h-4">
             <LayoutDashboard className="w-4 h-4 top-0 left-0 absolute shrink-0" />
           </div> 
            <div className="flex-1 min-w-0">
              <span className="font-sans font-medium text-sm  truncate">Tasks</span>
            </div>
          </div>

          {/* Projects */}
          <div className="w-full h-9 gap-3 pt-2 pb-2 pl-3 pr-3  rounded-xl hover:bg-[#F5F5F5] transition-colors flex items-center">
           <div className="relative w-4 h-4">
             <GalleryVerticalEnd className="w-4 h-4 top-0 left-0 absolute shrink-0" />
           </div> 
            <div className="flex-1 min-w-0">
              <span className="font-sans font-medium text-sm  truncate">Projects</span>
            </div>
          </div>

        </div>
}

      </div>
    </aside>
  );
}