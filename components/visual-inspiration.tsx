"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Camera, Share2, Bookmark, Filter, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Mock data for visual inspiration
const destinations = [
  {
    id: 1,
    title: "Santorini Sunset",
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop",
    category: "beach",
    likes: 2453,
    featured: true
  },
  {
    id: 2,
    title: "Tokyo Nights",
    location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop",
    category: "city",
    likes: 1872,
    featured: true
  },
  {
    id: 3,
    title: "Alpine Adventure",
    location: "Swiss Alps, Switzerland",
    image: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=800&auto=format&fit=crop",
    category: "mountain",
    likes: 1654,
    featured: false
  },
  {
    id: 4,
    title: "Serengeti Safari",
    location: "Serengeti, Tanzania",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop",
    category: "wildlife",
    likes: 2109,
    featured: false
  },
  {
    id: 5,
    title: "Bali Retreat",
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
    category: "beach",
    likes: 3201,
    featured: true
  },
  {
    id: 6,
    title: "Northern Lights",
    location: "Tromsø, Norway",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=800&auto=format&fit=crop",
    category: "nature",
    likes: 4102,
    featured: true
  },
  {
    id: 7,
    title: "Manhattan Skyline",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop",
    category: "city",
    likes: 1876,
    featured: false
  },
  {
    id: 8,
    title: "Machu Picchu",
    location: "Cusco, Peru",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop",
    category: "historical",
    likes: 2987,
    featured: false
  }
]

const categories = [
  { id: "all", label: "All" },
  { id: "beach", label: "Beaches" },
  { id: "city", label: "Cities" },
  { id: "mountain", label: "Mountains" },
  { id: "nature", label: "Nature" },
  { id: "wildlife", label: "Wildlife" },
  { id: "historical", label: "Historical" }
]

export function VisualInspiration() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [filteredDestinations, setFilteredDestinations] = useState(destinations)
  const [liked, setLiked] = useState<number[]>([])
  const [saved, setSaved] = useState<number[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Filter destinations based on active category
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredDestinations(destinations)
    } else {
      setFilteredDestinations(destinations.filter(dest => dest.category === activeCategory))
    }
  }, [activeCategory])
  
  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Toggle like status
  const toggleLike = (id: number) => {
    if (liked.includes(id)) {
      setLiked(liked.filter(likedId => likedId !== id))
    } else {
      setLiked([...liked, id])
    }
  }
  
  // Toggle save status
  const toggleSave = (id: number) => {
    if (saved.includes(id)) {
      setSaved(saved.filter(savedId => savedId !== id))
    } else {
      setSaved([...saved, id])
    }
  }
  
  return (
    <div className="relative">
      {/* Mobile filter button */}
      <div className="md:hidden mb-6 flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full flex items-center gap-2"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredDestinations.length} destinations
        </span>
      </div>
      
      {/* Mobile filter dropdown */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-12 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-xl p-4 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filter by Category</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => setIsFilterOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge 
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={`cursor-pointer ${
                    activeCategory === category.id 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                  onClick={() => {
                    setActiveCategory(category.id)
                    setIsFilterOpen(false)
                  }}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Desktop category filters */}
      <div className="hidden md:flex mb-8 space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(category => (
          <Badge 
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            className={`cursor-pointer transition-all ${
              activeCategory === category.id 
                ? "bg-blue-600 hover:bg-blue-700 px-4 py-1.5" 
                : "hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-1.5"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </Badge>
        ))}
      </div>
      
      {/* Destinations grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredDestinations.map((destination) => (
            <motion.div
              key={destination.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 card-3d"
            >
              {/* Featured badge */}
              {destination.featured && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 border-0 text-white">
                    Featured
                  </Badge>
                </div>
              )}
              
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-bold mb-1">{destination.title}</h3>
                <div className="flex items-center mb-3">
                  <MapPin className="h-4 w-4 mr-1 text-white/80" />
                  <span className="text-sm text-white/80">{destination.location}</span>
                </div>
                
                {/* Action buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20"
                      onClick={() => toggleLike(destination.id)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${liked.includes(destination.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                      />
                    </Button>
                    <span className="text-sm">{liked.includes(destination.id) ? destination.likes + 1 : destination.likes}</span>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20"
                    >
                      <Share2 className="h-4 w-4 text-white" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20"
                      onClick={() => toggleSave(destination.id)}
                    >
                      <Bookmark 
                        className={`h-4 w-4 ${saved.includes(destination.id) ? 'fill-white text-white' : 'text-white'}`} 
                      />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Hover overlay with action button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button className="rounded-full bg-white text-blue-600 hover:bg-blue-50">
                  <Camera className="mr-2 h-4 w-4" />
                  Explore
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Empty state */}
      {filteredDestinations.length === 0 && (
        <div className="py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <Filter className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No destinations found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try selecting a different category or check back later
          </p>
          <Button 
            variant="outline" 
            onClick={() => setActiveCategory("all")}
            className="rounded-full"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
} 