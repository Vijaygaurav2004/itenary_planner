import { Itinerary } from "@/app/actions";

export interface PerplexityRequest {
  destination: string;
  startDate: string | null;
  endDate: string | null;
  budget: number;
  interests: string;
  travelStyle: string;
  groupSize?: number;
  accommodationType?: string;
  rentalCarNeeds?: string;
  accessibilityNeeds?: string;
  mustVisit?: string;
  roomConfig?: string;
  dietaryRestrictions?: string;
  foodPreferences?: string;
  localFoodInterest?: boolean;
  internationalFoodInterest?: boolean;
  spendingPriority?: string;
  [key: string]: any; // Allow for additional properties
}

export async function generateItineraryWithPerplexity(
  request: PerplexityRequest
): Promise<Itinerary> {
  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      throw new Error("Perplexity API key is not defined in environment variables");
    }

    // Format the prompt for Perplexity API
    const prompt = formatPromptForPerplexity(request);

    // Call Perplexity API
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "sonar-deep-research",
        messages: [
          {
            role: "system",
            content: "You are a meticulous travel-planning assistant that ONLY returns valid JSON. Your response MUST be a complete, valid JSON object with no text before or after. Do not use markdown code blocks. Do not include explanations. You MUST include ALL days in the date range, not just some days. You MUST provide specific accommodation recommendations with names, prices, and ratings. You MUST include working image URLs for all activities and the cover image. You MUST provide detailed descriptions (2-3 sentences minimum) for each activity. All monetary values must include the ₹ symbol and be realistic and sum to no more than \"budgetINR\". Each activity must include fields: id, time (HH:MM), title, description, location, type, duration, cost, rating, image, notes. Do NOT invent fields or omit required fields. Obey the field names and data types in the schema precisely. Ensure all JSON is properly formatted with no trailing commas or syntax errors."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Parse the response content which should be a JSON string
    try {
      // Extract the JSON from the response
      const content = data.choices[0].message.content;
      console.log("Raw Perplexity response:", content);
      
      // Try different approaches to extract valid JSON
      let parsedItinerary;
      
      // First, try to parse the entire content as JSON
      try {
        parsedItinerary = JSON.parse(content);
        console.log("Successfully parsed entire content as JSON");
      } catch (e) {
        console.log("Could not parse entire content as JSON, trying to extract JSON object");
        
        // Remove any thinking or non-JSON content
        const cleanedContent = cleanPerplexityResponse(content);
        console.log("Cleaned content for JSON extraction");
        
        // Try to extract JSON object using regex
        const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error("No JSON object found in the response");
          throw new Error("No valid JSON found in the response");
        }
        
        try {
          // Clean up potential issues in the JSON string
          let jsonStr = jsonMatch[0];
          
          // Fix common JSON formatting issues
          // Replace unescaped quotes within string values
          jsonStr = jsonStr.replace(/: "([^"]*)"/g, (match: string) => {
            return match.replace(/(?<=: ")(.*)(?=")/g, (str: string) => {
              return str.replace(/"/g, '\\"');
            });
          });
          
          // Fix trailing commas in arrays and objects
          jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');
          
          console.log("Attempting to parse extracted and cleaned JSON");
          parsedItinerary = JSON.parse(jsonStr);
        } catch (jsonError) {
          console.error("Failed to parse extracted JSON:", jsonError);
          
          // Last resort: try to manually fix the JSON by removing problematic parts
          try {
            console.log("Attempting more aggressive JSON cleanup");
            // Log the first 500 characters of the JSON for debugging
            console.log("JSON extract (first 500 chars):", jsonMatch[0].substring(0, 500));
            
            // Create a simplified version of the itinerary with minimal required fields
            throw new Error("Could not parse the JSON response after cleanup attempts");
          } catch (finalError) {
            console.error("All JSON parsing attempts failed");
            throw finalError;
          }
        }
      }
      
      // Validate and format the response to match our Itinerary interface
      return formatPerplexityResponse(parsedItinerary, request);
    } catch (error) {
      console.error("Error parsing Perplexity response:", error);
      
      // Create a fallback itinerary with minimal data
      const fallbackItinerary: Itinerary = {
        id: `trip-fallback-${Date.now()}`,
        title: `Trip to ${request.destination}`,
        destination: request.destination,
        startDate: request.startDate || "",
        endDate: request.endDate || "",
        totalCost: `₹${request.budget}`,
        coverImage: `https://source.unsplash.com/random/1200x800/?${request.destination.toLowerCase().replace(/\s+/g, ',')},travel,landscape`,
        days: []
      };
      
      // Add a note about the error
      console.log("Using fallback itinerary due to parsing error");
      throw new Error("Failed to parse the generated itinerary. Please try again.");
    }
  } catch (error) {
    console.error("Error calling Perplexity API:", error);
    throw error;
  }
}

