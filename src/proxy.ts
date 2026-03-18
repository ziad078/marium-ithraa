import createMiddleware from "next-intl/middleware"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

import { routing } from "./i18n/routing"
import { Pages, Routes, UserRole } from "@/lib/types/enums"

/* =========================
   🌍 i18n middleware
========================= */
const intlMiddleware = createMiddleware(routing)

/* =========================
   🧠 Helpers
========================= */
function getLocale(pathname: string) {
  const seg = pathname.split("/").filter(Boolean)[0]
  return routing.locales.includes(seg as any)
    ? seg
    : routing.defaultLocale
}

function stripLocale(pathname: string, locale: string) {
  const prefix = `/${locale}`
  if (pathname === prefix) return "/"
  if (pathname.startsWith(prefix + "/")) return pathname.slice(prefix.length)
  return pathname
}

function roleHome(locale: string, role?: UserRole) {
  const base = `/${locale}/${Routes.DASHBOARDS}`

  const map = {
    [UserRole.ADMIN]: Pages.AdMIN,
    [UserRole.ORGANIZATIONOWNER]: Pages.ORGANIZATION,
    [UserRole.EMPLOYEE]: Pages.EMPLOYEE,
    [UserRole.ENRICHER]: Pages.ENRICHER,
  }

  return `${base}/${map[role!] ?? Pages.EMPLOYEE}`
}

/* =========================
   🔐 Route Config
========================= */

// public routes (no auth)
const PUBLIC_ROUTES = [
  `/${Routes.AUTH}`,
]

// protected routes
const PROTECTED_ROUTES = [
  `/${Routes.DASHBOARDS}`,
]

// role permissions
const ACCESS_MAP: Record<string, UserRole[]> = {
  [Pages.ORGANIZATION]: [UserRole.ORGANIZATIONOWNER, UserRole.ADMIN],
  [Pages.EMPLOYEE]: [UserRole.EMPLOYEE, UserRole.ADMIN],
  [Pages.ENRICHER]: [UserRole.ENRICHER, UserRole.ADMIN],
}

/* =========================
   🚀 Middleware
========================= */
export default async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request)

  // important: handle next-intl redirects first
  if (intlResponse.headers.get("location")) return intlResponse

  const { pathname } = request.nextUrl
  const locale = getLocale(pathname)
  const cleanPath = stripLocale(pathname, locale)

  /* =========================
     🔑 Auth
  ========================= */
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = !!token

  /* =========================
     🧭 Route Detection
  ========================= */
  const isPublic = PUBLIC_ROUTES.some(route =>
    cleanPath.startsWith(route)
  )

  const isProtected = PROTECTED_ROUTES.some(route =>
    cleanPath.startsWith(route)
  )

  /* =========================
     🚫 Not logged in
  ========================= */
  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(
      new URL(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`, request.url)
    )
  }

  /* =========================
     🔁 Logged in → auth pages
  ========================= */
  if (isAuthenticated && isPublic) {
    return NextResponse.redirect(
      new URL(roleHome(locale, token?.role), request.url)
    )
  }

  /* =========================
     🔐 Authorization (roles)
  ========================= */
  if (isAuthenticated && isProtected) {
    const parts = cleanPath.split("/").filter(Boolean)

    // /dashboards/:section
    const section = parts[1]

    if (!section) return intlResponse

    const allowedRoles = ACCESS_MAP[section]

    if (allowedRoles && !allowedRoles.includes(token?.role)) {
      return NextResponse.redirect(
        new URL(roleHome(locale, token?.role), request.url)
      )
    }
  }

  return intlResponse
}

/* =========================
   ⚙️ Matcher
========================= */
export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)",
  ],
}