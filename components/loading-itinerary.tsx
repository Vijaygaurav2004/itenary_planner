"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Map } from "lucide-react"

export function LoadingItinerary() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Hero section skeleton */}
      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-8 w-64 mb-1" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </div>
      
      {/* View toggle skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-7 w-40" />
        <div className="flex items-center space-x-2">
          <Button 
            variant="default" 
            size="sm" 
            className="rounded-l-full rounded-r-none"
            disabled
          >
            <Calendar className="h-4 w-4 mr-2 opacity-50" />
            Timeline
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-r-full rounded-l-none"
            disabled
          >
            <Map className="h-4 w-4 mr-2 opacity-50" />
            Map
          </Button>
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Day selector sidebar skeleton */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                <Skeleton className="h-6 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-8 w-8 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-5 w-16 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Day details skeleton */}
        <div className="md:col-span-2">
          <div className="space-y-6">
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
              
              {/* Activities skeletons */}
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative">
                    {/* Time indicator */}
                    <div className="absolute left-0 top-0 flex flex-col items-center w-8">
                      <Skeleton className="z-10 w-8 h-8 rounded-full" />
                    </div>
                    
                    {/* Activity card skeleton */}
                    <div className="ml-12 rounded-xl border bg-gray-50 dark:bg-gray-900 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Skeleton className="h-4 w-16 mb-2" />
                          <Skeleton className="h-6 w-48 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex flex-col items-end">
                          <Skeleton className="h-4 w-16 mb-2" />
                          <Skeleton className="h-5 w-12 rounded-full" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading overlay with animation */}
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            {/* Spinning globe animation */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900 border-dashed animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-blue-600 border-blue-200 dark:border-t-blue-400 dark:border-blue-900 animate-spin-slow"></div>
            <div className="absolute inset-4 rounded-full bg-blue-600 dark:bg-blue-400 opacity-30 animate-pulse"></div>
          </div>
          <p className="text-lg font-medium text-blue-600 dark:text-blue-400 animate-pulse">
            Creating your itinerary...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">
            We're crafting the perfect travel plan just for you. This may take a moment.
          </p>
        </div>
      </div>
    </div>
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