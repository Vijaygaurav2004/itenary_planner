"use server"

import { z } from "zod"
import { generateItineraryWithPerplexity, PerplexityRequest } from "@/lib/perplexity-api"
import { formatItineraryWithChatGPT, ChatGPTRequest } from "@/lib/chatgpt-api"

// Define the schema for the form data
const formSchema = z.object({
  destination: z.string().min(2, "Destination is required"),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  budget: z.number().min(1, "Budget is required"),
  interests: z.string().optional(),
  travelStyle: z.string().optional(),
  isCollaborative: z.boolean().default(false),
  collaboratorEmails: z.string().optional(),
  inspirationUrl: z.string().optional(),
  groupSize: z.number().optional(),
  ageGroups: z.array(z.string()).optional(),
  groupType: z.string().optional(),
  accommodationType: z.string().optional(),
  accommodationTypeSelect: z.string().optional(),
  roomConfig: z.string().optional(),
  rentalCarNeeds: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  foodPreferences: z.string().optional(),
  localFoodInterest: z.boolean().optional(),
  internationalFoodInterest: z.boolean().optional(),
  spendingPriority: z.string().optional(),
  mustVisit: z.string().optional(),
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
  htmlContent?: string // Added field for formatted HTML content
}

export async function generateItinerary(formData: z.infer<typeof formSchema>): Promise<Itinerary> {
  try {
    // Parse and validate the form data
    const validatedData = formSchema.parse(formData)
    
    // Check if we should use the Perplexity API or fallback to mock data
    const usePerplexity = process.env.USE_PERPLEXITY_API === 'true' && process.env.PERPLEXITY_API_KEY;
    
    let itinerary: Itinerary;
    
    if (usePerplexity) {
      // Prepare the request for Perplexity API
      const perplexityRequest: PerplexityRequest = {
        destination: validatedData.destination,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        budget: validatedData.budget,
        interests: validatedData.interests || "",
        travelStyle: validatedData.travelStyle || "",
        groupSize: validatedData.groupSize,
        accommodationType: validatedData.accommodationTypeSelect || validatedData.accommodationType,
        roomConfig: validatedData.roomConfig,
        rentalCarNeeds: validatedData.rentalCarNeeds,
        accessibilityNeeds: validatedData.accessibilityNeeds,
        dietaryRestrictions: validatedData.dietaryRestrictions,
        foodPreferences: validatedData.foodPreferences,
        localFoodInterest: validatedData.localFoodInterest,
        internationalFoodInterest: validatedData.internationalFoodInterest,
        spendingPriority: validatedData.spendingPriority,
        mustVisit: validatedData.mustVisit
      };
      
      try {
        // Generate itinerary using Perplexity API
        console.log("Generating itinerary with Perplexity API...");
        itinerary = await generateItineraryWithPerplexity(perplexityRequest);
        console.log("Successfully generated itinerary with Perplexity API");
      } catch (error) {
        console.error("Error using Perplexity API:", error);
        console.log("Falling back to mock data due to Perplexity API error");
        
        // Fall back to mock data if Perplexity API fails
        itinerary = generateMockItinerary(validatedData);
      }
    } else {
      console.log("Using mock data - Perplexity API is not enabled");
      
      // Use mock data
      itinerary = generateMockItinerary(validatedData);
    }
    
    // Check if we should use ChatGPT to format the itinerary
    const useChatGPT = process.env.USE_CHATGPT_API === 'true' && process.env.OPENAI_API_KEY;
    
    if (useChatGPT) {
      try {
        console.log("Formatting itinerary with ChatGPT");
        
        // Prepare the request for ChatGPT API
        const chatGPTRequest: ChatGPTRequest = {
          itinerary: itinerary
        };
        
        // Format the itinerary using ChatGPT
        const formattedResult = await formatItineraryWithChatGPT(chatGPTRequest);
        
        // Update the itinerary with the formatted content
        itinerary = {
          ...formattedResult.formattedItinerary,
          htmlContent: formattedResult.htmlContent
        };
      } catch (error) {
        console.error("Error formatting itinerary with ChatGPT:", error);
        // Continue with the unformatted itinerary
      }
    }
    
    return itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error)
    throw new Error("Failed to generate itinerary. Please try again.")
  }
}

