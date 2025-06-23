"use server"

import { z } from "zod"

const formSchema = z.object({
  // Destination & Dates
  destination: z.string().min(2, {
    message: "Destination must be at least 2 characters.",
  }),
  startDate: z.date(),
  endDate: z.date(),
  
  // Budget
  totalBudget: z.string().optional(),
  budgetType: z.enum(["budget", "mid-range", "luxury"]),
  spendingPriorities: z.string().optional(),
  
  // Travel Preferences
  interests: z.array(z.string()).min(1, {
    message: "Select at least one interest.",
  }),
  foodPreferences: z.string().optional(),
  travelPace: z.enum(["relaxed", "moderate", "packed"]),
  customPace: z.string().optional(),
  
  // Accommodation
  accommodation: z.enum(["hotel", "hostel", "airbnb", "any"]),
  accommodationLocation: z.string().optional(),
  
  // Transportation
  transportation: z.array(z.string()).min(1, {
    message: "Select at least one transportation option.",
  }),
  arrivalDetails: z.string().optional(),
  departureDetails: z.string().optional(),
  
  // Personal Details
  travelerProfile: z.enum(["solo", "couple", "family", "group"]),
  numberOfTravelers: z.number().min(1),
  ageGroups: z.array(z.string()).optional(),
  specialRequirements: z.string().optional(),
  openaiApiKey: z.string().optional(),
  
  // Must-Have Experiences
  specificActivities: z.string().optional(),
  mustVisitPlaces: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export async function generateItinerary(data: FormValues): Promise<string> {
  try {
    // Validate the input data
    formSchema.parse(data)
    
    // Calculate trip duration
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)
    const tripDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // Validate trip duration
    if (tripDuration < 1) {
      throw new Error("Trip duration must be at least 1 day")
    }
    
    if (tripDuration > 30) {
      throw new Error("Trip duration cannot exceed 30 days due to API limitations")
    }

    // Format dates for the prompt
    const formatDate = (date: Date) =>
      date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })

    // Construct the prompt for Perplexity
    const prompt = `
      Create a detailed travel itinerary for a trip to ${data.destination}.
      
      TRAVELER DETAILS:
      - Profile: ${data.travelerProfile}
      - Number of travelers: ${data.numberOfTravelers}
      ${data.ageGroups && data.ageGroups.length > 0 ? `- Age groups: ${data.ageGroups.join(", ")}` : ""}
      ${data.specialRequirements ? `- Special needs: ${data.specialRequirements}` : ""}
      
      TRIP DETAILS:
      - Dates: ${formatDate(startDate)} to ${formatDate(endDate)} (${tripDuration} days)
      ${data.arrivalDetails ? `- Arrival: ${data.arrivalDetails}` : ""}
      ${data.departureDetails ? `- Departure: ${data.departureDetails}` : ""}
      
      BUDGET:
      - Budget type: ${data.budgetType}
      ${data.totalBudget ? `- Total budget: ${data.totalBudget}` : ""}
      ${data.spendingPriorities ? `- Spending priorities: ${data.spendingPriorities}` : ""}
      
      PREFERENCES:
      - Interests: ${data.interests.join(", ")}
      - Food: ${data.foodPreferences || "No specific preferences"}
      - Travel pace: ${data.travelPace}
      ${data.customPace ? `- Custom pace: ${data.customPace}` : ""}
      
      ACCOMMODATION:
      - Type: ${data.accommodation}
      ${data.accommodationLocation ? `- Preferred location: ${data.accommodationLocation}` : ""}
      
      TRANSPORTATION:
      - Preferred modes: ${data.transportation.join(", ")}
      
      MUST-HAVE EXPERIENCES:
      ${data.specificActivities ? `- Activities: ${data.specificActivities}` : ""}
      ${data.mustVisitPlaces ? `- Places to visit: ${data.mustVisitPlaces}` : ""}
      
      Please provide a comprehensive itinerary with the following sections:
      
      1. OVERVIEW: A brief summary of the trip with the destination highlights and overall experience.
      
      2. DAY-BY-DAY ITINERARY: Detailed plan for each day (DAY 1, DAY 2, etc.) with:
         - Morning activities
         - Lunch recommendations
         - Afternoon activities
         - Evening plans and dinner options
         - Estimated timing for each activity
      
      3. ACCOMMODATION: Recommended places to stay based on preferences, with:
         - Names of specific accommodations
         - Brief descriptions and key features
         - Approximate price range
         - Neighborhood information
      
      4. RESTAURANTS: Recommended places to eat matching food preferences, with:
         - Mix of popular and hidden gem restaurants
         - Cuisine specialties
         - Price ranges
         - Any must-try dishes
      
      5. TRANSPORTATION: How to get around, with:
         - Best ways to travel between attractions
         - Tips for local transportation
         - Any transportation passes or deals
      
      6. ADDITIONAL TIPS: Useful information including:
         - Local customs and etiquette
         - Weather considerations
         - Safety tips
         - Money-saving advice
         - Off-the-beaten-path recommendations
      
      Format the response with clear section headers and bullet points for easy reading.
    `

    let initialItinerary = '';

    // First, get data from Perplexity API
    if (!process.env.PERPLEXITY_API_KEY) {
      console.error("Perplexity API key is not set")
      throw new Error("API key configuration error")
    }

    // Call Perplexity API to get initial research
    const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar-deep-research",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!perplexityResponse.ok) {
      const errorData = await perplexityResponse.json().catch(() => null)
      console.error("Perplexity API error:", errorData || perplexityResponse.statusText)
      
      // Handle different error types
      if (perplexityResponse.status === 401) {
        throw new Error("Invalid API key. Please check your configuration.")
      } else if (perplexityResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.")
      } else {
        throw new Error(`API error: ${perplexityResponse.status} - ${perplexityResponse.statusText}`)
      }
    }

    const perplexityResult = await perplexityResponse.json()
    
    // Validate response format
    if (!perplexityResult.choices || !perplexityResult.choices[0] || !perplexityResult.choices[0].message || !perplexityResult.choices[0].message.content) {
      console.error("Invalid response format from Perplexity API:", perplexityResult)
      throw new Error("Received invalid response format from AI service")
    }
    
    initialItinerary = perplexityResult.choices[0].message.content;
    
    // If OpenAI API key is provided or use default test key, enhance the itinerary with ChatGPT
    const openaiApiKey = data.openaiApiKey; // Default test key
    if (openaiApiKey) {
      // Construct the ChatGPT prompt to enhance the Perplexity data
      const enhancementPrompt = `
        I'd like you to enhance and redesign this travel itinerary to make it more engaging, vibrant, and personalized.
        
        The original itinerary from Perplexity is below:
        
        ${initialItinerary}
        
        Please improve this itinerary with:
        
        1. More immersive descriptions of attractions and experiences
        2. More authentic local insights and hidden gems
        3. Highly personalized recommendations based on the traveler profile: ${data.travelerProfile}
        4. Better organization with clear headings and a more visual-friendly format
        5. Add time estimates that match the preferred pace: ${data.travelPace}
        6. Ensure all restaurant recommendations have distinctive qualities and match the food preferences
        7. Include memorable photo opportunities and Instagram-worthy spots
        8. Add cultural context that enriches the experience
        
        Keep the same overall structure with the sections: OVERVIEW, DAY-BY-DAY ITINERARY, ACCOMMODATION, RESTAURANTS, TRANSPORTATION, and ADDITIONAL TIPS.
        
        Make the final itinerary visually organized, easy to follow, and inspiring!
      `;
      
      // Call OpenAI API for enhanced itinerary
      try {
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are a travel design expert who creates beautiful, engaging, and well-structured travel itineraries that feel personalized and inspiring."
              },
              {
                role: "user",
                content: enhancementPrompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 4000,
          }),
        });
        
        if (!openaiResponse.ok) {
          console.error("OpenAI API error:", openaiResponse.status, openaiResponse.statusText);
          // If OpenAI fails, we'll just return the Perplexity result
          return initialItinerary;
        }
        
        const openaiResult = await openaiResponse.json();
        
        if (openaiResult.choices && openaiResult.choices[0] && openaiResult.choices[0].message && openaiResult.choices[0].message.content) {
          return openaiResult.choices[0].message.content;
        } else {
          // If we can't parse OpenAI result, return the Perplexity result
          return initialItinerary;
        }
      } catch (openaiError) {
        console.error("Error with OpenAI processing:", openaiError);
        // Return the Perplexity result if OpenAI fails
        return initialItinerary;
      }
    } else {
      // If no OpenAI API key, just return the Perplexity result
      return initialItinerary;
    }
  } catch (error) {
    console.error("Error generating itinerary:", error)
    
    // Return user-friendly error message
    if (error instanceof z.ZodError) {
      return "Invalid input data. Please check your travel details and try again."
    } else if (error instanceof Error) {
      return `Sorry, we couldn't generate your itinerary: ${error.message}`
    }
    
    return "Sorry, we couldn't generate your itinerary at this time. Please try again later."
  }
}
