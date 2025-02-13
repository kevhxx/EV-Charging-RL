"use client"

import { motion } from "framer-motion"
import { ArrowRight, Database, LineChart, Users, MapPin, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function TechnologyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-8">Network & Data Integration</h1>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <MapPin className="w-6 h-6" />,
                  title: "Live Station Map",
                  description: "Provides real-time station data.",
                },
                {
                  icon: <LineChart className="w-6 h-6" />,
                  title: "Traffic Data",
                  description: "Analyzing congestion and travel demand.",
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Demographics",
                  description: "Understanding residential charging needs.",
                },
                {
                  icon: <Database className="w-6 h-6" />,
                  title: "Planning",
                  description: "EV support for new stations.",
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "Growth",
                  description: "Predicting future growth.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 mb-4">{item.description}</p>
                  <Link href="#" className="inline-flex items-center text-primary hover:gap-2 transition-all">
                    Learn More <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

