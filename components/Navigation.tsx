"use client"

import { usePathname, useRouter } from "next/navigation"
import { Dock, DockIcon } from "@/components/ui/dock"
import { ClipboardIcon, CodeIcon, BracketsIcon, Github, Settings, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const navItems = [
    { href: "/", icon: CodeIcon, label: "Base64" },
    { href: "/post-generator", icon: ClipboardIcon, label: "CR Post" },
    { href: "/json-formatter", icon: BracketsIcon, label: "JSON" },
    { href: "/branching-guide", icon: Github, label: "Git" },
  ]

  return (
    <Dock>
      {navItems.map((item) => (
        <DockIcon
          key={item.href}
          onClick={() => router.push(item.href)}
          active={pathname === item.href}
        >
          <div className="flex flex-col items-center gap-1.5">
            <item.icon className="h-6 w-6" />
            <span className="text-[10px] font-medium opacity-80">{item.label}</span>
          </div>
        </DockIcon>
      ))}
      <div className="mx-2 h-8 w-px bg-border/50" />
      <DockIcon
        onClick={() => router.push("/settings")}
        active={pathname === "/settings"}
      >
        <div className="flex flex-col items-center gap-1.5">
          <Settings className="h-6 w-6" />
          <span className="text-[10px] font-medium opacity-80">Settings</span>
        </div>
      </DockIcon>
      <DockIcon
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <div className="flex flex-col items-center gap-1.5">
          {theme === "dark" ? (
            <>
              <Sun className="h-6 w-6" />
              <span className="text-[10px] font-medium opacity-80">Light</span>
            </>
          ) : (
            <>
              <Moon className="h-6 w-6" />
              <span className="text-[10px] font-medium opacity-80">Dark</span>
            </>
          )}
        </div>
      </DockIcon>
    </Dock>
  )
}