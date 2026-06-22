import { LifeBuoy, CheckCircle2 } from "lucide-react"

const highlights = [
  "Track every request from open to resolved",
  "Prioritize critical issues with smart routing",
  "Collaborate with your team in one shared inbox",
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>

      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2 text-white">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <LifeBuoy className="size-5 text-primary-foreground" />
          </span>
          <span className="text-lg font-semibold">Helpdesk</span>
        </div>

        <div className="max-w-md">
          <h2 className="text-pretty text-3xl font-semibold leading-tight text-white">
            The support workspace your customers deserve.
          </h2>
          <p className="mt-4 leading-relaxed text-sidebar-foreground">
            Manage tickets, track resolution times, and keep your whole team aligned — all from one
            professional dashboard.
          </p>
          <ul className="mt-8 flex flex-col gap-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-sidebar-foreground">
                <CheckCircle2 className="size-5 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-sidebar-foreground/70">
          Trusted by 4,000+ support teams worldwide.
        </p>
      </div>
    </div>
  )
}
