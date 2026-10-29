# خطة الـ Skeleton

> **الحالة: منفّذة.** انبنت بالكامل عبر ست PRs (#54, #56, #57, #58, #59, #62). هاد الملف هو الخطة الأصلية اللي اتوافق عليها، محفوظ للرجوع. وصف الوضع الحالي موجود في قسم "Loading states" في `docs/STATUS.md`.
> الاختلافات عن الخطة: لـ Quick Start وSign-in ما في انتظار بيانات، فالـ skeleton تبعهم للـ route فقط. وصفحات Home وCost-calc وAgent-strategy وAdvisor بتستخدم `(site)/loading.tsx` كـ fallback واحد.

## 1. ليش نحتاجها (الوضع الحالي)

اللي موجود هلأ في حالة الانتظار هو **نص فقط** (مثل "Working out your first read" + `aria-busy`). المشاكل:

- الصفحة تقفز (layout shift) لما يوصل المحتوى الحقيقي، لأن النص أصغر بكثير من الصفحة النهائية.
- ما في أي إحساس بشكل الصفحة القادمة، فالمستخدم بيحس إنها بطيئة.
- كل صفحة عاملة حالتها لحالها (`ReportStateMessage`, `FirstReadPage`, `IntakePage`, `DashboardPage`)، يعني تكرار.

## 2. وين الانتظار فعلياً (من الكود، مش تخمين)

| الصفحة | السبب | نوع الانتظار |
|---|---|---|
| `/quick-start` | استرجاع الإجابات المحفوظة من الجهاز | قراءة محلية (سريعة) |
| `/first-read` | قراءة الإجابات + `POST /api/first-read` | شبكة (سيرفر) |
| `/intake` | "Bringing back your saved answers" | قراءة محلية |
| `/report` | `POST /api/report` (حساب على السيرفر) | شبكة، الأثقل |
| `/report/[area]` | نفس موديل التقرير | شبكة |
| `/report/pdf` | نفس موديل التقرير + معاينة الصفحات | شبكة |
| `/dashboard` | جلسة الحساب + `POST /api/audit-summaries` | شبكة |
| `/sign-in` | قراءة جلسة الحساب (هل مسجّل دخول؟) | قراءة محلية |
| `/unlock` | قراءة الـ entitlement | قراءة محلية |
| `/` Landing, `/cost-calc`, `/agent-strategy`, `/advisor` | ما في انتظار بيانات، صفحات ثابتة | ما في |

## 3. الهيكل المقترح (حسب قواعد المشروع: من تحت لفوق)

**أ. Tokens** (`src/design`): ألوان الـ skeleton (أساس + لمعة) وتوقيت الحركة. بدون ألوان hard-coded (قاعدة 9).

**ب. Primitive واحدة في `ui/Skeleton`**: أشكال أساسية فقط: `line`, `block`, `circle`, `pill`. وهي اللي بنبني منها كل شي:
- `aria-hidden` على الأشكال، وعلى الحاوية `aria-busy="true"` + نص مخفي بصرياً `role="status"` من `en.skeleton.*` (قاعدة 10).
- Shimmer بالـ CSS فقط (بدون JS). مع `prefers-reduced-motion` بيصير ثابت بدون حركة.
- بتظهر بـ fade-in بعد ~150ms، فإذا الصفحة جاهزة بسرعة (القراءة المحلية) ما يصير وميض.
- Story: أشكال، الأحجام، reduced motion.

**ج. Skeleton لكل Pattern ثقيل** (بجانب المكوّن نفسه، عشان الأبعاد تتطابق ولا يصير قفز): `ScoreCardSkeleton`, `ScoreRingSkeleton`, `RadarChartSkeleton`, `StageCardSkeleton`, `QuestionCardSkeleton`, `ActionListSkeleton`.

**د. Skeleton مخصص لكل Feature/صفحة** (يعكس تخطيط الصفحة الحقيقي على 390px و1440px)، وبعدين:
- `loading.tsx` لكل route بيستدعيه (التنقل بين الصفحات).
- حالة `loading` داخل المكوّنات (`useReportModel`, `FirstReadPage`, ...) بتعرض نفس الـ skeleton بدل النص، فما في نسختين.

## 4. الـ Skeleton لكل صفحة بالتفصيل

الأبعاد النهائية رح آخذها من CSS الـ design-reference وقت البناء، هون وصف التخطيط.

| الصفحة | الـ Skeleton (Desktop 1440) | الموبايل 390 |
|---|---|---|
| **Quick Start** | هيدر الخطوات (Stepper) + بطاقة سؤال واحد (عنوان + 4 خيارات RadioCard) + زر Next | نفس الشي عمود واحد، الخيارات تحت بعض |
| **First Read** | عنوان + Stage card كبيرة + 3 ScoreCards + 3 بطاقات مقفولة (شكل locked) + CTA | كلها عمود واحد |
| **Intake** | شريط تقدم + قائمة الأقسام A–F بجنب + بطاقتين أسئلة | بدون قائمة جانبية، شريط تقدم + بطاقة سؤال |
| **Report** | ReportHero (عنوان + ring + stage) + Radar كبير + شبكة 6 ScoreCards + 3 أقسام (أسطر نص) | Radar أصغر، البطاقات عمود واحد |
| **Report/[area]** | عنوان المنطقة + ring + أقسام الأدلة (Evidence tags كبسولات) + ActionList | عمود واحد |
| **PDF export** | عمود خيارات (Switches) + معاينة صفحة A4 رمادية بسطور | الخيارات فوق، المعاينة تحت |
| **Dashboard** | عنوان + فلاتر (كبسولات) + شبكة AuditCards (ring صغير + سطرين + Stage) | بطاقات بعمود واحد |
| **Sign-in** | بطاقة وسط (عنوان + حقل email + زر) | نفس الشي بعرض كامل |
| **Unlock** | عنوان + بطاقتين FreeVsFull + أقسام "peek" | عمود واحد |
| **Landing / Cost-calc / Agent-strategy / Advisor** | ما بحتاج skeleton بيانات (الصفحة ثابتة وفورية). فقط `loading.tsx` خفيف بالتنقل (هيدر الصفحة + بلوك محتوى) | نفس الشي |

زرار الإرسال (Advisor / Unlock): موجود أصلاً حالة `loading` على الـ Button ("Sending..."). ما بنغيرها، بس بنتأكد إنها موحدة.

## 5. الجودة والـ Performance

- **صفر layout shift**: الـ skeleton بنفس ارتفاع وعرض المحتوى (حاويات بـ `min-height`/`aspect-ratio` من نفس الـ CSS Module).
- **بدون JS للحركة**: CSS animation فقط، `transform`/`opacity`، وبدون re-render.
- **Accessibility** (WCAG 2.2 AA): `aria-busy`، نص حالة واحد مقروء للـ screen reader، الحركة تتوقف مع `prefers-reduced-motion`، تباين الأشكال كافي.
- **SSR**: السيرفر بيرجّع نفس الـ skeleton اللي بيعرضه أول render بالمتصفح، فما في hydration mismatch.
- **Tests**: لكل skeleton: بيعرض `aria-busy`، ما بيعرض نصوص مكتوبة يدوياً، وبيستبدله المحتوى الحقيقي. بالإضافة لتحديث e2e (390/1440 بدون horizontal scroll).
- **Storybook**: story لكل skeleton (desktop + mobile) وبجانب كل Pattern.
- `pnpm check` لازم يمر في كل خطوة.

## 6. ترتيب البناء وتقسيم الـ PRs (حسب الـ Git workflow: فرع و PR لكل شغلة، من `main`)

1. `feat/skeleton-primitive`: tokens + `ui/Skeleton` + مفاتيح `en.skeleton` + stories + tests.
2. `feat/pattern-skeletons`: skeletons للـ patterns.
3. `feat/report-skeletons`: Report, Report/[area], PDF (نفس الموديل، أكبر فايدة).
4. `feat/quick-start-skeletons`: Quick Start + First Read.
5. `feat/intake-dashboard-skeletons`: Intake, Dashboard, Sign-in, Unlock.
6. `feat/route-loading-states`: ملفات `loading.tsx` للصفحات الثابتة + تنظيف النصوص القديمة (`ReportStateMessage` loading وغيرها) + e2e.

(كل PR لازم ينعمل merge قبل ما أبدأ اللي بعده، لأنه بيعتمد عليه.)

## 7. قرارات بدي موافقتك عليها

1. **نوع الحركة**: shimmer (لمعة تمر) أو pulse (نبض) أو ثابت؟ توصيتي: shimmer هادئ، وثابت مع reduced-motion.
2. **الصفحات الثابتة** (Landing, Cost-calc, Agent-strategy, Advisor): بس `loading.tsx` خفيف؟ توصيتي: نعم، لأنها فورية وskeleton كامل بس رح يومض.
3. **تأخير الظهور 150ms** لتجنب الوميض بالقراءات المحلية السريعة: موافقة؟
4. **تقسيم الـ PRs** بالشكل أعلاه (6 PRs) أو بدك أقل/أكبر؟
5. **نصوص القارئ الشاشة** ("Loading your report"...) من `en.ts`: تمام أضيف قسم `skeleton`؟

إذا وافقت (أو عدّلت شي)، بدأ بـ PR الأول.
