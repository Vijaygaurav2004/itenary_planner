"use server";

import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

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
});

type FormValues = z.infer<typeof formSchema>;

export async function generateItinerary(data: FormValues): Promise<string> {
  try {
    // Validate the input data
    formSchema.parse(data);

    // Calculate trip duration
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const tripDuration = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Validate trip duration
    if (tripDuration < 1) {
      throw new Error("Trip duration must be at least 1 day");
    }

    if (tripDuration > 30) {
      throw new Error(
        "Trip duration cannot exceed 30 days due to API limitations"
      );
    }

    // Format dates for the prompt
    const formatDate = (date: Date) =>
      date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

    // Construct the prompt for Perplexity
    const prompt = `
      Create a detailed travel itinerary for a trip to ${data.destination}.
      
      TRAVELER DETAILS:
      - Profile: ${data.travelerProfile}
      - Number of travelers: ${data.numberOfTravelers}
      ${
        data.ageGroups && data.ageGroups.length > 0
          ? `- Age groups: ${data.ageGroups.join(", ")}`
          : ""
      }
      ${
        data.specialRequirements
          ? `- Special needs: ${data.specialRequirements}`
          : ""
      }
      
      TRIP DETAILS:
      - Dates: ${formatDate(startDate)} to ${formatDate(
      endDate
    )} (${tripDuration} days)
      ${data.arrivalDetails ? `- Arrival: ${data.arrivalDetails}` : ""}
      ${data.departureDetails ? `- Departure: ${data.departureDetails}` : ""}
      
      BUDGET:
      - Budget type: ${data.budgetType}
      ${data.totalBudget ? `- Total budget: ${data.totalBudget}` : ""}
      ${
        data.spendingPriorities
          ? `- Spending priorities: ${data.spendingPriorities}`
          : ""
      }
      
      PREFERENCES:
      - Interests: ${data.interests.join(", ")}
      - Food: ${data.foodPreferences || "No specific preferences"}
      - Travel pace: ${data.travelPace}
      ${data.customPace ? `- Custom pace: ${data.customPace}` : ""}
      
      ACCOMMODATION:
      - Type: ${data.accommodation}
      ${
        data.accommodationLocation
          ? `- Preferred location: ${data.accommodationLocation}`
          : ""
      }
      
      TRANSPORTATION:
      - Preferred modes: ${data.transportation.join(", ")}
      
      MUST-HAVE EXPERIENCES:
      ${
        data.specificActivities
          ? `- Activities: ${data.specificActivities}`
          : ""
      }
      ${
        data.mustVisitPlaces ? `- Places to visit: ${data.mustVisitPlaces}` : ""
      }
      
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
    `;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response?.text;

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const cleanedText = text
      .replace(/[*•]+/g, "")
      .replace(/^\s*\n/gm, "")
      .replace(/\n{3,}/g, "\n\n");

    console.log(text);
    console.log(cleanedText);

    return cleanedText;
  } catch (error) {
    console.error("Error generating itinerary:", error);

    if (error instanceof z.ZodError) {
      return "Invalid input. Please review your entries.";
    }

    if (error instanceof Error) {
      return `Sorry, something went wrong: ${error.message}`;
    }

    return "An unexpected error occurred.";
  }
}
