"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import Link from "next/link"
import { Battery, Zap, Globe } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 数字动画组件
const AnimatedNumber = ({ value, duration = 1 }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref)

  useEffect(() => {
    if (!isInView) return

    let startTimestamp: number
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)
      setDisplayValue(Math.floor(progress * value))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [value, duration, isInView])

  return <span ref={ref}>{displayValue}</span>
}

export default function Page() {
  const [selectedCity, setSelectedCity] = useState("london")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const containerRef = useRef(null)
  const { scrollY } = useScroll()

  // 创建平滑的滚动动画值
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0])
  const headerY = useTransform(scrollY, [0, 100], [0, -50])
  const springHeaderY = useSpring(headerY, { stiffness: 100, damping: 30 })
  const springHeaderOpacity = useSpring(headerOpacity, { stiffness: 100, damping: 30 })

  // 导航栏背景透明度
  const navBgOpacity = useTransform(scrollY, [0, 100], [0, 1])
  const springNavBgOpacity = useSpring(navBgOpacity, { stiffness: 100, damping: 30 })

  const cities = {
    london: {
      name: "London",
      stations: 2345,
      availability: 94,
    },
    newyork: {
      name: "New York",
      stations: 3122,
      availability: 92,
    },
    losangeles: {
      name: "Los Angeles",
      stations: 2788,
      availability: 89,
    },
    hongkong: {
      name: "Hong Kong",
      stations: 1955,
      availability: 95,
    },
    singapore: {
      name: "Singapore",
      stations: 1677,
      availability: 97,
    },
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* YouTube Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          className="w-full h-[120vh] scale-125" // 稍微放大以覆盖整个区域
          src="https://www.youtube.com/embed/X8zLJlU_-60?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&showinfo=0&disablekb=1&rel=0&playsinline=1&start=180&end=240&playlist=X8zLJlU_-60"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 pointer-events-none" />

      {/* 滚动遮罩 */}
      <motion.div className="fixed inset-0 bg-black/80 pointer-events-none" style={{ opacity: springNavBgOpacity }} />

      <div className="relative z-10">
        <motion.nav
          className="fixed w-full"
          style={{
            backgroundColor: useTransform(springNavBgOpacity, [0, 1], ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]),
          }}
        >
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
        </motion.nav>

        <main>
          {/* Hero Section */}
          <motion.div
            className="min-h-screen flex items-center"
            style={{
              opacity: springHeaderOpacity,
              y: springHeaderY,
            }}
          >
            <div className="max-w-7xl mx-auto px-6 pt-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-3xl"
              >
                <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
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
          </motion.div>

          {/* Stats Section */}
          <div className="bg-black/40 backdrop-blur-md py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm"
                >
                  <Battery className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-4xl font-bold mb-2">
                    <AnimatedNumber value={cities[selectedCity].stations} />
                  </h3>
                  <p className="text-gray-400">Active Charging Stations</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm"
                >
                  <Zap className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-4xl font-bold mb-2">
                    <AnimatedNumber value={cities[selectedCity].availability} />%
                  </h3>
                  <p className="text-gray-400">Network Availability</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm"
                >
                  <Globe className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-4xl font-bold mb-2">24/7</h3>
                  <p className="text-gray-400">Real-time Monitoring</p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="py-20 px-6 bg-black/60">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-colors"
                  >
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

