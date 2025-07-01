import { TravelPlannerForm } from "@/components/travel-planner-form"
import { ItineraryDisplay } from "@/components/itinerary-display"
import { LoadingItinerary } from "@/components/loading-itinerary"
import { VisualInspiration } from "@/components/visual-inspiration"
import Image from "next/image"
import { Sparkles, Globe, Zap, PlaneTakeoff, Map, Share2, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with 3D and Parallax Effects */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <div className="inline-block animate-fadeIn">
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    <span>AI-Powered Travel Planning</span>
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight animate-fadeIn animation-delay-200">
                  <span className="gradient-text">Reimagine</span> Your Travel Experience
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 animate-fadeIn animation-delay-400">
                  Create personalized travel itineraries with AI that understands your preferences, budget, and travel style.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fadeIn animation-delay-600">
                <Button size="lg" className="rounded-full relative overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></span>
                  <span className="relative flex items-center">
                    <PlaneTakeoff className="mr-2 h-5 w-5 group-hover:animate-bounce-custom" />
                    Plan Your Trip
                  </span>
                </Button>
                
                <Button variant="outline" size="lg" className="rounded-full border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 group">
                  <span className="relative z-10 flex items-center">
                    <Globe className="mr-2 h-5 w-5 group-hover:animate-spin-slow" />
                    Explore Destinations
                  </span>
                </Button>
              </div>
              
              <div className="pt-4 flex items-center justify-center lg:justify-start space-x-8 animate-fadeIn animation-delay-800">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden shadow-sm">
                      <Image 
                        src={`/placeholder-user.jpg`} 
                        alt={`User ${i}`} 
                        width={32} 
                        height={32} 
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-gray-200">1,000+</span> travelers joined this week
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-xl">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30 blur-lg"></div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30 blur-lg animate-pulse-glow"></div>
                
                {/* Card with glassmorphism effect */}
                <div className="relative glassmorphism dark:glassmorphism-dark rounded-xl p-6 shadow-xl card-3d">
                  <div className="absolute top-0 right-0 p-4">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                  
                  <TravelPlannerForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Unlock the Future of Travel Planning</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform offers innovative features to make your travel planning experience seamless and enjoyable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover-grow">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Itineraries</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate personalized travel plans based on your preferences, budget, and travel style.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover-grow">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Map className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Interactive Maps</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visualize your journey with interactive maps showing routes, attractions, and hidden gems.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover-grow">
              <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Sharing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share your itineraries with friends and family or export them to your calendar.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover-grow">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Collaborative Planning</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Plan trips together with friends and family in real-time with collaborative editing.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover-grow">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Destination Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get local recommendations, cultural tips, and insider knowledge for any destination.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover-grow">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visual Inspiration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Discover stunning destinations and get inspired for your next adventure.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Visual Inspiration Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Visual Inspiration</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Discover breathtaking destinations and get inspired for your next adventure.
              </p>
            </div>
            <Button variant="outline" size="lg" className="mt-4 md:mt-0 rounded-full border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <span className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Button>
          </div>
          
          <VisualInspiration />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-900/20 dark:to-indigo-900/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Ready to Transform Your Travel Experience?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who are using MindJourney to create unforgettable experiences around the world.
            </p>
            
            <Button size="lg" className="rounded-full relative overflow-hidden group">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></span>
              <span className="relative flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Planning Now
              </span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
