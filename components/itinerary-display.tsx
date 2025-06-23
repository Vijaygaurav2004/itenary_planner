"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Utensils, Bed, Bus, Ticket, ArrowLeft, Printer, Share2, MapPin, Info, Clock, AlertCircle, Star, Coffee, ShoppingBag, Camera, Landmark, Sunrise, Sunset, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ItineraryDisplayProps {
  itinerary: string
  onReset: () => void
}

// Helper functions to parse the itinerary text
function extractSection(text: string, startMarker: string, endMarker: string | null): string {
  const startIndex = text.indexOf(startMarker)
  if (startIndex === -1) return ""

  const startWithMarker = startIndex + startMarker.length
  const endIndex = endMarker ? text.indexOf(endMarker, startWithMarker) : text.length

  if (endIndex === -1) return text.substring(startWithMarker)
  return text.substring(startWithMarker, endIndex).trim()
}

function extractDays(text: string): Record<string, string> {
  const days: Record<string, string> = {}
  const dayRegex = /DAY \d+/g
  const dayMatches = [...text.matchAll(dayRegex)]

  dayMatches.forEach((match, index) => {
    const dayTitle = match[0]
    const startIndex = match.index! + dayTitle.length
    const nextMatch = dayMatches[index + 1]
    const endIndex = nextMatch ? nextMatch.index : text.indexOf("ACCOMMODATION", startIndex)

    if (endIndex !== -1) {
      days[dayTitle] = text.substring(startIndex, endIndex).trim()
    } else {
      days[dayTitle] = text.substring(startIndex).trim()
    }
  })

  return days
}

function formatContent(content: string): React.ReactNode {
  if (!content) return <p>No information available</p>

  // Convert markdown-style lists to proper HTML
  const formattedContent = content
    .replace(/\n\n/g, "\n")
    .replace(/\*\s(.*)/g, "• $1")
    .replace(/(\d+\.\s.*)/g, "<strong>$1</strong>")
    .replace(/(.*):(?=\s)/g, "<strong>$1:</strong>")

  return <div dangerouslySetInnerHTML={{ __html: formattedContent.replace(/\n/g, "<br />") }} />
}

function formatContentLine(content: string): React.ReactNode {
  if (!content) return null

  // Convert markdown-style formatting for individual lines
  const formattedContent = content
    .replace(/\*\s(.*)/g, "• $1")
    .replace(/(\d+\.\s.*)/g, "<strong>$1</strong>")
    .replace(/(.*):(?=\s)/g, "<strong>$1:</strong>")

  return <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
}

