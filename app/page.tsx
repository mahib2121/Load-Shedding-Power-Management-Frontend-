import {
  Zap,
  Calendar,
  Bell,
  Shield,
  Activity,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Users,
  BarChart3,
  CreditCard,
  Wrench,
  AlertTriangle,
  Smartphone,
  Cloud,
  Lock,
  Sparkles,
  Star,
  TrendingUp,
  Globe,
  Gauge,
  Cpu,
} from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const STATS = [
  { value: "2.4M+", label: "Active Users", icon: Users },
  { value: "180+", label: "Cities Covered", icon: Globe },
  { value: "99.99%", label: "Uptime", icon: Activity },
  { value: "< 2 min", label: "Alert Latency", icon: Clock },
];

const FEATURES = [
  {
    icon: Calendar,
    title: "Smart Schedules",
    description:
      "Browse personalized load shedding schedules filtered by zone, date, and status. Stay ahead of upcoming outages.",
    accent: "from-amber-500/20 to-amber-500/0",
  },
  {
    icon: AlertTriangle,
    title: "Real-time Outages",
    description:
      "Live outage map with sub-minute updates. Get push notifications the moment your area is affected.",
    accent: "from-rose-500/20 to-rose-500/0",
  },
  {
    icon: MapPin,
    title: "Zone Management",
    description:
      "Granular zone-level control for operators and zone managers. Approve, activate, and monitor with confidence.",
    accent: "from-emerald-500/20 to-emerald-500/0",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Customizable alerts via email, SMS, and push. Never miss a critical update for your area again.",
    accent: "from-blue-500/20 to-blue-500/0",
  },
  {
    icon: CreditCard,
    title: "Payments & Billing",
    description:
      "Manage your electricity bills, view payment history, and download invoices — all from one dashboard.",
    accent: "from-violet-500/20 to-violet-500/0",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified, ISO 27001 compliant, and GDPR ready. Your data is protected at every layer.",
    accent: "from-cyan-500/20 to-cyan-500/0",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Your Account",
    description:
      "Sign up in under 60 seconds with email or Google. Tell us your zone and we'll personalize everything for you.",
  },
  {
    step: "02",
    title: "Pick Your Zones",
    description:
      "Subscribe to any number of zones — your home, your office, your family. Set notification preferences per zone.",
  },
  {
    step: "03",
    title: "Get Real-time Alerts",
    description:
      "Receive instant push, email, or SMS notifications whenever there's a load shedding event or outage in your area.",
  },
  {
    step: "04",
    title: "Plan With Confidence",
    description:
      "Use the calendar view to plan your week, charge devices, and schedule tasks around predicted power availability.",
  },
];

const ROLES = [
  {
    icon: Users,
    title: "Customers",
    description:
      "View personal schedules, get alerts, manage bills, and stay informed about power in your area.",
  },
  {
    icon: Wrench,
    title: "Field Operators",
    description:
      "Manage assignments, log field work, and update outage status from any device — online or offline.",
  },
  {
    icon: BarChart3,
    title: "Zone Managers",
    description:
      "Oversee your team, approve schedules, analyze trends, and ensure SLAs are met across your zone.",
  },
  {
    icon: Cpu,
    title: "Super Admins",
    description:
      "Full platform control: manage users, configure zones, audit activity, and customize the entire system.",
  },
];

