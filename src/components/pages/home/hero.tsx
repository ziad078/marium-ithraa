"use client"

import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Pages, Routes } from "@/lib/types/enums"
import { cn } from "@/lib/utils"

const Hero = () => {
  const locale = useLocale()
  const t = useTranslations("HomePage.Hero")
  const isRtl = locale === "ar"

  const baseAuth = `/${Routes.AUTH}`

  const cards = [
    {
      key: "Beneficiary",
      href: `${baseAuth}/${Pages.BENEFICIARYSIGNUP}`,
      tone: "bg-secondary hover:bg-secondary/60",
    },
  ] as const

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 380px at 85% 35%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 60%), radial-gradient(780px 320px at 15% 65%, color-mix(in oklab, var(--chart-4) 18%, transparent), transparent 62%)",
        }}
      />

      <div className="app-container relative pt-40 pb-14 lg:pt-40 lg:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 text-start lg:order-1">

            <h1 className="text-3xl font-extrabold leading-tight text-primary sm:text-4xl lg:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("subtitle")}
            </p>

            <div className="mt-10">
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                {t("cardsTitle")}
              </h2>

              <div className="mt-5 grid gap-3">
                {cards.map((c) => (
                  <Button
                    key={c.key}
                    asChild
                    className={cn(
                      "h-auto w-full justify-between rounded-2xl border border-border/50 bg-secondary/40 px-5 py-4 shadow-sm transition-colors",
                      c.tone
                    )}
                  >
                    <Link href={c.href} className={cn("gap-4")}>
                      <span className="min-w-0 text-start">
                        <span className="block text-sm font-semibold text-foreground sm:text-base">
                          {t(`cards.${c.key}.label`)}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {t(`cards.${c.key}.description`)}
                        </span>
                      </span>

                      <span className="shrink-0 text-primary">
                        {isRtl ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
                      </span>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <Image
                src="/hero.svg"
                alt={t("heroImageAlt")}
                width={760}
                height={620}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero