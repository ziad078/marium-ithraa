import createMiddleware from "next-intl/middleware"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

import { routing } from "./i18n/routing"
import { Pages, Routes, UserRole } from "@/lib/types/enums"

const intlMiddleware = createMiddleware(routing)

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
    [UserRole.ADMIN]: Pages.ADMIN,           // ✅ fixed typo: AdMIN → ADMIN
    [UserRole.ORGANIZATIONOWNER]: Pages.ORGANIZATION,
    [UserRole.EMPLOYEE]: Pages.EMPLOYEE,
    [UserRole.ENRICHER]: Pages.ENRICHER,
  }

  return `${base}/${map[role!] ?? Pages.EMPLOYEE}`
}

const PUBLIC_ROUTES = [`/${Routes.AUTH}`]
const PROTECTED_ROUTES = [`/${Routes.DASHBOARDS}`]

// ✅ Use string literals that match actual URL segments, not Pages enum values
//    (unless you've verified Pages.ORGANIZATION === "organization" etc.)
const ACCESS_MAP: Record<string, UserRole[]> = {
  [Pages.ORGANIZATION]: [UserRole.ORGANIZATIONOWNER, UserRole.ADMIN],
  [Pages.EMPLOYEE]:     [UserRole.EMPLOYEE, UserRole.ADMIN],
  [Pages.ENRICHER]:     [UserRole.ENRICHER, UserRole.ADMIN],
  [Pages.ADMIN]:        [UserRole.ADMIN],   // ✅ add admin page restriction
}

export default async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request)

  if (intlResponse.headers.get("location")) return intlResponse

  const { pathname } = request.nextUrl
  const locale = getLocale(pathname)
  const cleanPath = stripLocale(pathname, locale)

  // ✅ Bug 1 fixed: add cookieName so getToken works in App Router
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    // next-auth v4 default cookie name — adjust if you use a custom one
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  })

  const isAuthenticated = !!token

  const isPublic = PUBLIC_ROUTES.some(route => cleanPath.startsWith(route))
  const isProtected = PROTECTED_ROUTES.some(route => cleanPath.startsWith(route))

  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(
      new URL(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`, request.url)
    )
  }

  if (isAuthenticated && isPublic) {
    return NextResponse.redirect(
      new URL(roleHome(locale, token?.role), request.url)
    )
  }

  if (isAuthenticated && isProtected) {
    const parts = cleanPath.split("/").filter(Boolean)
    const section = parts[1] // e.g. "admin", "employee"

    if (!section) return intlResponse

    const allowedRoles = ACCESS_MAP[section]

    if (allowedRoles && !allowedRoles.includes(token?.role)) {
      return NextResponse.redirect(
        new URL(roleHome(locale, token?.role), request.url)
      )
    }
  }

  // ✅ Bug 3 fixed: return intlResponse (which carries next-intl headers)
  //    This is correct — intlMiddleware returns NextResponse.next() with
  //    locale headers set, so we should forward it.
  return intlResponse
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)" ],
}