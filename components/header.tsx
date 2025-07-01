"use client"

import Link from "next/link"
import { MapPin, Globe, Info, Github, Sparkles, User, Menu, X, Compass, Zap, Rocket, PlaneTakeoff } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [animateIcon, setAnimateIcon] = useState(false)
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])
  
  // Trigger icon animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateIcon(true)
      setTimeout(() => setAnimateIcon(false), 1000)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <header className={`sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 dark:bg-gray-950/80 shadow-md border-b border-gray-200 dark:border-gray-800' 
        : 'bg-transparent border-transparent'
    }`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold group">
          <div className="relative">
            <div className={`absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 blur-sm group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300 ${
              animateIcon ? 'scale-150 opacity-70' : ''
            }`}></div>
            <div className={`relative z-10 transition-transform duration-500 ${animateIcon ? 'rotate-[360deg]' : ''}`}>
              <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="overflow-hidden">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400 inline-block">
              MindJourney
            </span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-1">
              <li>
                <Button variant="ghost" size="sm" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-full px-4 group">
                  <Compass className="h-4 w-4 mr-1 group-hover:animate-spin-slow" />
                  Explore
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-full px-4 group">
                  <Zap className="h-4 w-4 mr-1 group-hover:text-yellow-500" />
                  Inspiration
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-full px-4 group">
                  <PlaneTakeoff className="h-4 w-4 mr-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  My Trips
                </Button>
              </li>
            </ul>
          </nav>
          
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            
            <Button variant="outline" size="sm" className="rounded-full border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 group">
              <span className="relative z-10">Sign In</span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/0 via-blue-400/0 to-indigo-400/0 group-hover:from-blue-400/10 group-hover:via-blue-400/20 group-hover:to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Button>
            
            <Button size="sm" className="rounded-full relative overflow-hidden group">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></span>
              <span className="relative flex items-center">
                <Rocket className="h-4 w-4 mr-1 group-hover:animate-bounce-custom" />
                Get Started
              </span>
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glassmorphism-dark dark:glassmorphism-dark animate-fadeIn">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Compass className="h-4 w-4" />
                Explore
              </Link>
              <Link 
                href="/" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Zap className="h-4 w-4" />
                Inspiration
              </Link>
              <Link 
                href="/" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlaneTakeoff className="h-4 w-4" />
                My Trips
              </Link>
              <div className="pt-2 flex flex-col space-y-2">
                <Button variant="outline" size="sm" className="justify-center rounded-full border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  Sign In
                </Button>
                <Button size="sm" className="justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Rocket className="h-4 w-4 mr-1" />
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
