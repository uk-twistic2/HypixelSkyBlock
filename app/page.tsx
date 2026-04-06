"use client"

import { Button } from "@/components/ui/button"
import { Twitter, Linkedin, Github, Mail, Code, Palette, Rocket, Zap, Check } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setFormData({ name: "", email: "", subject: "", message: "" })
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setError(data.error || "Failed to send message")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[#5B4B8A] via-[#7B5B8A] to-[#8B6B9A]">

      {/* Spline Background */}
      <div className="fixed inset-0 z-0">
        <iframe
          src="https://my.spline.design/motiontrails-mQJiWP02BoJRJj7QScWZ8Yil/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="h-full w-full"
        />
      </div>

      <center>{/* Navigation */}
        <nav className="relative z-10 px-8 py-8 md:px-16">
          <ul className="flex flex-wrap gap-6 text-sm font-bold tracking-wide text-white md:gap-12">
            <li>
              <a href="#home" className="cursor-pointer transition-all duration-300 hover:text-red-400 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                HOME
              </a>
            </li>
            <li>
              <a href="#pricing" className="cursor-pointer transition-all duration-300 hover:text-red-400 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                PRICING
              </a>
            </li>
            <li>
              <a href="#contact" className="cursor-pointer transition-all duration-300 hover:text-red-400 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                CONTACT
              </a>
            </li>
          </ul>
        </nav></center>

      {/* ── LANDING SECTION ── */}
      <section
        id="home"
        className="relative z-10 flex min-h-[90vh] flex-col items-center justify-between gap-8 px-8 pt-8 lg:flex-row lg:px-16 lg:pt-12"
      >
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-red-200/90">
            FREELANCE WEB DEVELOPER
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            WEBSITES
            <br />
            WITHOUT LIMITS
            <br />
            <span className="text-red-400">BUILT FOR YOU</span>
          </h1>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-white/90">
            I craft stunning, high-performance websites tailored to your vision. From sleek landing pages to complex web
            applications — no templates, no boundaries, just pure custom code that brings your ideas to life.
          </p>

          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-white/90">
              <Code className="h-5 w-5 text-red-400" />
              <span className="text-sm">Custom Code</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Palette className="h-5 w-5 text-red-400" />
              <span className="text-sm">Unique Design</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Rocket className="h-5 w-5 text-red-400" />
              <span className="text-sm">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Zap className="h-5 w-5 text-red-400" />
              <span className="text-sm">Lightning Fast</span>
            </div>
          </div>

          <div className="mb-12 flex flex-wrap gap-4">
            <a href="#contact">
              <Button
                size="lg"
                className="rounded-full bg-white px-8 text-sm font-semibold uppercase tracking-wide text-[#7B6BA8] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_20px_rgba(239,68,68,0.8),0_0_40px_rgba(239,68,68,0.5)]"
              >
                START A PROJECT
              </Button>
            </a>
            <a href="#pricing">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-white bg-transparent px-8 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:border-red-400 hover:bg-white/10 hover:text-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.8),0_0_40px_rgba(239,68,68,0.5)]"
              >
                VIEW PRICING
              </Button>
            </a>
          </div>

          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold text-white">20+</p>
              <p className="text-sm text-white/70">Projects Delivered</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-sm text-white/70">Client Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">24h</p>
              <p className="text-sm text-white/70">Response Time</p>
            </div>
          </div>
        </div>

        <div className="relative transition-transform duration-500 hover:scale-110">
          <div className="relative h-[400px] w-[400px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[540px]">
            <Image
              src="/website-builder-3d.jpg"
              alt="Web Development Illustration"
              fill
              className="rounded-2xl object-cover transition-all duration-500"
              style={{
                filter:
                  "drop-shadow(0 0 50px rgba(239, 68, 68, 0.8)) drop-shadow(0 0 100px rgba(239, 68, 68, 0.6)) drop-shadow(0 0 150px rgba(239, 68, 68, 0.4))",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGIES SECTION ── */}
      <section className="relative z-10 px-8 py-24 md:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wider text-red-200/90">
            WHAT WE USE
          </p>
          <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
            Technologies & Platforms
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-base leading-relaxed text-white/70">
            From simple static sites to complex web applications, I work with a wide range of technologies to deliver exactly what you need.
          </p>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
            {[
              { name: "HTML", icon: "🌐" },
              { name: "PHP", icon: "🐘" },
              { name: "Node.js", icon: "🟢" },
              { name: "Python", icon: "🐍" },
              { name: "WHMCS", icon: "💼" },
              { name: "WordPress", icon: "📝" },
            ].map((tech) => (
              <div
                key={tech.name}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:border-red-400/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
              >
                <span className="text-4xl transition-transform duration-300 group-hover:scale-110">{tech.icon}</span>
                <span className="text-sm font-semibold text-white">{tech.name}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-white/60">
            ...and many more technologies tailored to your project needs
          </p>
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="relative z-10 px-8 py-24 md:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wider text-red-200/90">
            TRANSPARENT PRICING
          </p>
          <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-base leading-relaxed text-white/70">
            Every project is unique. Pick the package that fits your needs or reach out for a fully custom quote.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Starter */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all duration-300 hover:border-red-400/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-300">STARTER</p>
              <p className="mb-1 text-4xl font-bold text-white">$150</p>
              <p className="mb-6 text-sm text-white/60">one-time payment</p>
              <ul className="mb-8 space-y-3">
                {[
                  "1–5 page website",
                  "Mobile responsive",
                  "Custom design",
                  "Contact form",
                  "2 rounds of revisions",
                  "Delivered in 7 days",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                    <Check className="h-4 w-4 shrink-0 text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#contact">
                <Button className="w-full rounded-full border-2 border-white bg-transparent text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:border-red-400 hover:bg-white/10 hover:text-red-400">
                  GET STARTED
                </Button>
              </a>
            </div>

            {/* Pro — featured */}
            <div className="relative rounded-2xl border-2 border-red-400 bg-white/15 p-8 shadow-[0_0_40px_rgba(239,68,68,0.4)] backdrop-blur-sm">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-red-400 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Most Popular
              </span>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-300">PRO</p>
              <p className="mb-1 text-4xl font-bold text-white">$250</p>
              <p className="mb-6 text-sm text-white/60">one-time payment</p>
              <ul className="mb-8 space-y-3">
                {[
                  "Up to 10 pages",
                  "Mobile responsive",
                  "Custom design & animations",
                  "CMS integration",
                  "SEO optimisation",
                  "Unlimited revisions",
                  "Delivered in 14 days",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                    <Check className="h-4 w-4 shrink-0 text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#contact">
                <Button className="w-full rounded-full bg-white px-8 text-sm font-semibold uppercase tracking-wide text-[#7B6BA8] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_20px_rgba(239,68,68,0.8)]">
                  GET STARTED
                </Button>
              </a>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all duration-300 hover:border-red-400/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-300">ENTERPRISE</p>
              <p className="mb-1 text-4xl font-bold text-white">Custom</p>
              <p className="mb-6 text-sm text-white/60">tailored quote</p>
              <ul className="mb-8 space-y-3">
                {[
                  "Unlimited pages",
                  "Full-stack web app",
                  "Custom integrations & APIs",
                  "E-commerce / dashboard",
                  "Priority support",
                  "Ongoing maintenance",
                  "Flexible timeline",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                    <Check className="h-4 w-4 shrink-0 text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#contact">
                <Button className="w-full rounded-full border-2 border-white bg-transparent text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:border-red-400 hover:bg-white/10 hover:text-red-400">
                  CONTACT ME
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section id="contact" className="relative z-10 px-8 py-24 md:px-16">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wider text-red-200/90">
            GET IN TOUCH
          </p>
          <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
            Start Your Project
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-base leading-relaxed text-white/70">
            Have an idea? Tell me about it and I&apos;ll get back to you within 24 hours.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {success && (
              <div className="rounded-xl border border-green-400/50 bg-green-400/10 px-4 py-3 text-sm text-green-300">
                Message sent successfully! I&apos;ll get back to you within 24 hours.
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-red-400/50 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-wide text-white/80">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 backdrop-blur-sm outline-none transition-all duration-300 focus:border-red-400 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-wide text-white/80">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 backdrop-blur-sm outline-none transition-all duration-300 focus:border-red-400 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-wide text-white/80">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What are you looking to build?"
                required
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 backdrop-blur-sm outline-none transition-all duration-300 focus:border-red-400 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-wide text-white/80">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell me about your project, timeline, and budget..."
                required
                className="resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 backdrop-blur-sm outline-none transition-all duration-300 focus:border-red-400 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full rounded-full bg-white text-sm font-semibold uppercase tracking-wide text-[#7B6BA8] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_20px_rgba(239,68,68,0.8),0_0_40px_rgba(239,68,68,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "SENDING..." : "SEND MESSAGE"}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-8 py-10 md:px-16">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm font-bold tracking-wide text-white">WEBSITES WITHOUT LIMITS</p>

          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}