const SCHEDULE_PREVIEW = [
  {
    zone: "Zone A — Downtown",
    date: "Mon, Oct 12",
    slots: [
      { time: "06:00 – 08:30", status: "scheduled" },
      { time: "12:00 – 14:30", status: "scheduled" },
      { time: "18:00 – 20:30", status: "scheduled" },
    ],
  },
  {
    zone: "Zone B — Northside",
    date: "Mon, Oct 12",
    slots: [
      { time: "08:30 – 11:00", status: "scheduled" },
      { time: "14:30 – 17:00", status: "scheduled" },
    ],
  },
  {
    zone: "Zone C — Westend",
    date: "Mon, Oct 12",
    slots: [
      { time: "11:00 – 13:30", status: "scheduled" },
      { time: "17:00 – 19:30", status: "scheduled" },
    ],
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Power Management completely changed how our family plans around load shedding. The alerts are instant and the schedule view is beautifully simple.",
    name: "Sarah Mitchell",
    role: "Customer, Zone A",
    avatar: "SM",
    rating: 5,
  },
  {
    quote:
      "As a zone manager, I finally have one place to approve schedules, monitor my team, and respond to incidents. The audit trail alone saves us hours.",
    name: "David Okafor",
    role: "Zone Manager, Lagos",
    avatar: "DO",
    rating: 5,
  },
  {
    quote:
      "We deployed this for 12 districts in three months. Onboarding was painless and the API documentation is genuinely the best I've seen.",
    name: "Aisha Patel",
    role: "Operations Director",
    avatar: "AP",
    rating: 5,
  },
];

