"use client"

import Link from "next/link"
import {
  Compass,
  Zap,
  PlaneTakeoff,
  Rocket,
  Sparkles,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [animateIcon, setAnimateIcon] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState("signin")
  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
    code: "",
    name: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateIcon(true)
      setTimeout(() => setAnimateIcon(false), 1000)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-gray-950/80 shadow-md border-b border-gray-200 dark:border-gray-800"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold group">
            <div className="relative">
              <div
                className={`absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 blur-sm group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300 ${
                  animateIcon ? "scale-150 opacity-70" : ""
                }`}
              ></div>
              <div
                className={`relative z-10 transition-transform duration-500 ${
                  animateIcon ? "rotate-[360deg]" : ""
                }`}
              >
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400 inline-block">
              MindJourney
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex">
              <ul className="flex space-x-1">
                <li>
                  <Button variant="ghost" size="sm" className="rounded-full px-4 group">
                    <Compass className="h-4 w-4 mr-1 group-hover:animate-spin-slow" />
                    Explore
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" size="sm" className="rounded-full px-4 group">
                    <Zap className="h-4 w-4 mr-1 group-hover:text-yellow-500" />
                    Inspiration
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" size="sm" className="rounded-full px-4 group">
                    <PlaneTakeoff className="h-4 w-4 mr-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    My Trips
                  </Button>
                </li>
              </ul>
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={e => {
                  console.log('Sign In button clicked');
                  e.stopPropagation()
                  setAuthMode("signin")
                  setAuthOpen(true)
                  console.log('setAuthOpen(true) called from Sign In button');
                }}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="rounded-full"
                onClick={e => {
                  console.log('Get Started button clicked');
                  e.stopPropagation()
                  setAuthMode("signup")
                  setAuthOpen(true)
                  console.log('setAuthOpen(true) called from Get Started button');
                }}
              >
                <Rocket className="h-4 w-4 mr-1" />
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden animate-fadeIn">
            <div className="container mx-auto px-4 py-3">
              <nav className="flex flex-col space-y-2">
                <Link href="/" className="px-3 py-2 rounded-lg">Explore</Link>
                <Link href="/" className="px-3 py-2 rounded-lg">Inspiration</Link>
                <Link href="/" className="px-3 py-2 rounded-lg">My Trips</Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Auth Dialog */}
      <Dialog open={authOpen} onOpenChange={(open) => {
        console.log('Dialog onOpenChange called with:', open);
        setAuthOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {authMode === "signup"
                ? "Create Account"
                : authMode === "code"
                ? "Enter Code"
                : "Sign In"}
            </DialogTitle>
            <DialogDescription>
              {authMode === "signup"
                ? "Sign up to create your account."
                : authMode === "code"
                ? "Enter the code sent to your email or phone."
                : "Sign in to your account."}
            </DialogDescription>
          </DialogHeader>

          {authMode === "signin" && (
            <div className="space-y-4">
              <Input
                placeholder="Email or Phone"
                value={form.emailOrPhone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, emailOrPhone: e.target.value }))
                }
              />
              <Input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
              />
              <div className="flex justify-between text-xs">
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setAuthMode("code")}
                >
                  Sign in with code
                </button>
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setAuthMode("signup")}
                >
                  Create Account
                </button>
              </div>
              {error && <div className="text-red-500 text-xs">{error}</div>}
              <DialogFooter>
                <Button onClick={() => {/* Sign-in logic here */}}>Sign In</Button>
              </DialogFooter>
            </div>
          )}

          {authMode === "signup" && (
            <div className="space-y-4">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <Input
                placeholder="Email or Phone"
                value={form.emailOrPhone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, emailOrPhone: e.target.value }))
                }
              />
              <Input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                }
              />
              <Input
                placeholder="Code"
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value }))
                }
              />
              <div className="flex justify-between text-xs">
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setAuthMode("signin")}
                >
                  Already have an account?
                </button>
              </div>
              <DialogFooter>
                <Button onClick={() => {/* Sign-up logic here */}}>Sign Up</Button>
              </DialogFooter>
            </div>
          )}

          {authMode === "code" && (
            <div className="space-y-4">
              <Input
                placeholder="Email or Phone"
                value={form.emailOrPhone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, emailOrPhone: e.target.value }))
                }
              />
              <Input
                placeholder="Code"
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value }))
                }
              />
              <div className="flex justify-between text-xs">
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setAuthMode("signin")}
                >
                  Back to password
                </button>
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setAuthMode("signup")}
                >
                  Create Account
                </button>
              </div>
              <DialogFooter>
                <Button onClick={() => {/* Code logic here */}}>Sign In</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
