"use client"

import React, { useState } from "react"
import { Shield, ShieldAlert, Eye, Lock, UserCheck, Scale, FileText, HelpCircle, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

// الأقسام الرئيسية لتسهيل التنقل الذكي
const SECTIONS = [
  { id: "definitions", title: "1. التعريفات", icon: FileText },
  { id: "about", title: "2. من نحن", icon: HelpCircle },
  { id: "audience", title: "3. من تشمله هذه السياسة", icon: UserCheck },
  { id: "data-collected", title: "4. البيانات التي نجمعها", icon: Eye },
  { id: "how-we-collect", title: "5. كيف نجمع البيانات", icon: Scale },
  { id: "purposes", title: "6. أغراض استخدام البيانات", icon: Lock },
  { id: "rights", title: "10. حقوقكم النظامية", icon: Shield },
  { id: "complaints", title: "13. الشكاوى والتظلمات", icon: ShieldAlert },
]

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("definitions")

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-20 selection:bg-purple-500/20">
      {/* الهيدر العلوي الجذاب */}
      <div className="relative overflow-hidden bg-gradient-to-b from-purple-500/10 via-transparent to-transparent pb-12 text-center app-container">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-4 animate-fade-in">
          <Shield className="size-3.5" />
          نظام حماية البيانات الشخصية (SDAIA)
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight">
          سياسة الخصوصية وحماية البيانات
        </h1>
        <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          نلتزم في منصة إثراء الذكاء بأعلى معايير الأمان الشفافة لحماية بياناتكم وبيانات أطفالكم تماشياً مع الأنظمة المرعية في المملكة العربية السعودية.
        </p>
      </div>

      <div className="app-container grid gap-8 lg:grid-cols-4 mt-8">
        {/* القائمة الجانبية الثابتة للتنقل (Sticky Sidebar) - تختفي في الشاشات الصغيرة */}
        <aside className="hidden lg:block lg:col-span-1 space-y-1 sticky top-24 h-fit max-vh-[80vh] overflow-y-auto pr-2">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 mb-3">
            فهرس السياسة
          </div>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon
            const isActive = activeSection === sec.id
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-start",
                  isActive
                    ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 font-bold border-r-4 border-purple-500"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{sec.title}</span>
              </button>
            )
          })}
        </aside>

        {/* محتوى السياسة الرئيسي */}
        <main className="col-span-1 lg:col-span-3 space-y-12">
          
          {/* 1. التعريفات */}
          <section id="definitions" className="scroll-mt-24 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6 border-b pb-3">
              <span className="size-2 rounded-full bg-purple-500" />
              1. التعريفات والمصطلحات
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "المنصة", desc: "موقع وتطبيق إثراء الذكاء بجميع أشكاله الإلكترونية لتقديم خدمات الإثراء التعليمي والتوصيات." },
                { label: "المستخدم", desc: "كل شخص يدخل إلى المنصة، بما في ذلك أولياء الأمور، المدارس، ومزودو الأنشطة." },
                { label: "ولي الأمر", desc: "الشخص البالغ الذي يُسجّل في المنصة نيابةً عن طفله لاكتشاف الأنشطة الإثرائية." },
                { label: "المزوّد", desc: "المدرسة أو المؤسسة التعليمية أو مزوّد الأنشطة الذي يُدرج برامجه على المنصة." },
                { label: "الطفل", desc: "كل فردٍ دون الثامنة عشرة من عمره تُشارك بياناته من قِبل وليّ أمره." },
                { label: "البيانات الشخصية", desc: "أي معلومة تُعرّفكم بصورةٍ مباشرة أو غير مباشرة كالاسم، البريد، ومعرّف الجهاز." },
              ].map((def, i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/40 border border-border/30">
                  <div className="font-bold text-foreground text-sm mb-1">{def.label}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{def.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-900 dark:text-indigo-300 leading-relaxed">
              <strong>النظام المتبع:</strong> نظام حماية البيانات الشخصية في المملكة العربية السعودية (المرسوم الملكي م/19) الصادر وتحت إشراف الهيئة السعودية للبيانات والذكاء الاصطناعي <strong>(سداية - SDAIA)</strong>.
            </div>
          </section>

          {/* 2. من نحن */}
          <section id="about" className="scroll-mt-24 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-4 border-b pb-3">
              <span className="size-2 rounded-full bg-pink-500" />
              2. من نحن
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              نحن <strong>إثراء الذكاء</strong>، شركةٌ مسجّلةٌ في المملكة العربية السعودية، تُشغّل منصةً تعليميةً ذكيةً تُساعد الأسر على اكتشاف البرامج الملائمة لأطفالها. عند استخدامكم للمنصة، نكون المتحكّمَ المسؤول عن بياناتكم الشخصية.
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="bg-muted px-4 py-3 rounded-xl">
                <span className="text-muted-foreground block mb-0.5">الاسم القانوني للمؤسسة</span>
                <strong className="text-foreground">تنمية وإثراء الذكاء</strong>
              </div>
              <div className="bg-muted px-4 py-3 rounded-xl">
                <span className="text-muted-foreground block mb-0.5">البريد الإلكتروني المخصص للخصوصية</span>
                <a href="mailto:privacy@ithrathaka.com" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">privacy@إثراء الذكاء.sa</a>
              </div>
            </div>
          </section>

          {/* 3. من تشمله السياسة */}
          <section id="audience" className="scroll-mt-24 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6 border-b pb-3">
              <span className="size-2 rounded-full bg-indigo-500" />
              3. من تشمله هذه السياسة
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                <h3 className="font-bold text-purple-700 dark:text-purple-400 text-base mb-2">أولياء الأمور والأسر</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">البالغون الساعون لاكتشاف الأنشطة. تُقدَّم بيانات الطفل دائماً بموافقة ولي الأمر الصريحة فقط.</p>
              </div>
              <div className="p-5 rounded-2xl bg-pink-500/5 border border-pink-500/10">
                <h3 className="font-bold text-pink-700 dark:text-pink-400 text-base mb-2">المدارس والمؤسسات</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">المدارس التي تُسجّل لإدراج برامجها، وإدارة توصيات وتقارير الطلاب المشتركين.</p>
              </div>
              <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                <h3 className="font-bold text-indigo-700 dark:text-indigo-400 text-base mb-2">مزودو الأنشطة</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">المؤسسات والأفراد المطورون لبرامج إثرائية والراغبون في الوصول للجمهور المستهدف.</p>
              </div>
            </div>
          </section>

          {/* 4. البيانات التي نجمعها */}
          <section id="data-collected" className="scroll-mt-24 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6 border-b pb-3">
              <span className="size-2 rounded-full bg-fuchsia-500" />
              4. البيانات التي نجمعها
            </h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground bg-muted/60 px-3 py-1.5 rounded-lg w-fit">أ. أولياء الأمور والأطفال</h4>
                <ul className="grid gap-2 text-xs text-muted-foreground pr-4 list-disc">
                  <li>الاسم الكامل، البريد الإلكتروني، ورقم الجوال.</li>
                  <li>بيانات الحساب (اسم المستخدم وكلمة المرور المشفرة تماماً تلقائياً).</li>
                  <li>ملف الطفل: الاسم الأول، العمر، الاهتمامات، الاحتياجات الخاصة والخيارات التعليمية.</li>
                  <li>البرامج المحفوظة وسجلات البحث وتفضيلات المنصة.</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground bg-muted/60 px-3 py-1.5 rounded-lg w-fit">ب. المدارس ومزودو الأنشطة</h4>
                <ul className="grid gap-2 text-xs text-muted-foreground pr-4 list-disc">
                  <li>اسم الممثل المفوّض، مسمّاه الوظيفي، بريده وهاتفه.</li>
                  <li>اسم المؤسسة، رقم السجل التجاري، العنوان، والشعار المعتمد.</li>
                  <li>تفاصيل البرامج المدرجة (الفئات العمرية، الجداول، والمواقع).</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/10 text-xs">
                <strong className="text-foreground block mb-1">ج. البيانات التقنية (للجميع):</strong>
                عنوان IP، نوع الجهاز ونظام التشغيل، مع بيانات تحليلية مجهولة الهوية عبر Google Analytics لفهم سلوك التصفح وتحسين الأداء.
              </div>
            </div>
          </section>

          {/* 5 + 6. جمع واستخدام البيانات */}
          <section id="how-we-collect" className="scroll-mt-24 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6 border-b pb-3">
              <span className="size-2 rounded-full bg-violet-500" />
              5 & 6. طرق وأغراض المعالجة
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">كيف نجمع بياناتكم؟</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex gap-2"><ChevronLeft className="size-4 text-purple-500 shrink-0" /> <span><strong>مباشرة منكم:</strong> عند كتابة البيانات وتأسيس الحساب.</span></div>
                  <div className="flex gap-2"><ChevronLeft className="size-4 text-purple-500 shrink-0" /> <span><strong>تلقائياً وبأدوات تحليل:</strong> الكوكيز والملفات التقنية لتأمين الجلسة فقط.</span></div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">أبرز أغراض الاستخدام:</h3>
                <div className="flex flex-wrap gap-2">
                  {["تقديم التوصيات المخصصة", "إدارة الحسابات والربط الذكي", "أمن المنصة وسلامتها", "الامتثال للأنظمة والتشريعات"].map((purpose, idx) => (
                    <span key={idx} className="bg-muted px-2.5 py-1 rounded-md text-xs text-muted-foreground">{purpose}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 10. الحقوق النظامية */}
          <section id="rights" className="scroll-mt-24 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6 border-b pb-3">
              <span className="size-2 rounded-full bg-rose-500" />
              10. حقوقكم بموجب نظام حماية البيانات الشخصية
            </h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              يكفل لكم النظام السعودي (المادة الرابعة) حقوقاً أساسية مطلقة ومباشرة للتحكم في بياناتكم، وهي تشمل:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "الحق في الإحاطة", desc: "معرفة البيانات التي نحتفظ بها وأوجه استخدامها (كما توضح هذه السياسة)." },
                { title: "الحق في الاطلاع والوصول", desc: "طلب نسخة كاملة من البيانات الرقمية التي نملكها عنكم أو عن طفلكم." },
                { title: "الحق في التصحيح", desc: "تعديل أو تحديث أي بيانات خاطئة، قديمة أو ناقصة بداخل المنصة فوراً." },
                { title: "الحق في الإتلاف (الحذف)", desc: "طلب مسح وإعدام بياناتكم عند انتهاء الغرض القانوني أو التعاقدي منها." },
              ].map((right, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                  <div className="size-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground mb-0.5">{right.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{right.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 text-xs text-center text-muted-foreground bg-muted p-3 rounded-xl">
              لممارسة حقوقك أو تقديم طلب، تواصل مع فريق الامتثال عبر البريد: <a href="mailto:privacy@ithrathaka.com" className="text-rose-600 font-bold hover:underline">privacy@إثراء الذكاء.sa</a>
            </div>
          </section>

          {/* 13. الشكاوى والتظلمات */}
          <section id="complaints" className="scroll-mt-24 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-4 border-b pb-3">
              <span className="size-2 rounded-full bg-red-500" />
              13. الشكاوى والتظلمات والتواصل
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              إذا كانت لديكم أي مخاوف أو استفسارات تتعلق بخصوصيتكم، نرجو التواصل معنا مباشرة لحلها في أسرع وقت ممكن وبشفافية كاملة.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="p-4 rounded-xl bg-muted/50 border">
                <span className="text-xs text-muted-foreground block mb-1">البريد المخصص للشكاوى</span>
                <strong className="text-foreground">privacy@إثراء الذكاء.sa</strong>
                <span className="text-xs block text-purple-600 dark:text-purple-400 mt-1">مدة الرد المتوقعة: خلال 10 أيام عمل</span>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border">
                <span className="text-xs text-muted-foreground block mb-1">الاستفسارات العامة</span>
                <strong className="text-foreground">hello@إثراء الذكاء.sa</strong>
                <span className="text-xs block text-muted-foreground mt-1">الموقع الرسمي: ithrathaka.com</span>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}