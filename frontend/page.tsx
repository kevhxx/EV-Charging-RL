"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Battery, Zap, Globe } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Page() {
  const [selectedCity, setSelectedCity] = useState("london")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const cities = {
    london: {
      video: "/videos/london.mp4",
      name: "London",
      stations: "2,345",
      availability: "94%",
    },
    newyork: {
      video: "/videos/newyork.mp4",
      name: "New York",
      stations: "3,122",
      availability: "92%",
    },
    losangeles: {
      video: "/videos/losangeles.mp4",
      name: "Los Angeles",
      stations: "2,788",
      availability: "89%",
    },
    hongkong: {
      video: "/videos/hongkong.mp4",
      name: "Hong Kong",
      stations: "1,955",
      availability: "95%",
    },
    singapore: {
      video: "/videos/singapore.mp4",
      name: "Singapore",
      stations: "1,677",
      availability: "97%",
    },
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.video
          key={selectedCity}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={cities[selectedCity as keyof typeof cities].video} type="video/mp4" />
        </motion.video>
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      <div className="relative z-10">
        <nav
          className={`fixed w-full transition-all duration-300 ${
            scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/"
                className="text-xl font-bold tracking-tighter hover:text-primary transition-colors flex items-center gap-2"
              >
                <Zap className="w-6 h-6" />
                Faraday Intelligent
              </Link>

              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/technology" className="hover:text-primary transition-colors">
                  Technology
                </Link>
                <Link href="/map" className="hover:text-primary transition-colors">
                  Map
                </Link>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </div>

              <Select defaultValue={selectedCity} onValueChange={setSelectedCity}>
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
            </div>
          </div>
        </nav>

        <main className="min-h-screen">
          {/* Hero Section */}
          <div className="pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-3xl"
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  The Future of
                  <span className="text-primary block">Urban Charging</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Powering sustainable mobility with smart charging infrastructure across global cities.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/technology"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-medium transition-colors"
                  >
                    Explore Technology
                  </Link>
                  <Link
                    href="/map"
                    className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-medium transition-colors"
                  >
                    Find Stations
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-black/40 backdrop-blur-md py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm">
                  <Battery className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{cities[selectedCity as keyof typeof cities].stations}</h3>
                  <p className="text-gray-400">Active Charging Stations</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm">
                  <Zap className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-2">
                    {cities[selectedCity as keyof typeof cities].availability}
                  </h3>
                  <p className="text-gray-400">Network Availability</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm">
                  <Globe className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-2">24/7</h3>
                  <p className="text-gray-400">Real-time Monitoring</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[
                  {
                    title: "Smart Charging",
                    description: "AI-powered load balancing and optimization for efficient energy distribution.",
                  },
                  {
                    title: "Mobile Integration",
                    description: "Seamless app experience for finding, booking, and managing charging sessions.",
                  },
                  {
                    title: "Green Energy",
                    description: "100% renewable energy sources powering our charging network.",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-colors"
                  >
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