export function ItineraryDisplay({ itinerary, onReset }: ItineraryDisplayProps) {
  const [activeTab, setActiveTab] = useState("overview")
  
  // Parse the itinerary string into sections
  const sections = {
    overview: extractSection(itinerary, "OVERVIEW", "DAY 1"),
    days: extractDays(itinerary),
    accommodation: extractSection(itinerary, "ACCOMMODATION", "RESTAURANTS"),
    restaurants: extractSection(itinerary, "RESTAURANTS", "TRANSPORTATION"),
    transportation: extractSection(itinerary, "TRANSPORTATION", "ADDITIONAL TIPS"),
    tips: extractSection(itinerary, "ADDITIONAL TIPS", null),
  }
  
  // Extract destination from the overview if available
  const destinationMatch = sections.overview.match(/trip to ([^,.]+)/i)
  const destination = destinationMatch ? destinationMatch[1].trim() : "Your Destination"

  // Extract duration if available
  const durationMatch = sections.overview.match(/(\d+)[\s-]*day/i)
  const duration = durationMatch ? `${durationMatch[1]} days` : null

  const getTimeOfDay = (content: string) => {
    if (content.toLowerCase().includes("morning")) return <Sunrise className="h-4 w-4 text-amber-500" />
    if (content.toLowerCase().includes("afternoon")) return <Sun className="h-4 w-4 text-orange-500" />
    if (content.toLowerCase().includes("evening")) return <Sunset className="h-4 w-4 text-indigo-500" />
    return <Clock className="h-4 w-4 text-blue-500" />
  }

  const getActivityIcon = (content: string) => {
    if (content.toLowerCase().includes("breakfast") || content.toLowerCase().includes("lunch") || content.toLowerCase().includes("dinner")) 
      return <Utensils className="h-4 w-4 text-green-500" />
    if (content.toLowerCase().includes("museum") || content.toLowerCase().includes("gallery") || content.toLowerCase().includes("monument")) 
      return <Landmark className="h-4 w-4 text-purple-500" />
    if (content.toLowerCase().includes("shopping") || content.toLowerCase().includes("market") || content.toLowerCase().includes("store")) 
      return <ShoppingBag className="h-4 w-4 text-pink-500" />
    if (content.toLowerCase().includes("coffee") || content.toLowerCase().includes("café") || content.toLowerCase().includes("cafe")) 
      return <Coffee className="h-4 w-4 text-amber-700" />
    if (content.toLowerCase().includes("photo") || content.toLowerCase().includes("picture") || content.toLowerCase().includes("view")) 
      return <Camera className="h-4 w-4 text-sky-500" />
    return null
  }

  return (
    <Card className="mx-auto max-w-4xl overflow-hidden border-none bg-gradient-to-br from-blue-50 to-indigo-50 shadow-2xl backdrop-blur-sm dark:from-slate-900 dark:to-slate-800 rounded-2xl">
      <CardHeader className="relative overflow-hidden rounded-t-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-white">
        <div className="absolute inset-0 bg-[url('/images/world-map-dots.svg')] opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 flex items-center">
                <div className="mr-3 rounded-full bg-white/30 p-2.5 shadow-inner">
                  <MapPin className="h-6 w-6 text-amber-300" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{destination}</h1>
                {duration && (
                  <Badge variant="secondary" className="ml-3 bg-white/20 text-white px-4 py-1">
                    <Clock className="mr-1 h-3 w-3" />{duration}
                  </Badge>
                )}
              </div>
              <p className="text-blue-100 text-lg">Your personalized travel adventure</p>
            </div>
            <div className="mt-6 flex space-x-3 md:mt-0">
              <Button variant="secondary" size="sm" onClick={onReset} className="bg-white/20 text-white hover:bg-white/30 rounded-full px-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                New Trip
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/20 text-white hover:bg-white/30 rounded-full px-4">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/20 text-white hover:bg-white/30 rounded-full px-4">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-white/50 p-1.5 rounded-xl dark:bg-slate-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700 rounded-lg">
              <Info className="mr-2 h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="days" className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700 rounded-lg">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Daily Plan</span>
            </TabsTrigger>
            <TabsTrigger value="accommodation" className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700 rounded-lg">
              <Bed className="mr-2 h-4 w-4" />
              <span>Stays</span>
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700 rounded-lg">
              <Utensils className="mr-2 h-4 w-4" />
              <span>Food</span>
            </TabsTrigger>
            <TabsTrigger value="transportation" className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700 rounded-lg">
              <Bus className="mr-2 h-4 w-4" />
              <span>Transport</span>
            </TabsTrigger>
            <TabsTrigger value="tips" className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700 rounded-lg">
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>Tips</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 animate-fadeIn">
            <Card className="bg-white/90 shadow-md border-0 rounded-xl dark:bg-slate-800/90">
              <CardContent className="p-8">
                <div className="prose prose-blue dark:prose-invert max-w-none">{formatContent(sections.overview)}</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="days" className="mt-6 animate-fadeIn">
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(sections.days).map(([day, content]) => (
                <AccordionItem key={day} value={day} className="border rounded-xl mb-4 bg-white/90 dark:bg-slate-800/90 overflow-hidden shadow-md">
                  <AccordionTrigger className="text-lg font-medium px-6 py-4 hover:bg-blue-50 dark:hover:bg-slate-700/60 transition-colors">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-lg font-semibold">{day}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <Card className="border-0 shadow-none">
                      <CardContent className="p-0">
                        <div className="p-6 divide-y divide-gray-100 dark:divide-slate-700">
                          {content.split('\n').filter(line => line.trim()).map((line, index) => {
                            const timeMatch = line.match(/^(\d{1,2}:\d{2}(am|pm|AM|PM)?)/);
                            
                            return (
                              <div key={index} className="py-4 px-3 first:pt-1">
                                <div className="flex">
                                  {timeMatch ? (
                                    <div className="mr-4 flex-shrink-0 w-20 text-sm font-medium text-gray-500 dark:text-gray-400">
                                      <div className="flex items-center">
                                        {getTimeOfDay(line)}
                                        <span className="ml-1.5">{timeMatch[1]}</span>
                                      </div>
                                    </div>
                                  ) : null}
                                  
                                  <div className="flex-grow">
                                    <div className="flex items-start">
                                      {getActivityIcon(line) && (
                                        <span className="mr-3 mt-0.5 bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-full">{getActivityIcon(line)}</span>
                                      )}
                                      <div className="prose-sm dark:prose-invert max-w-none">
                                        {formatContentLine(line.replace(timeMatch?.[0] || '', '').trim())}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="accommodation" className="mt-6 animate-fadeIn">
            <Card className="overflow-hidden bg-white/90 shadow-md border-0 rounded-xl dark:bg-slate-800/90">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/70 dark:from-slate-700/30 dark:to-slate-700/50 pb-4 pt-5">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                    <Bed className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Recommended Accommodations</h3>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose dark:prose-invert max-w-none">
                  {formatContent(sections.accommodation)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restaurants" className="mt-6 animate-fadeIn">
            <Card className="overflow-hidden bg-white/90 shadow-md border-0 rounded-xl dark:bg-slate-800/90">
              <CardHeader className="bg-gradient-to-r from-rose-50 to-rose-100/70 dark:from-slate-700/30 dark:to-slate-700/50 pb-4 pt-5">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30 mr-3">
                    <Utensils className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Where to Eat</h3>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose dark:prose-invert max-w-none">
                  {formatContent(sections.restaurants)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transportation" className="mt-6 animate-fadeIn">
            <Card className="overflow-hidden bg-white/90 shadow-md border-0 rounded-xl dark:bg-slate-800/90">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/70 dark:from-slate-700/30 dark:to-slate-700/50 pb-4 pt-5">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mr-3">
                    <Bus className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Getting Around</h3>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose dark:prose-invert max-w-none">
                  {formatContent(sections.transportation)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="mt-6 animate-fadeIn">
            <Card className="overflow-hidden bg-white/90 shadow-md border-0 rounded-xl dark:bg-slate-800/90">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100/70 dark:from-slate-700/30 dark:to-slate-700/50 pb-4 pt-5">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mr-3">
                    <AlertCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Travel Tips</h3>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose dark:prose-invert max-w-none">
                  {formatContent(sections.tips)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t bg-white/70 p-5 text-center text-sm text-muted-foreground dark:bg-slate-800/50">
        <div className="mx-auto flex items-center justify-center">
          <Star className="mr-1.5 h-4 w-4 text-amber-500" />
          <span>AI-generated itinerary based on your preferences</span>
        </div>
      </CardFooter>
    </Card>
  )
}
