"use client"

import { motion } from "framer-motion"
import { Mail, Linkedin, Github } from "lucide-react"
import Navbar from "../components/navbar"

export default function ContactPage() {
  const contacts = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email",
      value: "example@example.com",
      href: "mailto:example@example.com",
    },
    {
      icon: <Linkedin className="w-8 h-8" />,
      title: "LinkedIn",
      value: "EV Charging Project",
      href: "https://linkedin.com",
    },
    {
      icon: <Github className="w-8 h-8" />,
      title: "GitHub",
      value: "GitHub Repository",
      href: "https://github.com",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar selectedCity="london" />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact & Collaboration</h1>
            <p className="text-xl text-gray-400">Interested in collaborating? Reach out to us!</p>
          </motion.div>
        </div>
      </div>

      {/* Contact Grid */}
      <div className="px-6 pb-20 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            {contacts.map((contact, index) => (
              <motion.a
                key={index}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-black/30 border border-white/10 hover:border-primary/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  {contact.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{contact.title}</h3>
                <p className="text-gray-400 group-hover:text-primary transition-colors">{contact.value}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