function formatPromptForPerplexity(request: PerplexityRequest): string {
  // Calculate trip duration if dates are provided
  let tripDuration = "unspecified duration";
  let numDays = 0;
  if (request.startDate && request.endDate) {
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    numDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    tripDuration = `${numDays} days`;
  }

  // Format dates for display
  const startDateFormatted = request.startDate 
    ? new Date(request.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : "unspecified start date";
  
  const endDateFormatted = request.endDate
    ? new Date(request.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : "unspecified end date";

  // Build the prompt
  return `
Create a detailed travel itinerary for a trip to ${request.destination} from ${startDateFormatted} to ${endDateFormatted} (${tripDuration}).

Trip details:
- Budget: ₹${request.budget} (budgetINR: ${request.budget})
- Group size: ${request.groupSize || 1} people
- Interests: ${request.interests || "Not specified"}
- Travel style: ${request.travelStyle || "Not specified"}
${request.spendingPriority ? `- Spending priority: ${request.spendingPriority}` : ""}
${request.accommodationType ? `- Accommodation type: ${request.accommodationType}` : ""}
${request.roomConfig ? `- Room configuration: ${request.roomConfig}` : ""}
${request.rentalCarNeeds ? `- Transportation/rental needs: ${request.rentalCarNeeds}` : ""}
${request.accessibilityNeeds ? `- Accessibility needs: ${request.accessibilityNeeds}` : ""}
${request.dietaryRestrictions ? `- Dietary restrictions: ${request.dietaryRestrictions}` : ""}
${request.foodPreferences ? `- Food preferences: ${request.foodPreferences}` : ""}
${request.localFoodInterest ? `- Interested in local cuisine: Yes` : ""}
${request.internationalFoodInterest ? `- Interested in international cuisine: Yes` : ""}
${request.mustVisit ? `- Must-visit places: ${request.mustVisit}` : ""}

IMPORTANT REQUIREMENTS:
1. Create a complete day-by-day itinerary for ALL ${numDays} days of the trip (from ${startDateFormatted} to ${endDateFormatted} inclusive)
2. Recommend SPECIFIC Airbnb/accommodation options with exact names, locations, prices, and ratings
3. Include REAL, WORKING image URLs for all activities (use Unsplash URLs if needed: https://source.unsplash.com/random/600x400/?[keyword])
4. Provide DETAILED descriptions for each activity (at least 2-3 sentences)
5. Include specific restaurant recommendations with cuisine types and price ranges
6. Ensure all costs are in INR with the ₹ symbol

Please provide a complete day-by-day itinerary with:
1. A descriptive title for the trip
2. A list of days with date and activities
3. For each activity include:
   - Time
   - Title
   - Detailed description (2-3 sentences minimum)
   - Specific location with address if applicable
   - Type (attraction, food, transport, accommodation, or other)
   - Duration
   - Approximate cost with ₹ symbol
   - A realistic rating (1-5)
   - A working image URL (use Unsplash if needed)
   - Additional notes or tips

CRITICAL: Your response MUST be a valid JSON object with no text before or after. Do not use markdown code blocks. Do not include explanations.

The JSON must follow this exact structure:
{
  "id": "trip-[unique-id]",
  "title": "Descriptive title for the trip",
  "destination": "${request.destination}",
  "startDate": "${request.startDate || ""}",
  "endDate": "${request.endDate || ""}",
  "totalCost": "Estimated total cost in INR with ₹ symbol",
  "coverImage": "URL for a cover image (must be a working URL)",
  "days": [
    {
      "day": 1,
      "date": "Formatted date",
      "activities": [
        {
          "id": "act-1-1",
          "time": "09:00",
          "title": "Activity title",
          "description": "Detailed description (2-3 sentences minimum)",
          "location": "Specific location with address if applicable",
          "type": "attraction|food|transport|accommodation|other",
          "duration": "Duration in hours",
          "cost": "₹1000",
          "rating": 4.5,
          "image": "https://source.unsplash.com/random/600x400/?[keyword]",
          "notes": "Additional notes or tips"
        }
      ]
    }
  ]
}

Ensure all JSON is properly formatted with no trailing commas or syntax errors. Double-check that all quotes are properly escaped within strings. Verify that ALL image URLs are working URLs.
`;
}

function formatPerplexityResponse(response: any, request: PerplexityRequest): Itinerary {
  // Ensure the response has all required fields
  const itinerary: Itinerary = {
    id: response.id || `trip-${Date.now()}`,
    title: response.title || `Trip to ${request.destination}`,
    destination: response.destination || request.destination,
    startDate: response.startDate || request.startDate || "",
    endDate: response.endDate || request.endDate || "",
    totalCost: ensureCurrencySymbol(response.totalCost) || `₹${request.budget}`,
    coverImage: ensureValidImageUrl(response.coverImage, request.destination, 'travel,landscape'),
    days: response.days || []
  };

  // Ensure each day has required fields
  itinerary.days = itinerary.days.map((day, index) => ({
    day: day.day || index + 1,
    date: day.date || "",
    activities: (day.activities || []).map((activity, actIndex) => ({
      id: activity.id || `act-${day.day}-${actIndex + 1}`,
      time: activity.time || "",
      title: activity.title || "",
      description: activity.description || "",
      location: activity.location || "",
      type: activity.type || "other",
      duration: activity.duration || "",
      cost: ensureCurrencySymbol(activity.cost),
      rating: activity.rating || 4.0,
      image: ensureValidImageUrl(activity.image, request.destination, activity.type || 'travel'),
      notes: activity.notes || ""
    }))
  }));

  return itinerary;
}

/**
 * Ensures that a URL is a valid image URL, or generates a fallback URL
 */
function ensureValidImageUrl(url: string | undefined, destination: string, type: string = 'travel'): string {
  if (!url || !url.startsWith('http')) {
    // Generate a fallback URL using Unsplash
    return `https://source.unsplash.com/random/600x400/?${destination.toLowerCase().replace(/\s+/g, ',')},${type.toLowerCase().replace(/\s+/g, ',')}`;
  }
  return url;
}

/**
 * Ensures that a cost value includes the ₹ symbol
 */
function ensureCurrencySymbol(cost: string | undefined): string {
  if (!cost) return "₹0";
  
  // If the cost already has the symbol, return it
  if (cost.includes('₹')) return cost;
  
  // If it's just a number, add the symbol
  if (/^\d+$/.test(cost)) return `₹${cost}`;
  
  // If it has other currency symbols, replace them
  return cost.replace(/[$€£]/g, '₹');
}

/**
 * Cleans the Perplexity response by removing any thinking or non-JSON content
 */
function cleanPerplexityResponse(content: string): string {
  // Remove <think> sections
  let cleaned = content.replace(/<think>[\s\S]*?<\/think>/g, '');
  
  // Remove any text before the first {
  const firstBraceIndex = cleaned.indexOf('{');
  if (firstBraceIndex > 0) {
    cleaned = cleaned.substring(firstBraceIndex);
  }
  
  // Remove any text after the last }
  const lastBraceIndex = cleaned.lastIndexOf('}');
  if (lastBraceIndex > 0 && lastBraceIndex < cleaned.length - 1) {
    cleaned = cleaned.substring(0, lastBraceIndex + 1);
  }
  
  // Remove any markdown code block markers
  cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '');
  
  return cleaned;
} 