import type { ResultsData } from "@/components/pages/dashboards/organization/ResultsScreen"

type MockTeacher = { id: string; name: string; className: string; email: string }
type MockClass = { id: string; name: string; level: string; studentsCount: number }
type MockChild = {
  id: string
  name: string
  className: string
  evaluationStatus: string
  evaluationStatusClassName: string
  imageSrc: string
}

export function getTeachersMock(locale: string): MockTeacher[] {
  const isAr = locale === "ar"
  if (!isAr) {
    return [
      { id: "t1", name: "Mohamed Ali", className: "KG A", email: "mohamed@school.com" },
      { id: "t2", name: "Sara Ahmed", className: "KG B", email: "sara@school.com" },
      { id: "t3", name: "Noura Ibrahim", className: "KG C", email: "noura@school.com" },
    ]
  }
  return [
    { id: "t1", name: "محمد علي", className: "الروضة أ", email: "mohamed@school.com" },
    { id: "t2", name: "سارة أحمد", className: "الروضة ب", email: "sara@school.com" },
    { id: "t3", name: "نورة إبراهيم", className: "الروضة ج", email: "noura@school.com" },
  ]
}

export function getClassesMock(locale: string): MockClass[] {
  const isAr = locale === "ar"
  if (!isAr) {
    return [
      { id: "c1", name: "KG A", level: "Kindergarten", studentsCount: 24 },
      { id: "c2", name: "KG B", level: "Kindergarten", studentsCount: 22 },
      { id: "c3", name: "Grade 1", level: "Primary", studentsCount: 28 },
    ]
  }
  return [
    { id: "c1", name: "الروضة أ", level: "الروضة", studentsCount: 24 },
    { id: "c2", name: "الروضة ب", level: "الروضة", studentsCount: 22 },
    { id: "c3", name: "الأول الابتدائي", level: "الابتدائي", studentsCount: 28 },
  ]
}

export function getChildrenMock(locale: string): MockChild[] {
  const isAr = locale === "ar"
  if (!isAr) {
    return [
      {
        id: "ch1",
        name: "Kareem Mohamed Ali",
        className: "KG A",
        evaluationStatus: "Not assessed",
        evaluationStatusClassName: "text-amber-500",
        imageSrc: "/avatar-placeholder.svg",
      },
      {
        id: "ch2",
        name: "Laila Mohamed Ibrahim",
        className: "KG A",
        evaluationStatus: "Assessed",
        evaluationStatusClassName: "text-emerald-600",
        imageSrc: "/avatar-placeholder.svg",
      },
      {
        id: "ch3",
        name: "Sara Ahmed Ali",
        className: "KG B",
        evaluationStatus: "Not assessed",
        evaluationStatusClassName: "text-violet-600",
        imageSrc: "/avatar-placeholder.svg",
      },
      {
        id: "ch4",
        name: "Kareem Mohamed Ali",
        className: "KG A",
        evaluationStatus: "Assessed",
        evaluationStatusClassName: "text-emerald-600",
        imageSrc: "/avatar-placeholder.svg",
      },
    ]
  }

  return [
    {
      id: "ch1",
      name: "كريم محمد علي",
      className: "الروضة أ",
      evaluationStatus: "لم يقيم",
      evaluationStatusClassName: "text-amber-500",
      imageSrc: "/avatar-placeholder.svg",
    },
    {
      id: "ch2",
      name: "ليلى محمد ابراهيم",
      className: "الروضة أ",
      evaluationStatus: "تم التقييم",
      evaluationStatusClassName: "text-emerald-600",
      imageSrc: "/avatar-placeholder.svg",
    },
    {
      id: "ch3",
      name: "ساره أحمد علي",
      className: "الروضة ب",
      evaluationStatus: "لم يبدأ بعد",
      evaluationStatusClassName: "text-violet-600",
      imageSrc: "/avatar-placeholder.svg",
    },
    {
      id: "ch4",
      name: "كريم محمد علي",
      className: "الروضة أ",
      evaluationStatus: "تم التقييم",
      evaluationStatusClassName: "text-emerald-600",
      imageSrc: "/avatar-placeholder.svg",
    },
  ]
}

