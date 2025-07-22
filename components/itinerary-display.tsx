"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Utensils, 
  Bed, 
  Plane, 
  Train, 
  Bus, 
  Car, 
  Camera, 
  Coffee, 
  Ticket, 
  Share2, 
  Download, 
  Star, 
  Edit, 
  Copy, 
  Trash2,
  ChevronDown,
  ChevronUp,
  Map,
  MessageSquare
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Activity {
  id: string
  time: string
  title: string
  description: string
  location: string
  type: "attraction" | "food" | "transport" | "accommodation" | "other"
  duration: string
  cost?: string
  rating?: number
  image?: string
  notes?: string
}

interface DayPlan {
  day: number
  date: string
  activities: Activity[]
}

interface Itinerary {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  days: DayPlan[]
  totalCost: string
  coverImage: string
  htmlContent?: string // Add htmlContent field
}

// Mock data for demonstration
const mockItinerary: Itinerary = {
  id: "trip-123",
  title: "Magical Tokyo Adventure",
  destination: "Tokyo, Japan",
  startDate: "2023-10-15",
  endDate: "2023-10-20",
  totalCost: "$2,500",
  coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop",
  days: [
    {
      day: 1,
      date: "Oct 15, 2023",
      activities: [
        {
          id: "act-1",
          time: "09:00",
          title: "Arrival at Narita International Airport",
          description: "Flight JL123 from Los Angeles",
          location: "Narita International Airport",
          type: "transport",
          duration: "1 hour",
          image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop"
        },
        {
          id: "act-2",
          time: "11:00",
          title: "Check-in at Hotel Gracery Shinjuku",
          description: "4-star hotel in the heart of Shinjuku",
          location: "Shinjuku, Tokyo",
          type: "accommodation",
          duration: "1 hour",
          cost: "$180/night",
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop"
        },
        {
          id: "act-3",
          time: "13:00",
          title: "Lunch at Ichiran Ramen",
          description: "Famous chain for tonkotsu ramen served in individual booths",
          location: "Shinjuku, Tokyo",
          type: "food",
          duration: "1.5 hours",
          cost: "$15-20",
          rating: 4.7,
          image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?q=80&w=600&auto=format&fit=crop"
        },
        {
          id: "act-4",
          time: "15:00",
          title: "Explore Shinjuku Gyoen National Garden",
          description: "One of Tokyo's largest and most popular parks",
          location: "Shinjuku, Tokyo",
          type: "attraction",
          duration: "2 hours",
          cost: "$2",
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=600&auto=format&fit=crop"
        },
        {
          id: "act-5",
          time: "18:00",
          title: "Dinner at Omoide Yokocho",
          description: "Narrow lanes filled with tiny eateries serving yakitori and more",
          location: "Shinjuku, Tokyo",
          type: "food",
          duration: "2 hours",
          cost: "$30-40",
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1554797589-7241bb691973?q=80&w=600&auto=format&fit=crop"
        }
      ]
    },
    {
      day: 2,
      date: "Oct 16, 2023",
      activities: [
        {
          id: "act-6",
          time: "08:00",
          title: "Breakfast at hotel",
          description: "Buffet breakfast with Japanese and Western options",
          location: "Hotel Gracery Shinjuku",
          type: "food",
          duration: "1 hour",
          cost: "Included",
          image: "https://images.unsplash.com/photo-1513442542250-854d436a73f2?q=80&w=600&auto=format&fit=crop"
        },
        {
          id: "act-7",
          time: "09:30",
          title: "Visit Meiji Shrine",
          description: "Shinto shrine dedicated to Emperor Meiji and Empress Shoken",
          location: "Shibuya, Tokyo",
          type: "attraction",
          duration: "2 hours",
          cost: "Free",
          rating: 4.7,
          image: "https://images.unsplash.com/photo-1583084647979-b53fbbc15e79?q=80&w=600&auto=format&fit=crop"
        },
        {
          id: "act-8",
          time: "12:00",
          title: "Explore Harajuku & Takeshita Street",
          description: "Tokyo's fashion district and trendy shopping street",
          location: "Harajuku, Tokyo",
          type: "attraction",
          duration: "2 hours",
          image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=600&auto=format&fit=crop"
        },
        {
          id: "act-9",
          time: "14:30",
          title: "Lunch at Kawaii Monster Cafe",
          description: "Colorful themed cafe in the heart of Harajuku",
          location: "Harajuku, Tokyo",
          type: "food",
          duration: "1.5 hours",
          cost: "$30-40",
          rating: 4.2,
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop"
        },
        {
          id: "act-10",
          time: "17:00",
          title: "Shibuya Crossing & Shopping",
          description: "Experience the famous scramble crossing and shop around Shibuya",
          location: "Shibuya, Tokyo",
          type: "attraction",
          duration: "3 hours",
          image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=600&auto=format&fit=crop"
        }
      ]
    }
  ]
}

