"use client";

import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Contact() {
  const contact = useQuery(api.contact.get);
  const settings = useQuery(api.siteSettings.get);

  if (!contact || !settings) {
    return (
      <section
        id="contact"
        className="relative px-6 py-24 md:py-36"
        aria-labelledby="contact-heading"
      >
        <div className="relative mx-auto max-w-[1200px] text-center">
          <div className="mx-auto h-10 w-64 animate-pulse rounded bg-border" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="relative px-6 py-24 md:py-36"
      aria-labelledby="contact-heading"
    >
      <div
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/11 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute left-1/3 top-1/2 h-[280px] w-[280px] -translate-y-1/2 rounded-full bg-glow-red/14 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute right-1/4 top-1/2 h-[260px] w-[260px] -translate-y-1/2 rounded-full bg-glow-pink/12 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1200px] text-center">
        <motion.h2
          id="contact-heading"
          className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {contact.heading}
        </motion.h2>
        <motion.p
          className="mt-4 text-foreground-muted"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          {contact.subtext}
        </motion.p>
        <motion.a
          href={`mailto:${settings.email}`}
          className="mt-8 inline-block text-2xl font-medium text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:text-3xl"
          aria-label={`Email me at ${settings.email}`}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {settings.email}
        </motion.a>
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          {settings.socialLinks.map((link, i) => (
            <motion.a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background-alt px-5 py-2.5 text-sm font-medium text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={link.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.06, ease: "easeOut" }}
              whileHover={{ y: -3, scale: 1.06, backgroundColor: "rgba(56,56,58,1)" }}
              whileTap={{ scale: 0.95 }}
            >
              {link.platform}
            </motion.a>
          ))}
          <motion.a
            href={`mailto:${settings.email}`}
            className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Email me"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
            whileHover={{ y: -3, scale: 1.06, opacity: 0.9 }}
            whileTap={{ scale: 0.95 }}
          >
            Email
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