export function getResultsMock(locale: string): ResultsData {
  const isAr = locale === "ar"

  return {
    classOptions: [
      { id: "kg-a", label: isAr ? "الفصل (الروضة أ)" : "Class (KG A)" },
      { id: "kg-b", label: isAr ? "الفصل (الروضة ب)" : "Class (KG B)" },
    ],
    classMetrics: [
      { id: "m1", title: isAr ? "أقل نتيجة" : "Lowest", value: "70%", variant: "purple" },
      { id: "m2", title: isAr ? "متوسط الفصل" : "Average", value: "85%", variant: "indigo" },
      { id: "m3", title: isAr ? "أعلى نتيجة" : "Highest", value: "95%", variant: "pink" },
    ],
    topIntelligences: [
      { id: "i1", title: isAr ? "الذكاء الحركي" : "Kinesthetic", value: "80%", variant: "purple" },
      { id: "i2", title: isAr ? "الذكاء المنطقي" : "Logical", value: "85%", variant: "indigo" },
      { id: "i3", title: isAr ? "الذكاء اللغوي" : "Linguistic", value: "90%", variant: "pink" },
    ],
    childResults: [
      {
        id: "r1",
        name: isAr ? "كريم محمد علي" : "Kareem Mohamed Ali",
        className: isAr ? "الروضة أ" : "KG A",
        value: isAr ? "الذكاء اللغوي" : "Linguistic",
      },
      {
        id: "r2",
        name: isAr ? "ليلى محمد ابراهيم" : "Laila Mohamed Ibrahim",
        className: isAr ? "الروضة أ" : "KG A",
        value: isAr ? "الذكاء الحركي" : "Kinesthetic",
      },
      {
        id: "r3",
        name: isAr ? "ساره أحمد علي" : "Sara Ahmed Ali",
        className: isAr ? "الروضة ب" : "KG B",
        value: isAr ? "الذكاء الحركي" : "Kinesthetic",
      },
      {
        id: "r4",
        name: isAr ? "كريم محمد علي" : "Kareem Mohamed Ali",
        className: isAr ? "الروضة أ" : "KG A",
        value: isAr ? "الذكاء المنطقي" : "Logical",
      },
      {
        id: "r5",
        name: isAr ? "محمد حمد علي" : "Mohamed Hamad Ali",
        className: isAr ? "الروضة أ" : "KG A",
        value: isAr ? "الذكاء المنطقي" : "Logical",
      },
      {
        id: "r6",
        name: isAr ? "ليلى محمد ابراهيم" : "Laila Mohamed Ibrahim",
        className: isAr ? "الروضة أ" : "KG A",
        value: isAr ? "الذكاء المنطقي" : "Logical",
      },
      {
        id: "r7",
        name: isAr ? "ساره أحمد علي" : "Sara Ahmed Ali",
        className: isAr ? "الروضة ب" : "KG B",
        value: isAr ? "الذكاء الحركي" : "Kinesthetic",
      },
      {
        id: "r8",
        name: isAr ? "كريم محمد علي" : "Kareem Mohamed Ali",
        className: isAr ? "الروضة أ" : "KG A",
        value: isAr ? "الذكاء المنطقي" : "Logical",
      },
    ],
    evaluationStatuses: [
      {
        id: "e1",
        name: isAr ? "كريم محمد علي" : "Kareem Mohamed Ali",
        className: isAr ? "الروضة أ" : "KG A",
        status: isAr ? "تم التقييم" : "Assessed",
        statusClassName: "text-emerald-600",
      },
      {
        id: "e2",
        name: isAr ? "ليلى محمد ابراهيم" : "Laila Mohamed Ibrahim",
        className: isAr ? "الروضة أ" : "KG A",
        status: isAr ? "تم التقييم" : "Assessed",
        statusClassName: "text-emerald-600",
        reminderDisabled: true,
      },
      {
        id: "e3",
        name: isAr ? "ساره أحمد علي" : "Sara Ahmed Ali",
        className: isAr ? "الروضة ب" : "KG B",
        status: isAr ? "لم يبدأ بعد" : "Not started",
        statusClassName: "text-primary",
      },
      {
        id: "e4",
        name: isAr ? "كريم محمد علي" : "Kareem Mohamed Ali",
        className: isAr ? "الروضة أ" : "KG A",
        status: isAr ? "تم التقييم" : "Assessed",
        statusClassName: "text-emerald-600",
        reminderDisabled: true,
      },
    ],
    reports: [
      {
        id: "rep1",
        title: isAr ? "تقرير الروضة أ" : "KG A report",
        childrenCountLabel: isAr ? "عدد الأطفال: 22" : "Children: 22",
        dateLabel: isAr ? "تاريخ التقرير: 15 مايو 2025" : "Date: 15 May 2025",
      },
      {
        id: "rep2",
        title: isAr ? "تقرير الروضة ب" : "KG B report",
        childrenCountLabel: isAr ? "عدد الأطفال: 20" : "Children: 20",
        dateLabel: isAr ? "تاريخ التقرير: 1 مايو 2025" : "Date: 1 May 2025",
      },
      {
        id: "rep3",
        title: isAr ? "تقرير الروضة أ" : "KG A report",
        childrenCountLabel: isAr ? "عدد الأطفال: 25" : "Children: 25",
        dateLabel: isAr ? "تاريخ التقرير: 1 مايو 2025" : "Date: 1 May 2025",
      },
    ],
  }
}

