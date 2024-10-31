"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ClipboardIcon, CodeIcon, BracketsIcon, Github, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", icon: CodeIcon, label: "Base64 Converter" },
    { href: "/post-generator", icon: ClipboardIcon, label: "CR Post Generator" },
    { href: "/json-formatter", icon: BracketsIcon, label: "JSON Formatter" },
    { href: "/branching-guide", icon: Github, label: "Branching Guide" },
  ]

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-gray-100 p-4 dark:bg-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <CodeIcon className="h-6 w-6" />
              <span className="">Internal Tools</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                    pathname === item.href
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

