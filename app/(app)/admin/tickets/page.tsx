"use client"

import { useMemo, useState } from "react"
import { useStore } from "@/lib/store"
import { PageHeader } from "@/components/page-header"
import { TicketTable } from "@/components/ticket-table"
import { TicketFilters, applyFilters, type Filters } from "@/components/ticket-filters"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { STATUS_LABELS, type TicketStatus } from "@/lib/types"

type Tab = TicketStatus | "all"

const TABS: { value: Tab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: STATUS_LABELS.open },
  { value: "in_progress", label: STATUS_LABELS.in_progress },
  { value: "resolved", label: STATUS_LABELS.resolved },
  { value: "closed", label: STATUS_LABELS.closed },
]

export default function ManageTicketsPage() {
  const { tickets } = useStore()
  const [filters, setFilters] = useState<Filters>({ query: "", status: "all", priority: "all" })
  const [tab, setTab] = useState<Tab>("all")

  const filtered = useMemo(() => {
    const byTab = tab === "all" ? tickets : tickets.filter((t) => t.status === tab)
    const ids = new Set(applyFilters(byTab, filters).map((t) => t.id))
    return byTab.filter((t) => ids.has(t.id))
  }, [tickets, filters, tab])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage Tickets"
        description="Triage, assign, and resolve incoming support requests."
      />

      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
        {TABS.map((t) => {
          const count = t.value === "all" ? tickets.length : tickets.filter((x) => x.status === t.value).length
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                tab === t.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  tab === t.value ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <TicketFilters filters={filters} onChange={setFilters} />

      <Card className="overflow-hidden">
        <TicketTable tickets={filtered} basePath="/admin/tickets" showRequester />
      </Card>
    </div>
  )
}
