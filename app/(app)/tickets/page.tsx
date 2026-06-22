"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { useStore } from "@/lib/store"
import { PageHeader } from "@/components/page-header"
import { TicketTable } from "@/components/ticket-table"
import { TicketFilters, applyFilters, type Filters } from "@/components/ticket-filters"
import { Card } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"

export default function MyTicketsPage() {
  const { user, tickets } = useStore()
  const [filters, setFilters] = useState<Filters>({ query: "", status: "all", priority: "all" })

  const mine = useMemo(() => tickets.filter((t) => t.requesterId === user.id), [tickets, user.id])
  const filtered = useMemo(() => {
    const ids = new Set(applyFilters(mine, filters).map((t) => t.id))
    return mine.filter((t) => ids.has(t.id))
  }, [mine, filters])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Tickets"
        description={`${mine.length} total requests submitted by you.`}
        action={
          <Link href="/tickets/new" className={buttonVariants({ size: "lg" })} data-icon="inline-start">
            <PlusCircle />
            New Ticket
          </Link>
        }
      />

      <TicketFilters filters={filters} onChange={setFilters} />

      <Card className="overflow-hidden">
        <TicketTable tickets={filtered} />
      </Card>
    </div>
  )
}
