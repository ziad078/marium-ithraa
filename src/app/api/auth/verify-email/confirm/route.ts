import { getToken, encode } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? "ar"

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (token) {
    const isProduction = process.env.NODE_ENV === "production"
    const cookieName = isProduction
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token"

    const updated = { ...token, isEmailVerified: true }
    const encoded = await encode({
      token: updated,
      secret: process.env.NEXTAUTH_SECRET!,
      maxAge: 30 * 24 * 60 * 60,
    })

    const response = NextResponse.redirect(
      new URL(`/${locale}/auth/login`, request.url),
    )

    response.cookies.set(cookieName, encoded, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    })

    return response
  }

  return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url))
}
