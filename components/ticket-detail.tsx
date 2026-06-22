"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Send, MessageSquare } from "lucide-react"
import { useStore } from "@/lib/store"
import { StatusBadge } from "@/components/status-badge"
import { PriorityBadge } from "@/components/priority-badge"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { formatDate, timeAgo } from "@/lib/format"
import { AGENTS } from "@/lib/mock-data"
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/types"

export function TicketDetail({ ticketId, backHref }: { ticketId: string; backHref: string }) {
  const { getTicket, user, addComment, updateStatus, updatePriority, assignTicket } = useStore()
  const ticket = getTicket(ticketId)
  const [comment, setComment] = useState("")

  if (!ticket) return notFound()

  const isAdmin = user.role === "admin"

  function submitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim()) return
    addComment(ticket.id, comment.trim())
    setComment("")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">{ticket.id}</span>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{ticket.subject}</h1>
        <p className="text-sm text-muted-foreground">
          Opened by {ticket.requesterName} · {timeAgo(ticket.createdAt)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground">{ticket.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="size-4 text-muted-foreground" />
                Conversation ({ticket.comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {ticket.comments.length === 0 && (
                <p className="text-sm text-muted-foreground">No replies yet. Start the conversation below.</p>
              )}
              {ticket.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar name={c.authorName} className="mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{c.authorName}</span>
                      <span className="text-xs text-muted-foreground">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-foreground">{c.body}</p>
                  </div>
                </div>
              ))}

              <form onSubmit={submitComment} className="flex flex-col gap-3 border-t border-border pt-5">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a reply…"
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={!comment.trim()} data-icon="inline-start">
                    <Send />
                    Send reply
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm">
              <DetailRow label="Requester">
                <div className="flex items-center gap-2">
                  <Avatar name={ticket.requesterName} className="size-6 text-[10px]" />
                  {ticket.requesterName}
                </div>
              </DetailRow>
              <DetailRow label="Assignee">
                {ticket.assigneeName ? (
                  <div className="flex items-center gap-2">
                    <Avatar name={ticket.assigneeName} className="size-6 text-[10px]" />
                    {ticket.assigneeName}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </DetailRow>
              <DetailRow label="Category">{ticket.category}</DetailRow>
              <DetailRow label="Created">{formatDate(ticket.createdAt)}</DetailRow>
              <DetailRow label="Last updated">{formatDate(ticket.updatedAt)}</DetailRow>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Agent Controls</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    value={ticket.status}
                    onChange={(e) => updateStatus(ticket.id, e.target.value as TicketStatus)}
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    id="priority"
                    value={ticket.priority}
                    onChange={(e) => updatePriority(ticket.id, e.target.value as TicketPriority)}
                  >
                    {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select
                    id="assignee"
                    value={ticket.assigneeId ?? ""}
                    onChange={(e) => {
                      const agent = AGENTS.find((a) => a.id === e.target.value)
                      assignTicket(ticket.id, agent?.id ?? null, agent?.name ?? null)
                    }}
                  >
                    <option value="">Unassigned</option>
                    {AGENTS.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{children}</span>
    </div>
  )
}
