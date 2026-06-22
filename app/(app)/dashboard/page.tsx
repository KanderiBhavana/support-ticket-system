"use client"

import Link from "next/link"
import { Ticket, Clock, CheckCircle2, AlertTriangle, PlusCircle, ArrowRight } from "lucide-react"
import { useStore } from "@/lib/store"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { TicketTable } from "@/components/ticket-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { STATUS_LABELS, type TicketStatus } from "@/lib/types"

export default function DashboardPage() {
  const { user, tickets } = useStore()
  const mine = tickets.filter((t) => t.requesterId === user.id)

  const open = mine.filter((t) => t.status === "open").length
  const inProgress = mine.filter((t) => t.status === "in_progress").length
  const resolved = mine.filter((t) => t.status === "resolved" || t.status === "closed").length

  const statusBreakdown = (Object.keys(STATUS_LABELS) as TicketStatus[]).map((s) => ({
    status: s,
    count: mine.filter((t) => t.status === s).length,
  }))
  const total = mine.length || 1

  const barColors: Record<TicketStatus, string> = {
    open: "bg-blue-500",
    in_progress: "bg-amber-500",
    resolved: "bg-emerald-500",
    closed: "bg-slate-400",
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Here's an overview of your support requests."
        action={
          <Link href="/tickets/new" className={buttonVariants({ size: "lg" })} data-icon="inline-start">
            <PlusCircle />
            New Ticket
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Tickets" value={mine.length} icon={Ticket} tone="primary" />
        <StatCard label="Open" value={open} icon={AlertTriangle} tone="blue" />
        <StatCard label="In Progress" value={inProgress} icon={Clock} tone="amber" />
        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} tone="emerald" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Tickets</CardTitle>
            <Link
              href="/tickets"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
              data-icon="inline-end"
            >
              View all
              <ArrowRight />
            </Link>
          </CardHeader>
          <CardContent className="px-0">
            <TicketTable tickets={mine.slice(0, 5)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {statusBreakdown.map(({ status, count }) => (
              <div key={status}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{STATUS_LABELS[status]}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${barColors[status]}`}
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
