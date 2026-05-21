import RequireRoles from "@/features/auth/components/RequireRoles"
import { UserRole } from "@/lib/types/enums"
import ChildTestsScreen from "@/components/pages/tests/ChildTestsScreen"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function TestsPage({ params }: Props) {
  const { locale } = await params
  const direction = locale === "ar" ? "rtl" : "ltr"

  return (
    <RequireRoles allowed={[UserRole.PARENT]} redirectTo="/unautharized">
      <ChildTestsScreen
        direction={direction}
        profileName="كريم محمد علي"
        gradeLabel="الرابع الإبتدائى"
        schoolLabel="مدرسة الإبداع"
        evaluationStatusLabel="تم التقييم"
        evaluationStatusColorHex="#2ccc00"
        tabs={[
          { id: "plan", label: "الخطة الإثرائية" },
          { id: "reports", label: "التقارير" },
          { id: "indicators", label: "المؤشرات" },
          { id: "tests", label: "الاختبارات", active: true },
        ]}
        descriptionTitle="الاختبارات"
        description="اطّلع على اختبارات طفلك وتابع نتائج تقييم ذكاءاته ومهاراته."
        childTests={[
          {
            id: "t1",
            title: "اختبار الصفات السلوكية للموهبة",
            datePrefixLabel: "تاريخ الإجراء:",
            dateValue: "10 مايو 2026",
            dateValueColorHex: "#7222e3",
            statusLabel: "لم يبدأ",
            statusColorHex: "#cc001b",
            actionLabel: "بدء الاختبار",
          },
          {
            id: "t2",
            title: "اختبار الصفات السلوكية للموهبة",
            datePrefixLabel: "تاريخ الإجراء:",
            dateValue: "10 مايو 2026",
            dateValueColorHex: "#7222e3",
            statusLabel: "لم يبدأ",
            statusColorHex: "#cc001b",
            actionLabel: "بدء الاختبار",
          },
          {
            id: "t3",
            title: "اختبار الذكاءات المتعددة",
            datePrefixLabel: "تاريخ الإجراء:",
            dateValue: "متاح الآن",
            dateValueColorHex: "#7222e3",
            statusLabel: "مكتمل",
            statusColorHex: "#2ccc00",
            actionLabel: "إعادة الاختبار",
          },
        ]}
      />
    </RequireRoles>
  )
}

