"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Zap } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Navbar({
  selectedCity,
  setSelectedCity,
}: {
  selectedCity: string
  setSelectedCity?: (city: string) => void
}) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/technology", label: "Technology" },
    { href: "/ai-model", label: "AI Model" },
    { href: "/map", label: "Map" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="fixed w-full z-50 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold tracking-tighter hover:text-primary transition-colors flex items-center gap-2"
          >
            <Zap className="w-6 h-6" />
            EV Charging
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative hover:text-primary transition-colors ${
                  pathname === item.href ? "text-primary" : ""
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div layoutId="underline" className="absolute left-0 top-full h-0.5 w-full bg-primary" />
                )}
              </Link>
            ))}
          </div>

          {setSelectedCity && (
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[180px] bg-black/20 border-none text-white">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="london">London</SelectItem>
                <SelectItem value="newyork">New York</SelectItem>
                <SelectItem value="losangeles">Los Angeles</SelectItem>
                <SelectItem value="hongkong">Hong Kong</SelectItem>
                <SelectItem value="singapore">Singapore</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </nav>
  )
}