// Helper function to generate a mock itinerary
function generateMockItinerary(validatedData: z.infer<typeof formSchema>): Itinerary {
  // Format dates
  const startDate = validatedData.startDate ? new Date(validatedData.startDate) : new Date();
  const endDate = validatedData.endDate ? new Date(validatedData.endDate) : new Date(startDate);
  
  if (validatedData.endDate === null) {
    // If no end date, set it to start date + 3 days
    endDate.setDate(startDate.getDate() + 3);
  }
  
  // Calculate the number of days
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Ensure at least 1 day
  
  // Generate a mock itinerary with more detailed information
  return {
    id: `trip-${Date.now()}`,
    title: `Exploring ${validatedData.destination}: A ${diffDays}-Day Adventure`,
    destination: validatedData.destination,
    startDate: validatedData.startDate || new Date().toISOString(),
    endDate: validatedData.endDate || endDate.toISOString(),
    totalCost: `₹${validatedData.budget.toLocaleString()}`,
    coverImage: `https://source.unsplash.com/random/1200x800/?${validatedData.destination.toLowerCase().replace(/\s+/g, ',')},skyline,landscape`,
    days: generateDetailedMockDays(diffDays, startDate, validatedData)
  };
}

// Helper function to generate detailed mock days for the itinerary
function generateDetailedMockDays(numDays: number, startDate: Date, validatedData: z.infer<typeof formSchema>): DayPlan[] {
  const days: DayPlan[] = []
  const destination = validatedData.destination;
  const accommodationType = validatedData.accommodationType || "hotel";
  const groupSize = validatedData.groupSize || 1;
  
  // Generate mock accommodation options
  const accommodations = [
    {
      name: `Luxury ${destination} Resort & Spa`,
      location: `Central ${destination}, near main attractions`,
      price: `₹${Math.floor(Math.random() * 5000 + 8000)} per night`,
      rating: 4.9,
      amenities: "Pool, Spa, Restaurant, Free WiFi, Fitness Center",
      image: `https://source.unsplash.com/random/600x400/?luxury,hotel,resort`
    },
    {
      name: `${destination} Boutique Homestay`,
      location: `${destination} Old Town, walking distance to markets`,
      price: `₹${Math.floor(Math.random() * 3000 + 5000)} per night`,
      rating: 4.7,
      amenities: "Free Breakfast, Garden, Terrace, Free WiFi",
      image: `https://source.unsplash.com/random/600x400/?boutique,hotel`
    },
    {
      name: `${destination} Central Apartments`,
      location: `Downtown ${destination}, close to shopping and dining`,
      price: `₹${Math.floor(Math.random() * 2000 + 3000)} per night`,
      rating: 4.5,
      amenities: "Kitchen, Washing Machine, Free Parking, Air Conditioning",
      image: `https://source.unsplash.com/random/600x400/?apartment,modern`
    }
  ];
  
  // Select accommodation based on preferences
  let selectedAccommodation;
  if (accommodationType.includes("airbnb") || accommodationType.includes("apartment")) {
    selectedAccommodation = accommodations[2];
  } else if (accommodationType.includes("boutique") || accommodationType.includes("homestay")) {
    selectedAccommodation = accommodations[1];
  } else {
    selectedAccommodation = accommodations[0];
  }
  
  // Generate restaurants based on food preferences
  const restaurants = [
    {
      name: `${destination} Traditional Cuisine`,
      cuisine: validatedData.foodPreferences || "Local cuisine",
      price: `₹${Math.floor(Math.random() * 500 + 800)} for ${groupSize}`,
      rating: 4.8,
      image: `https://source.unsplash.com/random/600x400/?traditional,food,restaurant`
    },
    {
      name: `Fusion Flavors of ${destination}`,
      cuisine: "International fusion with local ingredients",
      price: `₹${Math.floor(Math.random() * 800 + 1200)} for ${groupSize}`,
      rating: 4.6,
      image: `https://source.unsplash.com/random/600x400/?fusion,food,restaurant`
    },
    {
      name: `${destination} Street Food Market`,
      cuisine: "Local street food and specialties",
      price: `₹${Math.floor(Math.random() * 300 + 500)} for ${groupSize}`,
      rating: 4.7,
      image: `https://source.unsplash.com/random/600x400/?street,food,market`
    }
  ];
  
  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const dayActivities = [];
    
    // First day: Add check-in activity
    if (i === 0) {
      dayActivities.push({
        id: `act-${i+1}-1`,
        time: "14:00",
        title: `Check-in at ${selectedAccommodation.name}`,
        description: `Arrive at your ${accommodationType} and get settled in for your stay. ${selectedAccommodation.name} offers ${selectedAccommodation.amenities} to ensure a comfortable experience. The property is located in ${selectedAccommodation.location}, making it an ideal base for your exploration.`,
        location: selectedAccommodation.location,
        type: "accommodation" as const,
        duration: "1 hour",
        cost: selectedAccommodation.price,
        rating: selectedAccommodation.rating,
        image: selectedAccommodation.image,
        notes: `Early check-in may be available upon request. The property has a rating of ${selectedAccommodation.rating}/5 from previous guests.`
      });
    }
    
    // Morning activity
    dayActivities.push({
      id: `act-${i+1}-${dayActivities.length + 1}`,
      time: "09:00",
      title: getRandomAttraction(destination, i, "morning"),
      description: `Start your day exploring one of ${destination}'s most remarkable attractions. This location offers stunning views and a fascinating glimpse into the local culture and history. Perfect for morning visits when the crowds are smaller and the lighting is ideal for photos.`,
      location: `${getRandomLocation(destination, i)}, ${destination}`,
      type: "attraction" as const,
      duration: "3 hours",
      cost: `₹${Math.floor(Math.random() * 300 + 200)} per person`,
      rating: 4.7,
      image: `https://source.unsplash.com/random/600x400/?${destination.toLowerCase().replace(/\s+/g, ',')},attraction,morning`,
      notes: "Wear comfortable walking shoes and bring a camera. Local guides are available for hire at the entrance."
    });
    
    // Lunch activity
    dayActivities.push({
      id: `act-${i+1}-${dayActivities.length + 1}`,
      time: "12:30",
      title: `Lunch at ${restaurants[i % restaurants.length].name}`,
      description: `Enjoy a delicious meal featuring ${restaurants[i % restaurants.length].cuisine}. The restaurant is known for its authentic flavors and welcoming atmosphere. Try their signature dishes which incorporate fresh, local ingredients from the region.`,
      location: `Central ${destination}, near ${getRandomLocation(destination, i+1)}`,
      type: "food" as const,
      duration: "1.5 hours",
      cost: restaurants[i % restaurants.length].price,
      rating: restaurants[i % restaurants.length].rating,
      image: restaurants[i % restaurants.length].image,
      notes: validatedData.dietaryRestrictions ? `They offer excellent options for ${validatedData.dietaryRestrictions} diets.` : "Reservations recommended during peak hours."
    });
    
    // Afternoon activity
    dayActivities.push({
      id: `act-${i+1}-${dayActivities.length + 1}`,
      time: "14:30",
      title: getRandomAttraction(destination, i+2, "afternoon"),
      description: `Experience the beauty and excitement of this popular ${destination} attraction. The area features stunning natural scenery and opportunities for both relaxation and adventure. It's a must-visit location that showcases the unique character of the region.`,
      location: `${getRandomLocation(destination, i+2)}, ${destination}`,
      type: "attraction" as const,
      duration: "3 hours",
      cost: `₹${Math.floor(Math.random() * 400 + 300)} per person`,
      rating: 4.8,
      image: `https://source.unsplash.com/random/600x400/?${destination.toLowerCase().replace(/\s+/g, ',')},attraction,afternoon`,
      notes: "This attraction is particularly beautiful in the afternoon light. Don't miss the viewpoint at the northern end."
    });
    
    // Dinner activity
    dayActivities.push({
      id: `act-${i+1}-${dayActivities.length + 1}`,
      time: "19:00",
      title: `Dinner at ${getRandomRestaurant(destination, i)}`,
      description: `End your day with a wonderful dining experience at one of ${destination}'s finest restaurants. The menu features a blend of traditional and contemporary dishes that showcase the region's culinary heritage. The ambiance is perfect for a relaxing evening meal.`,
      location: `${getRandomLocation(destination, i+3)}, ${destination}`,
      type: "food" as const,
      duration: "2 hours",
      cost: `₹${Math.floor(Math.random() * 600 + 800)} for ${groupSize} people`,
      rating: 4.6,
      image: `https://source.unsplash.com/random/600x400/?${destination.toLowerCase().replace(/\s+/g, ',')},restaurant,dinner`,
      notes: validatedData.localFoodInterest ? "Known for authentic local cuisine prepared using traditional methods." : "Offers a diverse menu with international options."
    });
    
    // Last day: Add check-out activity
    if (i === numDays - 1) {
      dayActivities.push({
        id: `act-${i+1}-${dayActivities.length + 1}`,
        time: "11:00",
        title: `Check-out from ${selectedAccommodation.name}`,
        description: `Complete your stay at ${selectedAccommodation.name} and prepare for departure. Take time to ensure you've collected all your belongings and settle any outstanding charges. The property offers luggage storage if you have a later flight or train.`,
        location: selectedAccommodation.location,
        type: "accommodation" as const,
        duration: "1 hour",
        cost: "₹0",
        rating: selectedAccommodation.rating,
        image: selectedAccommodation.image,
        notes: "Late check-out may be available upon request, subject to availability and possibly an additional fee."
      });
    }
    
    days.push({
      day: i + 1,
      date: currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
      activities: dayActivities
    });
  }
  
  return days;
}