const FAQS = [
  {
    q: "How do I receive load shedding alerts?",
    a: "After registering, simply add your zones and choose your preferred notification channels — push, email, or SMS. You'll get alerts the moment a new schedule is published or an outage is reported.",
  },
  {
    q: "Is my personal data safe?",
    a: "Absolutely. We are SOC 2 Type II certified, ISO 27001 compliant, and fully GDPR compliant. All data is encrypted in transit and at rest using industry-standard AES-256.",
  },
  {
    q: "Can I track multiple zones?",
    a: "Yes — you can subscribe to any number of zones. This is perfect for families, property managers, and businesses operating across multiple locations.",
  },
  {
    q: "Do you have a mobile app?",
    a: "Our responsive web app works flawlessly on any device. Native iOS and Android apps are in development and will launch to beta users later this year.",
  },
  {
    q: "What does it cost?",
    a: "We offer a generous free tier for individual customers, and affordable Pro and Enterprise plans for power utilities, municipalities, and large organizations.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-background to-muted/40">
        {/* Decorative grid */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_4%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_4%,transparent)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        />
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 -z-10 h-96 w-[44rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        />

        <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 md:px-6 md:pt-24 md:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <Sparkles className="size-3 text-primary" />
                New: AI-powered outage prediction — now in beta
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
                Reliable power,
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  intelligently managed.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                The modern platform for load shedding schedules, real-time
                outage tracking, and power distribution. Built for customers,
                operators, and utilities that can&apos;t afford downtime.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href="/register" size="lg" className="h-11 px-6">
                  Get Started Free
                  <ArrowRight className="ml-1.5 size-4" />
                </ButtonLink>
                <ButtonLink
                  href="/load-shedding"
                  size="lg"
                  variant="outline"
                  className="h-11 px-6"
                >
                  <Zap className="mr-1.5 size-4" />
                  View Live Schedule
                </ButtonLink>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  No credit card required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  14-day Pro trial
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Cancel anytime
                </span>
              </div>
            </div>

            {/* Right — Hero card */}
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent blur-2xl"
              />

              <Card className="border-2 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Live Power Status
                      </CardTitle>
                      <CardDescription>
                        Updated 12 seconds ago
                      </CardDescription>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                      </span>
                      Stable
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Load", value: "72%", icon: Gauge },
                      { label: "Active Zones", value: "184", icon: MapPin },
                      { label: "Outages", value: "3", icon: AlertTriangle },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl border bg-muted/30 p-3"
                      >
                        <s.icon className="size-4 text-muted-foreground" />
                        <p className="mt-1.5 text-lg font-semibold">
                          {s.value}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Next slot preview */}
                  <div className="rounded-xl border bg-muted/20 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Next Scheduled Event
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Zone A — Downtown</p>
                        <p className="text-sm text-muted-foreground">
                          Today, 18:00 – 20:30
                        </p>
                      </div>
                      <ButtonLink
                        href="/dashboard/schedules"
                        size="sm"
                        variant="outline"
                      >
                        View
                      </ButtonLink>
                    </div>
                  </div>

                  {/* Mini chart */}
                  <div className="rounded-xl border bg-muted/20 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        24h Load Curve
                      </p>
                      <TrendingUp className="size-3.5 text-emerald-500" />
                    </div>
                    <div className="mt-3 flex h-16 items-end gap-1">
                      {[40, 55, 50, 65, 80, 75, 60, 45, 50, 70, 85, 90, 75, 60, 55, 70, 85, 95, 80, 65, 50, 45, 55, 60].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary"
                            style={{ height: `${h}%` }}
                          />
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ STATS ============================ */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <stat.icon className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FEATURES ============================ */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Features
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to manage power
            </h2>
            <p className="mt-4 text-muted-foreground">
              From real-time outage tracking to role-based dashboards, we built
              every feature you&apos;d expect — and a few you wouldn&apos;t.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card
                key={f.title}
                className="group relative overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div
                  aria-hidden
                  className={`absolute inset-0 -z-0 bg-gradient-to-br ${f.accent} opacity-0 transition-opacity group-hover:opacity-100`}
                />
                <CardHeader className="relative">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="size-5" />
                  </div>
                  <CardTitle className="mt-3">{f.title}</CardTitle>
                  <CardDescription>{f.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              How It Works
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-muted-foreground">
              Four simple steps to take control of your power experience.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="relative rounded-2xl border bg-background p-6 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <span className="text-5xl font-bold text-primary/20">
                  {step.step}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ SCHEDULES PREVIEW ============================ */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Schedules
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Plan your week with confidence
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Browse load shedding schedules by zone, date, or status. Filter,
                favorite, and export — whatever helps you stay ahead.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "Filter by zone, date, or status",
                  "Personalized 'My Schedule' view",
                  "Export to Google Calendar or iCal",
                  "Submit, approve, and activate lifecycle",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <ButtonLink href="/load-shedding" className="mt-6">
                Browse All Schedules
                <ArrowRight className="ml-1.5 size-4" />
              </ButtonLink>
            </div>

            <div className="space-y-3">
              {SCHEDULE_PREVIEW.map((zone) => (
                <Card key={zone.zone}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm font-semibold">
                          {zone.zone}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {zone.date}
                        </CardDescription>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                        {zone.slots.length} slots
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    {zone.slots.map((slot) => (
                      <div
                        key={slot.time}
                        className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-1.5 text-xs"
                      >
                        <span className="font-medium">{slot.time}</span>
                        <span className="text-muted-foreground capitalize">
                          {slot.status}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ ROLES ============================ */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Built for Every Role
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              One platform, four experiences
            </h2>
            <p className="mt-4 text-muted-foreground">
              Role-aware navigation, permissions, and tooling — so each user
              sees exactly what they need, nothing more.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((role) => (
              <Card key={role.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm">
                    <role.icon className="size-6" />
                  </div>
                  <CardTitle className="mt-3">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ TESTIMONIALS ============================ */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Loved by Thousands
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Trusted across cities and continents
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="flex flex-col">
                <CardContent className="flex-1 pt-6">
                  <div className="mb-3 flex items-center gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </CardContent>
                <CardHeader className="border-t pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FAQ ============================ */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                FAQ
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Frequently asked questions
              </h2>
            </div>

            <div className="mt-10 space-y-3">
              {FAQS.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-xl border bg-background p-5 transition-all open:border-primary/30 open:shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {faq.q}
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ CTA ============================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
          <div className="mx-auto max-w-3xl rounded-3xl border-2 bg-background p-8 text-center shadow-xl md:p-12">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Zap className="size-6" fill="currentColor" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
              Ready to take control of your power?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Join 2.4M+ users and hundreds of utilities who trust Power
              Management for reliable, transparent power management.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/register" size="lg" className="h-11 px-6">
                Start Free Today
                <ArrowRight className="ml-1.5 size-4" />
              </ButtonLink>
              <ButtonLink
                href="/contact"
                size="lg"
                variant="outline"
                className="h-11 px-6"
              >
                Talk to Sales
              </ButtonLink>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Cloud className="size-3.5" />
                Cloud-hosted
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Smartphone className="size-3.5" />
                Mobile-friendly
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="size-3.5" />
                End-to-end encrypted
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Activity className="size-3.5" />
                99.99% Uptime SLA
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
