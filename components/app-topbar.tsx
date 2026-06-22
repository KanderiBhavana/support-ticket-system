"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Search, Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { useStore } from "@/lib/store"

export function AppTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter()
  const { user, setRole } = useStore()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search tickets…"
          className="h-9 w-full rounded-lg border border-border bg-muted/40 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center rounded-lg border border-border bg-muted/40 p-0.5 text-xs font-medium sm:flex">
          <button
            onClick={() => setRole("user")}
            className={`rounded-md px-2.5 py-1 transition-colors ${
              user.role === "user" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`rounded-md px-2.5 py-1 transition-colors ${
              user.role === "admin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Admin
          </button>
        </div>

        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
        </Button>

        <div className="flex items-center gap-2">
          <Avatar name={user.name} color={user.avatarColor} />
          <div className="hidden text-sm leading-tight md:block">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs capitalize text-muted-foreground">{user.role}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Log out"
          onClick={() => router.push("/login")}
        >
          <LogOut className="size-5" />
        </Button>
      </div>
    </header>
  )
}
