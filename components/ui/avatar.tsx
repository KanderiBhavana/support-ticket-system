import { cn } from "@/lib/utils"
import { initials } from "@/lib/format"

interface AvatarProps {
  name: string
  color?: string
  className?: string
}

export function Avatar({ name, color, className }: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      aria-hidden="true"
      style={color ? { backgroundColor: color } : undefined}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
        !color && "bg-primary",
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
