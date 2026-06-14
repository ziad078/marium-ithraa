import { Link } from "@/i18n/navigation"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="text-sm underline underline-offset-4 hover:text-primary"
      >
        Go home
      </Link>
    </div>
  )
}