export function ItineraryDisplay({ itinerary = mockItinerary }) {
  const [activeDay, setActiveDay] = useState(1)
  const [viewMode, setViewMode] = useState<'timeline' | 'map' | 'formatted'>('timeline')
  const [isLoaded, setIsLoaded] = useState(false)
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null)
  
  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Get icon for activity type
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'attraction':
        return <Camera className="h-5 w-5 text-blue-500" />
      case 'food':
        return <Utensils className="h-5 w-5 text-green-500" />
      case 'transport':
        return <Plane className="h-5 w-5 text-purple-500" />
      case 'accommodation':
        return <Bed className="h-5 w-5 text-amber-500" />
      default:
        return <MapPin className="h-5 w-5 text-gray-500" />
    }
  }
  
  // Get color for activity type
  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'attraction':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
      case 'food':
        return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800'
      case 'transport':
        return 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800'
      case 'accommodation':
        return 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800'
      default:
        return 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
  }
  
  // Toggle activity details
  const toggleActivityDetails = (id: string) => {
    if (expandedActivity === id) {
      setExpandedActivity(null)
    } else {
      setExpandedActivity(id)
    }
  }
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Hero section with cover image */}
      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
        <img 
          src={itinerary.coverImage} 
          alt={itinerary.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <Badge className="mb-2 bg-blue-600 hover:bg-blue-700 text-white border-0">
                {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{itinerary.title}</h1>
              <div className="flex items-center text-white/80">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{itinerary.destination}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-full">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-full">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* View toggle */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Itinerary</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant={viewMode === 'timeline' ? "default" : "outline"} 
            size="sm" 
            className="rounded-l-full rounded-r-none"
            onClick={() => setViewMode('timeline')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Timeline
          </Button>
          <Button 
            variant={viewMode === 'formatted' ? "default" : "outline"} 
            size="sm" 
            className="rounded-none"
            onClick={() => setViewMode('formatted')}
          >
            <Edit className="h-4 w-4 mr-2" />
            Formatted
          </Button>
          <Button 
            variant={viewMode === 'map' ? "default" : "outline"} 
            size="sm" 
            className="rounded-r-full rounded-l-none"
            onClick={() => setViewMode('map')}
          >
            <Map className="h-4 w-4 mr-2" />
            Map
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Day selector sidebar */}
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Trip Days</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col space-y-1 max-h-[500px] overflow-y-auto scrollbar-hide">
                {itinerary.days.map((day) => (
                  <Button
                    key={day.day}
                    variant={activeDay === day.day ? "default" : "ghost"}
                    className={`justify-start rounded-none border-l-4 ${
                      activeDay === day.day 
                        ? "border-l-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                        : "border-l-transparent"
                    } transition-all`}
                    onClick={() => setActiveDay(day.day)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{day.day}</span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Day {day.day}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{day.date}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              <div className="p-4 border-t">
                <Button variant="outline" className="w-full justify-center rounded-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Trip Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Day details */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {viewMode === 'formatted' && (
              <motion.div
                key="formatted-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Your Formatted Itinerary</h2>
                  <div className="prose prose-blue max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: itinerary.htmlContent || 'No formatted itinerary content available.' }} />
                </div>
              </motion.div>
            )}
            
            {viewMode === 'map' && (
              <motion.div
                key="map-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg"
              >
                <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Map className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">Interactive map view coming soon</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">This is a placeholder for the map integration</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {viewMode === 'timeline' && (
              <motion.div
                key="timeline-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {itinerary.days
                  .filter(day => day.day === activeDay)
                  .map(day => (
                    <div key={day.day} className="space-y-6">
                      <div className="relative">
                        {/* Timeline */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
                        
                        {/* Activities */}
                        <div className="space-y-6">
                          {day.activities.map((activity, index) => (
                            <motion.div 
                              key={activity.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ 
                                opacity: isLoaded ? 1 : 0, 
                                y: isLoaded ? 0 : 20 
                              }}
                              transition={{ 
                                duration: 0.4,
                                delay: index * 0.1
                              }}
                              className="relative"
                            >
                              {/* Time indicator */}
                              <div className="absolute left-0 top-0 flex flex-col items-center w-8">
                                <div className="z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-2 border-blue-500 flex items-center justify-center">
                                  {getActivityIcon(activity.type)}
                                </div>
                              </div>
                              
                              {/* Activity card */}
                              <div className={`ml-12 rounded-xl border shadow-sm hover:shadow-md transition-all ${getActivityColor(activity.type)}`}>
                                <div 
                                  className="p-4 cursor-pointer"
                                  onClick={() => toggleActivityDetails(activity.id)}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        {activity.time}
                                      </div>
                                      <h3 className="font-bold text-lg mb-1">{activity.title}</h3>
                                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <MapPin className="h-3.5 w-3.5 mr-1" />
                                        {activity.location}
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                      <div className="flex items-center mb-1">
                                        <Clock className="h-3.5 w-3.5 mr-1 text-gray-500 dark:text-gray-400" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{activity.duration}</span>
                                      </div>
                                      {activity.cost && (
                                        <Badge variant="outline" className="text-xs">
                                          {activity.cost}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                                      {activity.description}
                                    </p>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 rounded-full"
                                    >
                                      {expandedActivity === activity.id ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                                
                                {/* Expanded details */}
                                <AnimatePresence>
                                  {expandedActivity === activity.id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="border-t p-4">
                                        <div className="flex flex-col md:flex-row gap-4">
                                          {activity.image && (
                                            <div className="md:w-1/3">
                                              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                                                <img 
                                                  src={activity.image} 
                                                  alt={activity.title} 
                                                  className="w-full h-full object-cover"
                                                />
                                              </div>
                                            </div>
                                          )}
                                          <div className="md:w-2/3">
                                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                              {activity.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                              {activity.rating && (
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                  <span>{activity.rating}</span>
                                                </Badge>
                                              )}
                                              <Badge variant="outline">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {activity.duration}
                                              </Badge>
                                              {activity.cost && (
                                                <Badge variant="outline">
                                                  {activity.cost}
                                                </Badge>
                                              )}
                                            </div>
                                            <div className="flex gap-2">
                                              <Button variant="outline" size="sm" className="rounded-full">
                                                <Edit className="h-3.5 w-3.5 mr-1.5" />
                                                Edit
                                              </Button>
                                              <Button variant="outline" size="sm" className="rounded-full">
                                                <Copy className="h-3.5 w-3.5 mr-1.5" />
                                                Copy
                                              </Button>
                                              <Button variant="outline" size="sm" className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                                Delete
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
