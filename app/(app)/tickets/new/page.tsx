"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import { PriorityBadge } from "@/components/priority-badge"
import {
  CATEGORIES,
  PRIORITY_LABELS,
  type TicketPriority,
} from "@/lib/types"

export default function NewTicketPage() {
  const router = useRouter()

  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<string>(CATEGORIES[0])
  const [priority, setPriority] = useState<TicketPriority>("medium")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setSubmitting(true)

      await api.post("/tickets", {
        title: subject,
        description,
        category,
        priority,
      })

      router.push("/tickets")
    } catch (error) {
      console.error("Error creating ticket:", error)
      alert("Failed to create ticket")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/tickets"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
          data-icon="inline-start"
        >
          <ArrowLeft />
          Back to tickets
        </Link>
      </div>

      <PageHeader
        title="Create a Ticket"
        description="Describe your issue and we'll get back to you."
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your issue"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  id="priority"
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as TicketPriority)
                  }
                >
                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide as much detail as possible, including steps to reproduce..."
                className="min-h-40"
                required
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">
                Selected priority
              </span>
              <PriorityBadge priority={priority} />
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link
                href="/tickets"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                })}
              >
                Cancel
              </Link>

              <Button
                type="submit"
                size="lg"
                disabled={submitting || !subject || !description}
              >
                {submitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}