// Helper function to get a random attraction name with more variety
function getRandomAttraction(destination: string, day: number, timeOfDay: string): string {
  const morningAttractions = [
    `${destination} Historical Museum`,
    `${destination} Botanical Gardens`,
    `${destination} Heritage Walk`,
    `${destination} Cultural Center`,
    `Sunrise View at ${destination} Lookout`,
    `${destination} Morning Market Tour`,
    `Old Town ${destination} Walking Tour`,
    `${destination} Art Gallery`,
    `${destination} Wildlife Sanctuary Morning Safari`,
    `${destination} Temple Complex`
  ];
  
  const afternoonAttractions = [
    `${destination} Adventure Park`,
    `${destination} National Park`,
    `${destination} Beach Club`,
    `${destination} Shopping District`,
    `${destination} Castle`,
    `${destination} Zoo`,
    `${destination} Aquarium`,
    `${destination} Science Center`,
    `${destination} Craft Village`,
    `${destination} River Cruise`
  ];
  
  const attractions = timeOfDay === "morning" ? morningAttractions : afternoonAttractions;
  
  return attractions[day % attractions.length];
}

// Helper function to get a random restaurant name with more variety
function getRandomRestaurant(destination: string, day: number): string {
  const restaurants = [
    `The ${destination} Kitchen`,
    `${destination} Bistro`,
    `Taste of ${destination}`,
    `${destination} Grill`,
    `${destination} Fine Dining`,
    `Local Flavors of ${destination}`,
    `${destination} Street Food Fusion`,
    `${destination} Terrace Restaurant`,
    `Traditional ${destination} Cuisine`,
    `${destination} Seafood & Grill`
  ];
  
  return restaurants[(day + 3) % restaurants.length];
}

// Helper function to get a random location within the destination
function getRandomLocation(destination: string, seed: number): string {
  const locations = [
    "Downtown",
    "Old Town",
    "Cultural District",
    "Riverside",
    "Harbor Area",
    "Central Plaza",
    "Historic Quarter",
    "Arts District",
    "Market Square",
    "Waterfront"
  ];
  
  return locations[seed % locations.length];
}

// Helper function to get a cover image for the destination
function getCoverImageForDestination(destination: string): string {
  // In a real application, you would use a more sophisticated method to get relevant images
  return `https://source.unsplash.com/random/1200x800/?${destination.toLowerCase().replace(/\s+/g, ',')},travel,landscape`
}
