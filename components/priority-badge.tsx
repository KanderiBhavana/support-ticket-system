import { ChevronDown, ChevronUp, ChevronsUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { PRIORITY_LABELS, type TicketPriority } from "@/lib/types"

const styles: Record<TicketPriority, string> = {
  low: "bg-slate-100 text-slate-600 ring-slate-500/20",
  medium: "bg-sky-50 text-sky-700 ring-sky-600/20",
  high: "bg-orange-50 text-orange-700 ring-orange-600/20",
  critical: "bg-red-50 text-red-700 ring-red-600/20",
}

const icons: Record<TicketPriority, typeof Minus> = {
  low: ChevronDown,
  medium: Minus,
  high: ChevronUp,
  critical: ChevronsUp,
}

export function PriorityBadge({ priority, className }: { priority: TicketPriority; className?: string }) {
  const Icon = icons[priority]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[priority],
        className,
      )}
    >
      <Icon className="size-3" />
      {PRIORITY_LABELS[priority]}
    </span>
  )
}
