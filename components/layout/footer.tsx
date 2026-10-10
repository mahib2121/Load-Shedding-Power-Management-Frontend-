"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Zap,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  GithubIcon,
  YoutubeIcon,
} from "@/components/ui/social-icons";
import { Input } from "@/components/ui/input";

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { href: "/load-shedding", label: "Load Shedding" },
      { href: "/outages", label: "Live Outages" },
      { href: "/zones", label: "Zone Coverage" },
      { href: "/pricing", label: "Pricing" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/changelog", label: "What's New" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/api", label: "API Reference" },
      { href: "/blog", label: "Blog" },
      { href: "/guides", label: "Guides & Tutorials" },
      { href: "/status", label: "System Status" },
      { href: "/help", label: "Help Center" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
      { href: "/partners", label: "Partners" },
      { href: "/press", label: "Press Kit" },
      { href: "/testimonials", label: "Testimonials" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/cookies", label: "Cookie Policy" },
      { href: "/compliance", label: "Compliance" },
      { href: "/security", label: "Security" },
      { href: "/gdpr", label: "GDPR" },
    ],
  },
] as const;

const SOCIAL_LINKS = [
  { href: "https://twitter.com", label: "Twitter", Icon: TwitterIcon },
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedinIcon },
  { href: "https://github.com", label: "GitHub", Icon: GithubIcon },
  { href: "https://youtube.com", label: "YouTube", Icon: YoutubeIcon },
] as const;

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="border-t bg-muted/30">
      {/* Newsletter section */}
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold">
                Stay powered with real-time updates
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Get load shedding schedules, outage alerts, and energy-saving
                tips delivered to your inbox weekly.
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-md items-center gap-2 md:justify-self-end"
            >
              <Input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 bg-background"
                aria-label="Email address"
              />
              <Button
                type="submit"
                className="h-10 shrink-0"
                disabled={subscribed}
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="mr-1.5 size-4" />
                    Subscribed
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="ml-1.5 size-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand block */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-semibold"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
                <Zap className="size-5" fill="currentColor" />
              </div>
              <span>Power Management</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A modern platform for managing load shedding schedules, power
              outages, and distribution. Built for customers, field operators,
              zone managers, and administrators.
            </p>

            {/* Contact */}
            <ul className="mt-6 space-y-2.5 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <Mail className="mt-0.5 size-4 shrink-0" />
                <a
                  href="mailto:support@powermanagement.app"
                  className="hover:text-foreground"
                >
                  support@powermanagement.app
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Phone className="mt-0.5 size-4 shrink-0" />
                <a href="tel:+18005551234" className="hover:text-foreground">
                  +1 (800) 555-1234
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>123 Power Grid Avenue, Suite 400</span>
              </li>
            </ul>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <s.Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold">{section.title}</h3>

              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center gap-3 border-t pt-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Shield className="size-3.5 text-emerald-500" />
            SOC 2 Type II
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Shield className="size-3.5 text-emerald-500" />
            ISO 27001
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Shield className="size-3.5 text-emerald-500" />
            GDPR Compliant
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Zap className="size-3.5 text-amber-500" />
            99.99% Uptime
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} Power Management Inc. All rights
            reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-foreground">
              Cookies
            </Link>
            <Link href="/sitemap" className="hover:text-foreground">
              Sitemap
            </Link>
            <span className="hidden md:inline">|</span>
            <span>
              Made with <span className="text-red-500">♥</span> for reliable
              power
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
