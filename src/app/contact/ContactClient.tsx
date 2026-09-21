"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactClient() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_10%,oklch(0.78_0.14_195/3%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Header */}
        <div className="mb-12">
          <span className="inline-block font-mono text-xs sm:text-sm tracking-widest text-cyan mb-4 uppercase">
            Contact
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Corrections, tips, feedback, collaboration inquiries, or if you work in
            the data centre industry and want to share knowledge, we want to hear from you.
          </p>
        </div>

        {/* Direct Contact Links */}
        <div className="grid sm:grid-cols-2 gap-3 mb-12">
          <a
            href="mailto:elmaccommunicationslimited@gmail.com"
            className="glass-card rounded-xl p-4 border border-border/50 hover:border-cyan/30 transition-all group flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-lg bg-cyan/10 text-cyan flex items-center justify-center shrink-0 group-hover:bg-cyan/20 transition-colors">
              <Mail className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Email</p>
              <p className="text-xs text-muted-foreground truncate">elmaccommunicationslimited@gmail.com</p>
            </div>
          </a>
          <a
            href="https://x.com/FinallyKayvoh"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card rounded-xl p-4 border border-border/50 hover:border-cyan/30 transition-all group flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-lg bg-cyan/10 text-cyan flex items-center justify-center shrink-0 group-hover:bg-cyan/20 transition-colors">
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">X / Twitter</p>
              <p className="text-xs text-muted-foreground truncate">@FinallyKayvoh</p>
            </div>
          </a>
          <a
            href="https://whatsapp.com/channel/0029Vb8Ob1ZK0IBfXJc9P427"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card rounded-xl p-4 border border-border/50 hover:border-cyan/30 transition-all group flex items-center gap-3 sm:col-span-2"
          >
            <div className="h-10 w-10 rounded-lg bg-cyan/10 text-cyan flex items-center justify-center shrink-0 group-hover:bg-cyan/20 transition-colors">
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">WhatsApp Channel</p>
              <p className="text-xs text-muted-foreground truncate">Join the growing DC254 community — updates and discussion, straight to your WhatsApp</p>
            </div>
          </a>
        </div>

        {/* Contact Form */}
        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-8 border border-green-500/20 text-center"
          >
            <CheckCircle className="size-10 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Message Sent</h2>
            <p className="text-muted-foreground leading-relaxed">
              Thank you for reaching out. We read every message and will respond if a
              reply is needed.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-sm text-cyan underline hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="glass-card rounded-xl p-6 sm:p-8 border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                  Name <span className="text-cyan">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-11 px-3 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-cyan/50 transition-colors text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email <span className="text-cyan">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-11 px-3 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-cyan/50 transition-colors text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">
                Subject <span className="text-cyan">*</span>
              </label>
              <select
                id="subject"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full h-11 px-3 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-cyan/50 transition-colors text-sm"
              >
                <option value="">Select a topic...</option>
                <option value="correction">Correction or outdated information</option>
                <option value="tip">News tip or information</option>
                <option value="collaboration">Collaboration inquiry</option>
                <option value="industry">Industry professional (sharing knowledge)</option>
                <option value="research">Research or academic inquiry</option>
                <option value="feedback">General feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                Message <span className="text-cyan">*</span>
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-cyan/50 transition-colors text-sm leading-relaxed resize-none"
                placeholder="Your message..."
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
                <AlertCircle className="size-4" />
                Something went wrong. Please try again or email us directly.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full h-12 bg-cyan text-background hover:bg-cyan/90 font-semibold text-sm tracking-wide rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "sending" ? (
                <>Sending...</>
              ) : (
                <>
                  Send Message
                  <Send className="size-4" />
                </>
              )}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
