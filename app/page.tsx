"use client";

import { useState } from "react";
import { TravelPlannerForm } from "@/components/travel-planner-form";
import { Header } from "@/components/header";
import ChatBox from "@/components/ChatBox"; // Chat UI component
import {
  MapPin,
  Calendar,
  Briefcase,
  Utensils,
  Plane,
  PalmtreeIcon,
  Camera,
  Globe,
  Star,
  ArrowRight,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[url('/images/world-map-dots.svg')] bg-fixed bg-no-repeat bg-cover bg-center dark:bg-[url('/images/world-map-dots-dark.svg')] dark:from-gray-900 dark:to-gray-950">
      <Header />

      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background blurred circles */}
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
                <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Personalized travel planning made easy
                </span>
              </div>
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Perfect Journey
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-300">
            AI-powered itineraries customized to your exact preferences, budget,
            and travel style
          </p>

          <div className="flex justify-center mb-12">
            <a href="#planner">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-7 text-lg font-medium shadow-lg transition-all hover:shadow-blue-500/30 hover:-translate-y-1 group"
              >
                Start Planning
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
          </div>

          <div className="mx-auto mb-16 grid max-w-5xl grid-cols-2 gap-5 md:grid-cols-4">
            {[
              {
                icon: (
                  <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                ),
                label: "Destination",
              },
              {
                icon: (
                  <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                ),
                label: "Schedule",
              },
              {
                icon: (
                  <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                ),
                label: "Experiences",
              },
              {
                icon: (
                  <Utensils className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                ),
                label: "Dining",
              },
            ].map(({ icon, label }, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-xl bg-white/90 backdrop-blur-sm p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700"
              >
                <div className="mb-3 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 p-3 dark:bg-blue-900/30">
                  {icon}
                </div>
                <p className="font-medium">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {[
              {
                icon: PalmtreeIcon,
                text: "Beach Retreats",
                color: "text-amber-500",
              },
              {
                icon: Globe,
                text: "Cultural Experiences",
                color: "text-indigo-500",
              },
              {
                icon: Camera,
                text: "Photo Adventures",
                color: "text-cyan-500",
              },
              { icon: MapPin, text: "Hidden Gems", color: "text-rose-500" },
              { icon: Star, text: "Luxury Getaways", color: "text-amber-500" },
            ].map(({ icon: Icon, text, color }, i) => (
              <div
                key={i}
                className="rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 dark:bg-gray-800/70 dark:text-gray-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center">
                  <Icon className={`mr-1.5 h-3.5 w-3.5 ${color}`} />
                  <span>{text}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute -bottom-6 left-0 right-0 h-12 bg-gradient-to-t from-white/60 to-transparent dark:from-gray-900/60 backdrop-blur-sm"></div>
        </div>
      </section>

      <div id="planner" className="container mx-auto px-4 py-8 pb-20">
        <TravelPlannerForm />
      </div>

      {/* ChatBox with close button */}
      {chatOpen && <ChatBox onClose={() => setChatOpen(false)} />}

      {/* Floating Chatbot Button */}
      {!chatOpen && (
        <button
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1"
          aria-label="Chatbot"
          onClick={() => setChatOpen(true)}
        >
          <Bot className="w-6 h-6" />
        </button>
      )}
    </main>
  );
}
