"use client"

import { motion } from "framer-motion"
import { Zap, TrafficConeIcon as Traffic, Home } from "lucide-react"
import Navbar from "../components/navbar"

export default function AIModelPage() {
  const insights = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "High-density Areas",
      description: "Need more Superchargers for rapid charging solutions.",
      highlight: "Superchargers",
    },
    {
      icon: <Traffic className="w-8 h-8" />,
      title: "Traffic Analysis",
      description: "Traffic bottlenecks significantly impact optimal station placement.",
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Residential Solutions",
      description: "Regular chargers complement home charging infrastructure.",
      highlight: "Regular chargers",
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">AI Model: Reinforcement Learning</h1>
            <p className="text-xl text-gray-400">
              Using reinforcement learning, our model optimizes EV charging station placement based on demand forecasts,
              grid constraints, and traffic data.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="px-6 pb-20 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Key Insights</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-black/30 border border-white/10 hover:border-primary/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  {insight.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{insight.title}</h3>
                <p className="text-gray-400">
                  {insight.highlight ? (
                    <>
                      {insight.description.split(insight.highlight)[0]}
                      <span className="text-primary font-semibold">{insight.highlight}</span>
                      {insight.description.split(insight.highlight)[1]}
                    </>
                  ) : (
                    insight.description
                  )}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

