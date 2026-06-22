"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { CURRENT_USER, MOCK_TICKETS } from "./mock-data"
import type { Ticket, TicketPriority, TicketStatus, User } from "./types"

interface NewTicketInput {
  subject: string
  description: string
  priority: TicketPriority
  category: string
}

interface StoreValue {
  user: User
  tickets: Ticket[]
  setRole: (role: User["role"]) => void
  createTicket: (input: NewTicketInput) => Ticket
  updateStatus: (id: string, status: TicketStatus) => void
  updatePriority: (id: string, priority: TicketPriority) => void
  assignTicket: (id: string, assigneeId: string | null, assigneeName: string | null) => void
  addComment: (id: string, body: string) => void
  getTicket: (id: string) => Ticket | undefined
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(CURRENT_USER)
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS)

  const value = useMemo<StoreValue>(() => {
    return {
      user,
      tickets,
      setRole: (role) => setUser((u) => ({ ...u, role })),
      createTicket: (input) => {
        const ticket: Ticket = {
          id: `TICK-${1043 + tickets.length}`,
          subject: input.subject,
          description: input.description,
          status: "open",
          priority: input.priority,
          category: input.category,
          requesterId: user.id,
          requesterName: user.name,
          assigneeId: null,
          assigneeName: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          comments: [],
        }
        setTickets((prev) => [ticket, ...prev])
        return ticket
      },
      updateStatus: (id, status) =>
        setTickets((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t)),
        ),
      updatePriority: (id, priority) =>
        setTickets((prev) =>
          prev.map((t) => (t.id === id ? { ...t, priority, updatedAt: new Date().toISOString() } : t)),
        ),
      assignTicket: (id, assigneeId, assigneeName) =>
        setTickets((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, assigneeId, assigneeName, updatedAt: new Date().toISOString() } : t,
          ),
        ),
      addComment: (id, body) =>
        setTickets((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  updatedAt: new Date().toISOString(),
                  comments: [
                    ...t.comments,
                    {
                      id: `c-${Date.now()}`,
                      authorId: user.id,
                      authorName: user.name,
                      body,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : t,
          ),
        ),
      getTicket: (id) => tickets.find((t) => t.id === id),
    }
  }, [user, tickets])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
