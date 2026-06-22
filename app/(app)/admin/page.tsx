"use client"

import Link from "next/link"
import { Ticket, AlertTriangle, Clock, CheckCircle2, ArrowRight, UserCheck } from "lucide-react"
import { useStore } from "@/lib/store"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { TicketTable } from "@/components/ticket-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { AGENTS } from "@/lib/mock-data"
import { PRIORITY_LABELS, type TicketPriority } from "@/lib/types"

export default function AdminDashboardPage() {
  const { tickets } = useStore()

  const open = tickets.filter((t) => t.status === "open").length
  const inProgress = tickets.filter((t) => t.status === "in_progress").length
  const resolved = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length
  const unassigned = tickets.filter((t) => !t.assigneeId).length

  const priorityBreakdown = (Object.keys(PRIORITY_LABELS) as TicketPriority[]).map((p) => ({
    priority: p,
    count: tickets.filter((t) => t.priority === p).length,
  }))
  const total = tickets.length || 1

  const priorityColors: Record<TicketPriority, string> = {
    low: "bg-slate-400",
    medium: "bg-sky-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  }

  const agentLoad = AGENTS.map((a) => ({
    agent: a,
    count: tickets.filter((t) => t.assigneeId === a.id && (t.status === "open" || t.status === "in_progress")).length,
  }))

  const recentUnassigned = tickets.filter((t) => !t.assigneeId).slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Admin Dashboard" description="Monitor team performance and ticket volume." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Tickets" value={open} icon={AlertTriangle} tone="blue" hint={`${unassigned} unassigned`} />
        <StatCard label="In Progress" value={inProgress} icon={Clock} tone="amber" />
        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Total Tickets" value={tickets.length} icon={Ticket} tone="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {priorityBreakdown.map(({ priority, count }) => (
              <div key={priority}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{PRIORITY_LABELS[priority]}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${priorityColors[priority]}`}
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="size-4 text-muted-foreground" />
              Agent Workload
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {agentLoad.map(({ agent, count }) => (
              <div key={agent.id} className="flex items-center gap-3">
                <Avatar name={agent.name} color={agent.avatarColor} />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-muted-foreground">{count} active</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(count * 25, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Unassigned Tickets</CardTitle>
          <Link
            href="/admin/tickets"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
            data-icon="inline-end"
          >
            Manage all
            <ArrowRight />
          </Link>
        </CardHeader>
        <CardContent className="px-0">
          <TicketTable tickets={recentUnassigned} basePath="/admin/tickets" showRequester />
        </CardContent>
      </Card>
    </div>
  )
}
