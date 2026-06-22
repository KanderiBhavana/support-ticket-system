"use client"

import Link from "next/link"
import { Inbox } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import { PriorityBadge } from "@/components/priority-badge"
import { Avatar } from "@/components/ui/avatar"
import { timeAgo } from "@/lib/format"
import type { Ticket } from "@/lib/types"

export function TicketTable({
  tickets,
  basePath = "/tickets",
  showRequester = false,
}: {
  tickets: Ticket[]
  basePath?: string
  showRequester?: boolean
}) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Inbox className="size-6 text-muted-foreground" />
        </span>
        <div>
          <p className="font-medium">No tickets found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-3 font-semibold">Ticket</th>
            {showRequester && <th className="px-4 py-3 font-semibold">Requester</th>}
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Priority</th>
            <th className="px-4 py-3 font-semibold">Assignee</th>
            <th className="px-4 py-3 font-semibold">Updated</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} className="group border-b border-border last:border-0 hover:bg-muted/40">
              <td className="px-4 py-3">
                <Link href={`${basePath}/${t.id}`} className="block">
                  <p className="font-medium text-foreground group-hover:text-primary">{t.subject}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t.id} · {t.category}
                  </p>
                </Link>
              </td>
              {showRequester && (
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={t.requesterName} className="size-7 text-[10px]" />
                    <span className="whitespace-nowrap text-foreground">{t.requesterName}</span>
                  </div>
                </td>
              )}
              <td className="px-4 py-3">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={t.priority} />
              </td>
              <td className="px-4 py-3">
                {t.assigneeName ? (
                  <div className="flex items-center gap-2">
                    <Avatar name={t.assigneeName} className="size-7 text-[10px]" />
                    <span className="whitespace-nowrap text-foreground">{t.assigneeName}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Unassigned</span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{timeAgo(t.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
