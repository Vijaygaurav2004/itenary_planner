"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, MapPin, Plane, Hotel, Utensils, Sun, Camera, Coffee } from "lucide-react"

const loadingMessages = [
  "Finding the best attractions in your destination...",
  "Discovering local hidden gems...",
  "Researching restaurants with amazing local cuisine...",
  "Planning the perfect day-by-day itinerary...",
  "Finding accommodation options that match your preferences...",
  "Optimizing your transportation options...",
  "Checking for special events during your stay...",
  "Adding insider tips from locals...",
  "Making final adjustments to your perfect trip...",
]

export function LoadingItinerary() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="mx-auto max-w-3xl overflow-hidden border-none bg-white/95 shadow-2xl backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl">
      <CardContent className="flex flex-col items-center justify-center p-10 text-center">
        <div className="mb-8 flex items-center justify-center relative">
          <div className="absolute -inset-10 rounded-full bg-blue-500/5 animate-pulse"></div>
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-xl animate-pulse"></div>
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 dark:text-blue-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="h-7 w-7 text-blue-600 dark:text-blue-400 drop-shadow-md" />
            </div>
          </div>
        </div>

        <h2 className="mb-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Creating Your Perfect Itinerary
        </h2>
        <p className="mb-6 text-muted-foreground">
          Our AI is working on crafting your personalized travel plan...
        </p>

        <div className="flex h-16 items-center justify-center px-6 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/20">
          <p className="animate-fade-in text-blue-700 dark:text-blue-300 font-medium">{loadingMessages[messageIndex]}</p>
        </div>

        <div className="mt-12 flex justify-center space-x-10">
          <div className="animate-bounce-delay-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <Plane className="h-8 w-8 text-blue-500" />
          </div>
          <div className="animate-bounce-delay-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
            <Hotel className="h-8 w-8 text-indigo-500" />
          </div>
          <div className="animate-bounce-delay-3 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-full">
            <Utensils className="h-8 w-8 text-violet-500" />
          </div>
          <div className="animate-bounce-delay-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-full">
            <Sun className="h-8 w-8 text-amber-500" />
          </div>
          <div className="animate-bounce-delay-5 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-full">
            <Camera className="h-8 w-8 text-teal-500" />
          </div>
        </div>

        <div className="mt-12 text-xs text-gray-400 dark:text-gray-500">
          Generating a detailed itinerary takes just a moment...
        </div>
      </CardContent>
    </Card>
  )
}

// Add to tailwind.config.ts:
// extend: {
//   animation: {
//     "fade-in": "fadeIn 1s ease-in-out",
//     "bounce-delay-1": "bounce 1s infinite",
//     "bounce-delay-2": "bounce 1s infinite 0.1s",
//     "bounce-delay-3": "bounce 1s infinite 0.2s",
//     "bounce-delay-4": "bounce 1s infinite 0.3s",
//     "bounce-delay-5": "bounce 1s infinite 0.4s",
//   },
//   keyframes: {
//     fadeIn: {
//       "0%": { opacity: "0" },
//       "100%": { opacity: "1" },
//     },
//   },
// } 