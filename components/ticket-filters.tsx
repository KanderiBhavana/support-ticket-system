"use client"

import { Search } from "lucide-react"
import { Select } from "@/components/ui/select"
import { STATUS_LABELS, PRIORITY_LABELS, type TicketPriority, type TicketStatus } from "@/lib/types"

export interface Filters {
  query: string
  status: TicketStatus | "all"
  priority: TicketPriority | "all"
}

export function TicketFilters({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (next: Filters) => void
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Search by subject or ID…"
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        />
      </div>
      <Select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value as Filters["status"] })}
        className="sm:w-40"
      >
        <option value="all">All statuses</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      <Select
        value={filters.priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value as Filters["priority"] })}
        className="sm:w-40"
      >
        <option value="all">All priorities</option>
        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  )
}

export function applyFilters(tickets: { subject: string; id: string; status: TicketStatus; priority: TicketPriority }[], filters: Filters) {
  return tickets.filter((t) => {
    const q = filters.query.trim().toLowerCase()
    const matchesQuery =
      !q || t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    const matchesStatus = filters.status === "all" || t.status === filters.status
    const matchesPriority = filters.priority === "all" || t.priority === filters.priority
    return matchesQuery && matchesStatus && matchesPriority
  })
}
