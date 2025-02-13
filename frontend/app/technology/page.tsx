"use client"

import { motion } from "framer-motion"
import { MapPin, LineChart, Home, ZapIcon, TrendingUp } from "lucide-react"
import Navbar from "../components/navbar"

export default function TechnologyPage() {
  const technologies = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Existing Charging Stations",
      subtitle: "Open Charge Map",
      description: "Provides real-time station data.",
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: "Traffic Patterns",
      subtitle: "GB Road Traffic, TFL Data",
      description: "Analyzing congestion and travel demand.",
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Demographics & Housing Prices",
      subtitle: "Residential Analysis",
      description: "Understanding residential charging needs.",
    },
    {
      icon: <ZapIcon className="w-8 h-8" />,
      title: "Energy Grid Constraints",
      subtitle: "Grid Infrastructure",
      description: "Ensuring grid support for new stations.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "EV Adoption & Demand Forecasts",
      subtitle: "Growth Prediction",
      description: "Predicting future growth.",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar selectedCity="london" />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Technology Stack & Data Integration</h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Our comprehensive technology stack integrates multiple data sources to optimize EV charging infrastructure
              placement and management.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Technology Grid */}
      <div className="px-6 pb-20 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-black/30 border border-white/10 hover:border-primary/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  {tech.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{tech.title}</h3>
                <p className="text-primary mb-3 text-sm">{tech.subtitle}</p>
                <p className="text-gray-400">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

