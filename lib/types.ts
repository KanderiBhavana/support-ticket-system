export type TicketStatus = "open" | "in_progress" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high" | "critical"
export type UserRole = "user" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatarColor: string
}

export interface TicketComment {
  id: string
  authorId: string
  authorName: string
  body: string
  createdAt: string
  internal?: boolean
}

export interface Ticket {
  id: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: string
  requesterId: string
  requesterName: string
  assigneeId: string | null
  assigneeName: string | null
  createdAt: string
  updatedAt: string
  comments: TicketComment[]
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
}

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
}

export const CATEGORIES = [
  "Billing",
  "Technical",
  "Account",
  "Feature Request",
  "Bug Report",
  "General",
] as const
