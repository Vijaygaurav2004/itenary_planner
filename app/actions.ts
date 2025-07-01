"use server"

import { z } from "zod"

// Define the schema for the form data
const formSchema = z.object({
  destination: z.string().min(2, "Destination is required"),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number().min(1, "Budget is required"),
  interests: z.string().optional(),
  travelStyle: z.string().optional(),
  isCollaborative: z.boolean().default(false),
  collaboratorEmails: z.string().optional(),
  inspirationUrl: z.string().optional(),
})

// Define the types for the itinerary data structure
export interface Activity {
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

export interface DayPlan {
  day: number
  date: string
  activities: Activity[]
}

export interface Itinerary {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  days: DayPlan[]
  totalCost: string
  coverImage: string
}

export async function generateItinerary(formData: z.infer<typeof formSchema>): Promise<Itinerary> {
  try {
    // Parse and validate the form data
    const validatedData = formSchema.parse(formData)
    
    // In a real application, you would call an AI service here
    // For now, we'll return a mock itinerary based on the destination
    
    // Format dates
    const startDate = new Date(validatedData.startDate)
    const endDate = new Date(validatedData.endDate)
    
    // Calculate the number of days
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    // Generate a mock itinerary
    const mockItinerary: Itinerary = {
      id: `trip-${Date.now()}`,
      title: `Exploring ${validatedData.destination}`,
      destination: validatedData.destination,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      totalCost: `$${validatedData.budget.toLocaleString()}`,
      coverImage: getCoverImageForDestination(validatedData.destination),
      days: generateMockDays(diffDays, startDate, validatedData.destination)
    }
    
    return mockItinerary
  } catch (error) {
    console.error("Error generating itinerary:", error)
    throw new Error("Failed to generate itinerary. Please try again.")
  }
}

// Helper function to generate mock days for the itinerary
function generateMockDays(numDays: number, startDate: Date, destination: string): DayPlan[] {
  const days: DayPlan[] = []
  
  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    
    days.push({
      day: i + 1,
      date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      activities: generateMockActivities(i + 1, destination)
    })
  }
  
  return days
}

// Helper function to generate mock activities for each day
function generateMockActivities(day: number, destination: string): Activity[] {
  const activities: Activity[] = []
  
  // Morning activity
  activities.push({
    id: `act-${day}-1`,
    time: "09:00",
    title: day === 1 ? `Arrival and Check-in` : `Exploring ${destination} - Day ${day}`,
    description: day === 1 
      ? `Welcome to ${destination}! After checking in to your accommodation, take some time to relax and get settled.` 
      : `Start your day with a delicious breakfast before heading out to explore more of ${destination}.`,
    location: destination,
    type: day === 1 ? "accommodation" : "attraction",
    duration: "2 hours",
    image: `https://source.unsplash.com/random/600x400/?${destination.toLowerCase().replace(/\s+/g, ',')},${day === 1 ? 'hotel' : 'landmark'}`
  })
  
  // Lunch activity
  activities.push({
    id: `act-${day}-2`,
    time: "12:30",
    title: `Lunch at Local Restaurant`,
    description: `Enjoy a delicious meal at one of the popular local restaurants in ${destination}.`,
    location: `${destination} City Center`,
    type: "food",
    duration: "1.5 hours",
    cost: "$20-30",
    rating: 4.5,
    image: `https://source.unsplash.com/random/600x400/?${destination.toLowerCase().replace(/\s+/g, ',')},food,restaurant`
  })
  
  // Afternoon activity
  activities.push({
    id: `act-${day}-3`,
    time: "14:00",
    title: `Visit to ${getRandomAttraction(destination, day)}`,
    description: `Explore one of the most famous attractions in ${destination}.`,
    location: destination,
    type: "attraction",
    duration: "3 hours",
    cost: "$15",
    rating: 4.8,
    image: `https://source.unsplash.com/random/600x400/?${destination.toLowerCase().replace(/\s+/g, ',')},attraction`
  })
  
  // Dinner activity
  activities.push({
    id: `act-${day}-4`,
    time: "19:00",
    title: `Dinner at ${getRandomRestaurant(destination, day)}`,
    description: `End your day with a wonderful dinner experience.`,
    location: `${destination} Downtown`,
    type: "food",
    duration: "2 hours",
    cost: "$30-50",
    rating: 4.7,
    image: `https://source.unsplash.com/random/600x400/?${destination.toLowerCase().replace(/\s+/g, ',')},dinner,restaurant`
  })
  
  return activities
}

// Helper function to get a random attraction name
function getRandomAttraction(destination: string, day: number): string {
  const attractions = [
    `${destination} Historical Museum`,
    `${destination} National Park`,
    `${destination} Art Gallery`,
    `${destination} Cathedral`,
    `${destination} Botanical Gardens`,
    `${destination} Castle`,
    `${destination} Zoo`,
    `${destination} Aquarium`,
    `${destination} Science Center`,
    `Old Town ${destination}`
  ]
  
  return attractions[day % attractions.length]
}

// Helper function to get a random restaurant name
function getRandomRestaurant(destination: string, day: number): string {
  const restaurants = [
    `The ${destination} Kitchen`,
    `${destination} Bistro`,
    `Taste of ${destination}`,
    `${destination} Grill`,
    `${destination} Fine Dining`,
    `Local Flavors`,
    `${destination} Street Food`,
    `${destination} Fusion`,
    `Traditional ${destination}`,
    `${destination} Seafood`
  ]
  
  return restaurants[(day + 3) % restaurants.length]
}

// Helper function to get a cover image for the destination
function getCoverImageForDestination(destination: string): string {
  // In a real application, you would use a more sophisticated method to get relevant images
  return `https://source.unsplash.com/random/1200x800/?${destination.toLowerCase().replace(/\s+/g, ',')},travel,landscape`
}
