"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  ShieldCheck,
  Inbox,
  LifeBuoy,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"

interface NavItem {
  href: string
  label: string
  icon: typeof Ticket
}

const userNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tickets", label: "My Tickets", icon: Ticket },
  { href: "/tickets/new", label: "Create Ticket", icon: PlusCircle },
]

const adminNav: NavItem[] = [
  { href: "/admin", label: "Admin Dashboard", icon: ShieldCheck },
  { href: "/admin/tickets", label: "Manage Tickets", icon: Inbox },
]

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { user } = useStore()

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center justify-between px-5">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onNavigate}>
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <LifeBuoy className="size-5 text-primary-foreground" />
          </span>
          <span className="text-base font-semibold text-white">Helpdesk</span>
        </Link>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <NavSection title="Workspace" items={userNav} pathname={pathname} onNavigate={onNavigate} />
        {user.role === "admin" && (
          <NavSection
            title="Administration"
            items={adminNav}
            pathname={pathname}
            onNavigate={onNavigate}
            className="mt-6"
          />
        )}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <p className="text-xs font-medium text-white">Need help getting started?</p>
          <p className="mt-1 text-xs text-sidebar-foreground/80">
            Browse our knowledge base for quick answers.
          </p>
        </div>
      </div>
    </div>
  )
}

function NavSection({
  title,
  items,
  pathname,
  onNavigate,
  className,
}: {
  title: string
  items: NavItem[]
  pathname: string
  onNavigate?: () => void
  className?: string
}) {
  return (
    <div className={className}>
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
        {title}
      </p>
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const active =
            item.href === "/tickets"
              ? pathname === "/tickets"
              : pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
