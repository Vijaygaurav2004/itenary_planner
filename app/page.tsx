import { TravelPlannerForm } from "@/components/travel-planner-form"
import { Header } from "@/components/header"
import { MapPin, Calendar, Briefcase, Utensils, Plane, PalmtreeIcon, Camera, Globe, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-[url('/images/world-map-dots.svg')] bg-fixed bg-no-repeat bg-cover bg-center dark:bg-[url('/images/world-map-dots-dark.svg')] dark:from-gray-900 dark:to-gray-950">
      <Header />
      
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background blurred circles with more vivid colors and enhanced animation */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-25 blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-25 blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-40 left-1/3 w-96 h-96 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full opacity-15 blur-3xl animate-blob animation-delay-6000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block mb-6 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 p-0.5 dark:from-blue-900/40 dark:to-indigo-900/40 shadow-md">
            <div className="rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-5 py-2">
              <div className="flex items-center">
                <Plane className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Personalized travel planning made easy</span>
              </div>
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Your <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Perfect Journey</span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-300">
            AI-powered itineraries customized to your exact preferences, budget, and travel style
          </p>
          
          <div className="flex justify-center mb-12">
            <a href="#planner">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-7 text-lg font-medium shadow-lg transition-all hover:shadow-blue-500/30 hover:-translate-y-1 group">
                Start Planning
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
          </div>
          
          <div className="mx-auto mb-16 grid max-w-5xl grid-cols-2 gap-5 md:grid-cols-4">
            <div className="flex flex-col items-center rounded-xl bg-white/90 backdrop-blur-sm p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700">
              <div className="mb-3 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 p-3 dark:bg-blue-900/30">
                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-medium">Destination</p>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white/90 backdrop-blur-sm p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700">
              <div className="mb-3 rounded-full bg-gradient-to-r from-indigo-50 to-indigo-100 p-3 dark:bg-indigo-900/30">
                <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="font-medium">Schedule</p>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white/90 backdrop-blur-sm p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700">
              <div className="mb-3 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 p-3 dark:bg-purple-900/30">
                <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="font-medium">Experiences</p>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white/90 backdrop-blur-sm p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700">
              <div className="mb-3 rounded-full bg-gradient-to-r from-rose-50 to-rose-100 p-3 dark:bg-rose-900/30">
                <Utensils className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
              <p className="font-medium">Dining</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <div className="rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 dark:bg-gray-800/70 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <PalmtreeIcon className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                <span>Beach Retreats</span>
              </div>
            </div>
            <div className="rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 dark:bg-gray-800/70 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <Globe className="mr-1.5 h-3.5 w-3.5 text-indigo-500" />
                <span>Cultural Experiences</span>
              </div>
            </div>
            <div className="rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 dark:bg-gray-800/70 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <Camera className="mr-1.5 h-3.5 w-3.5 text-cyan-500" />
                <span>Photo Adventures</span>
              </div>
            </div>
            <div className="rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 dark:bg-gray-800/70 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <MapPin className="mr-1.5 h-3.5 w-3.5 text-rose-500" />
                <span>Hidden Gems</span>
              </div>
            </div>
            <div className="rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 dark:bg-gray-800/70 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <Star className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                <span>Luxury Getaways</span>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-6 left-0 right-0 h-12 bg-gradient-to-t from-white/60 to-transparent dark:from-gray-900/60 backdrop-blur-sm"></div>
        </div>
      </section>
      
      <div id="planner" className="container mx-auto px-4 py-8 pb-20">
        <TravelPlannerForm />
      </div>
    </main>
  )
}
