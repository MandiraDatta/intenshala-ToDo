"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Check,
  X,
  AlertTriangle,
  User as UserIcon,
  Sun,
  Moon,
  Square,
  Palette,
  Plus,
  Building,
} from "lucide-react";
import Navbar from "@/components/navbar";
import { useUser } from "@/context/UserContext";
import { useTheme, COLOR_MODES, Theme, ColorMode } from "@/context/ThemeContext";
import { useWorkspace } from "@/context/WorkspaceContext";

type SettingsTab = "profile" | "theme" | "color";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const { user, updateUser } = useUser();
  const { theme, setTheme, colorMode, setColorMode } = useTheme();
  const { workspaces, activeWorkspace, setActiveWorkspace, createWorkspace } = useWorkspace();

  // Create Workspace Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  // Inline Editing States
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(user.email);

  const [fullNameInput, setFullNameInput] = useState(user.fullName);
  const [titleInput, setTitleInput] = useState(user.title);
  const [usernameInput, setUsernameInput] = useState(user.username);

  // Leave Workspace Modal State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // File Input Ref for Profile Picture
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateUser({ avatar: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save email edit
  const handleSaveEmail = () => {
    if (emailInput.trim()) {
      updateUser({ email: emailInput.trim() });
    }
    setIsEditingEmail(false);
  };

  // Handle input changes with auto-update
  const handleFullNameChange = (val: string) => {
    setFullNameInput(val);
    updateUser({ fullName: val });
  };

  const handleTitleChange = (val: string) => {
    setTitleInput(val);
    updateUser({ title: val });
  };

  const handleUsernameChange = (val: string) => {
    setUsernameInput(val);
    updateUser({ username: val });
  };

  const handleCreateWorkspaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    setIsCreatingWorkspace(true);
    try {
      const created = await createWorkspace(newWorkspaceName.trim());
      setActiveWorkspace(created);
      setNewWorkspaceName("");
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Failed to create workspace", err);
    } finally {
      setIsCreatingWorkspace(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0A0A0A] transition-colors duration-200">
      {/* Dedicated Settings Sidebar */}
      <aside
        className={`transition-all duration-300 ease-in-out relative z-40 shrink-0 border-r border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#111111] flex flex-col ${
          isSidebarOpen ? "w-[13.5rem] sm:w-[15rem]" : "w-0 overflow-hidden"
        }`}
      >
        <div className="p-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
          {/* Back to App Link */}
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.2]" />
            <span className="font-medium">Back to app</span>
          </button>
        </div>

        {/* Sidebar Menu Items */}
        <div className="p-2.5 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-[#737373] dark:text-[#A3A3A3] px-2.5 py-1">
            Account Settings
          </span>

          {/* Profile Button */}
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === "profile"
                ? "bg-[#EAEAEA] dark:bg-[#262626] text-[#171717] dark:text-[#F5F5F5] font-semibold"
                : "hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-[#737373] dark:text-[#A3A3A3]"
            }`}
          >
            <UserIcon className="w-4 h-4 shrink-0" />
            <span>Profile</span>
          </button>

          {/* Theme Button */}
          <button
            type="button"
            onClick={() => setActiveTab("theme")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === "theme"
                ? "bg-[#EAEAEA] dark:bg-[#262626] text-[#171717] dark:text-[#F5F5F5] font-semibold"
                : "hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-[#737373] dark:text-[#A3A3A3]"
            }`}
          >
            <Sun className="w-4 h-4 shrink-0" />
            <span>Theme</span>
          </button>

          {/* Color Button */}
          <button
            type="button"
            onClick={() => setActiveTab("color")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === "color"
                ? "bg-[#EAEAEA] dark:bg-[#262626] text-[#171717] dark:text-[#F5F5F5] font-semibold"
                : "hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-[#737373] dark:text-[#A3A3A3]"
            }`}
          >
            <Palette className="w-4 h-4 shrink-0" />
            <span>Color</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-col flex-1 min-w-0 bg-white dark:bg-[#0A0A0A] transition-colors duration-200 relative z-0">
        <Navbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Scrollable Main Settings Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
          <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
            {/* 1. PROFILE TAB */}
            {activeTab === "profile" && (
              <>
                {/* Profile Header */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] shrink-0 flex items-center justify-center">
                    <Image
                      src={user.avatar || "/Pasted image.png"}
                      alt="Profile Avatar"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                  <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[#171717] dark:text-[#F5F5F5]">
                    Profile
                  </h1>
                </div>

                {/* Profile Information Card */}
                <div className="bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl overflow-hidden shadow-2xs flex flex-col">
                  {/* Profile Picture Row */}
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F0F0F0] dark:border-[#262626]">
                    <span className="text-xs sm:text-sm font-medium text-[#171717] dark:text-[#F5F5F5]">
                      Profile picture
                    </span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-9 h-9 rounded-full overflow-hidden border border-[#E5E5E5] dark:border-[#333333] focus:outline-none hover:opacity-80 transition-opacity cursor-pointer group relative"
                        title="Change profile picture"
                      >
                        <Image
                          src={user.avatar || "/Pasted image.png"}
                          alt="User Avatar"
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Pencil className="w-3.5 h-3.5 text-white" />
                        </div>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Email Row */}
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F0F0F0] dark:border-[#262626]">
                    <span className="text-xs sm:text-sm font-medium text-[#171717] dark:text-[#F5F5F5]">
                      Email
                    </span>
                    <div className="flex items-center gap-2">
                      {isEditingEmail ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="h-7 px-2 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] rounded text-xs text-[#171717] dark:text-[#F5F5F5] outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleSaveEmail}
                            className="p-1 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-emerald-600 rounded"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEmailInput(user.email);
                              setIsEditingEmail(false);
                            }}
                            className="p-1 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] text-neutral-500 rounded"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-xs text-[#525252] dark:text-[#A3A3A3] font-normal">
                            {user.email || "user@gmail.com"}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEmailInput(user.email);
                              setIsEditingEmail(true);
                            }}
                            className="p-1 text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer rounded"
                            title="Edit Email"
                          >
                            <Pencil className="w-3.5 h-3.5 stroke-[2]" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Full Name Row */}
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F0F0F0] dark:border-[#262626]">
                    <span className="text-xs sm:text-sm font-medium text-[#171717] dark:text-[#F5F5F5]">
                      Full name
                    </span>
                    <input
                      type="text"
                      value={fullNameInput}
                      onChange={(e) => handleFullNameChange(e.target.value)}
                      placeholder="Full name"
                      className="h-7 sm:h-8 w-28 sm:w-36 px-2.5 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] rounded-md text-xs font-normal text-[#171717] dark:text-[#F5F5F5] outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors"
                    />
                  </div>

                  {/* Title Row */}
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F0F0F0] dark:border-[#262626]">
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-medium text-[#171717] dark:text-[#F5F5F5]">
                        Title
                      </span>
                      <span className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                        Your job title or role
                      </span>
                    </div>
                    <input
                      type="text"
                      value={titleInput}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Job title"
                      className="h-7 sm:h-8 w-28 sm:w-36 px-2.5 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] rounded-md text-xs font-normal text-[#171717] dark:text-[#F5F5F5] outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors"
                    />
                  </div>

                  {/* Username Row */}
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <div className="flex flex-col pr-2">
                      <span className="text-xs sm:text-sm font-medium text-[#171717] dark:text-[#F5F5F5]">
                        Username
                      </span>
                      <span className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                        One word, like a nickname or first name
                      </span>
                    </div>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      placeholder="Username"
                      className="h-7 sm:h-8 w-28 sm:w-36 px-2.5 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] rounded-md text-xs font-normal text-[#171717] dark:text-[#F5F5F5] outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors shrink-0"
                    />
                  </div>
                </div>

                  {/* Workspace Access Section */}
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xs sm:text-sm font-semibold text-[#171717] dark:text-[#F5F5F5]">
                        Workspace access
                      </h2>
                      <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-1.5 h-7 px-2.5 bg-[#171717] dark:bg-[#F5F5F5] hover:bg-[#333333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-md text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Create Workspace</span>
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {workspaces.length === 0 ? (
                        <div className="bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-4 text-xs text-[#737373] dark:text-[#A3A3A3]">
                          No active workspaces found.
                        </div>
                      ) : (
                        workspaces.map((ws) => {
                          const isActive = activeWorkspace?.id === ws.id;
                          return (
                            <div
                              key={ws.id}
                              className="bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-4 flex items-center justify-between shadow-2xs"
                            >
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs sm:text-sm font-semibold text-[#171717] dark:text-[#F5F5F5]">
                                    {ws.name}
                                  </span>
                                  {isActive && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
                                      Active Org
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                                  Role: {ws.isOwner ? "Owner" : ws.role || "Member"} • {ws.memberCount || 1} member(s)
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {!isActive && (
                                  <button
                                    type="button"
                                    onClick={() => setActiveWorkspace(ws)}
                                    className="h-7.5 px-3 bg-[#F5F5F5] dark:bg-[#262626] hover:bg-[#EAEAEA] dark:hover:bg-[#333333] text-[#171717] dark:text-[#F5F5F5] border border-[#E5E5E5] dark:border-[#333333] rounded-md text-xs font-medium transition-colors cursor-pointer shrink-0"
                                  >
                                    Switch to Org
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!isActive) {
                                      setActiveWorkspace(ws);
                                    }
                                    setIsLeaveModalOpen(true);
                                  }}
                                  className="h-7.5 px-3 bg-[#FEF2F2] dark:bg-[#450A0A]/40 hover:bg-[#FEE2E2] dark:hover:bg-[#450A0A]/60 text-[#DC2626] dark:text-rose-400 border border-[#FCA5A5]/30 dark:border-rose-900/40 rounded-md text-xs font-medium transition-colors cursor-pointer shrink-0"
                                >
                                  Leave Workspace
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
              </>
            )}

            {/* 2. THEME TAB */}
            {activeTab === "theme" && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5 text-[#171717] dark:text-[#F5F5F5]" />
                  <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[#171717] dark:text-[#F5F5F5]">
                    Theme Settings
                  </h1>
                </div>

                <div className="bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl overflow-hidden p-2 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                      theme === "light"
                        ? "bg-[#F5F5F5] dark:bg-[#262626] text-[#171717] dark:text-[#F5F5F5]"
                        : "hover:bg-[#FAFAFA] dark:hover:bg-[#262626] text-[#737373] dark:text-[#A3A3A3]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sun className="w-4 h-4 text-[#171717] dark:text-[#F5F5F5]" />
                      <span>Light Theme</span>
                    </div>
                    {theme === "light" && <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                      theme === "dark"
                        ? "bg-[#F5F5F5] dark:bg-[#262626] text-[#171717] dark:text-[#F5F5F5]"
                        : "hover:bg-[#FAFAFA] dark:hover:bg-[#262626] text-[#737373] dark:text-[#A3A3A3]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Moon className="w-4 h-4 text-[#171717] dark:text-[#F5F5F5]" />
                      <span>Dark Theme</span>
                    </div>
                    {theme === "dark" && <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />}
                  </button>
                </div>
              </div>
            )}

            {/* 3. COLOR TAB */}
            {activeTab === "color" && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-[#171717] dark:text-[#F5F5F5]" />
                  <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[#171717] dark:text-[#F5F5F5]">
                    Color Mode
                  </h1>
                </div>

                <div className="bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl overflow-hidden p-2 flex flex-col gap-1">
                  {COLOR_MODES.map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setColorMode(mode.value as ColorMode)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                        colorMode === mode.value
                          ? "bg-[#F5F5F5] dark:bg-[#262626] text-[#171717] dark:text-[#F5F5F5]"
                          : "hover:bg-[#FAFAFA] dark:hover:bg-[#262626] text-[#737373] dark:text-[#A3A3A3]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: mode.hex }}
                        />
                        <span>{mode.name}</span>
                      </div>
                      {colorMode === mode.value && (
                        <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Dialog Modal for Leaving Workspace */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl shadow-2xl p-5 flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#171717] dark:text-[#F5F5F5]">
                  Leave workspace?
                </h3>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                  Are you sure you want to leave this workspace?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0F0F0] dark:border-[#262626]">
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(false)}
                className="h-8 px-3 rounded-md text-xs font-medium text-[#171717] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors cursor-pointer border border-[#E5E5E5] dark:border-[#2A2A2A]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLeaveModalOpen(false);
                  router.push("/dashboard");
                }}
                className="h-8 px-3 rounded-md text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-2xs"
              >
                Leave Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Modal for Creating Workspace */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <form
            onSubmit={handleCreateWorkspaceSubmit}
            className="w-full max-w-sm bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl shadow-2xl p-5 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center shrink-0">
                <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#171717] dark:text-[#F5F5F5]">
                  Create New Workspace
                </h3>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                  Enter a name for your new organization/workspace.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#171717] dark:text-[#F5F5F5]">
                Workspace Name
              </label>
              <input
                type="text"
                required
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="e.g. Acme Corp, Engineering, Marketing"
                className="h-8 px-3 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] rounded-md text-xs text-[#171717] dark:text-[#F5F5F5] outline-none focus:border-blue-500 transition-colors"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0F0F0] dark:border-[#262626]">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewWorkspaceName("");
                }}
                className="h-8 px-3 rounded-md text-xs font-medium text-[#171717] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors cursor-pointer border border-[#E5E5E5] dark:border-[#2A2A2A]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingWorkspace || !newWorkspaceName.trim()}
                className="h-8 px-3 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                {isCreatingWorkspace ? "Creating..." : "Create Workspace"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
