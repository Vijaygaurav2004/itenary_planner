import Link from "next/link"
import { MapPin, Globe, Info, Github } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-950/90 dark:border-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-blue-100 dark:bg-blue-900/30 blur-sm group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-all duration-300"></div>
            <MapPin className="relative z-10 h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">Travel Planner</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex">
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Globe className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" asChild>
                  <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-1 h-4 w-4" />
                    <span>GitHub</span>
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
