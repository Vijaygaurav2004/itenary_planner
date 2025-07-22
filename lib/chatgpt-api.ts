import { Itinerary } from "@/app/actions";

export interface ChatGPTRequest {
  itinerary: Itinerary;
}

export interface ChatGPTResponse {
  formattedItinerary: Itinerary;
  htmlContent: string;
}

export async function formatItineraryWithChatGPT(
  request: ChatGPTRequest
): Promise<ChatGPTResponse> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("OpenAI API key is not defined in environment variables");
    }

    // Create a prompt for ChatGPT
    const prompt = `
I have a travel itinerary in JSON format that I need you to enhance and format into a beautiful, engaging travel plan.
Please analyze this itinerary data, add more descriptive details, and format it in a way that would be visually appealing on a website.

Here's the itinerary data:
${JSON.stringify(request.itinerary, null, 2)}

Please return your response as a JSON object with two fields:
1. "formattedItinerary": An enhanced version of the original itinerary JSON with more descriptive details
2. "htmlContent": HTML content that presents the itinerary in a beautiful, structured format suitable for a travel website

For the HTML content:
- Use semantic HTML5
- Include sections for each day
- Format activities in a visually appealing way
- Add engaging descriptions
- Highlight important information like costs, times, and locations
- Make it visually structured and easy to read
- Do not include any CSS or JavaScript
`;

    // Call ChatGPT API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: "You are a travel content designer specialized in creating beautiful, engaging travel itineraries. Your task is to enhance and format travel itinerary data into a visually appealing format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ChatGPT API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Parse the response content
    try {
      const content = data.choices[0].message.content;
      
      // Find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in the response");
      }
      
      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      return {
        formattedItinerary: parsedResponse.formattedItinerary,
        htmlContent: parsedResponse.htmlContent
      };
    } catch (error) {
      console.error("Error parsing ChatGPT response:", error);
      
      // Fallback: If we can't parse the JSON, return the original itinerary and a simple HTML version
      return {
        formattedItinerary: request.itinerary,
        htmlContent: generateFallbackHTML(request.itinerary)
      };
    }
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    
    // Return the original itinerary and a simple HTML version
    return {
      formattedItinerary: request.itinerary,
      htmlContent: generateFallbackHTML(request.itinerary)
    };
  }
}

// Generate a simple HTML version of the itinerary as a fallback
function generateFallbackHTML(itinerary: Itinerary): string {
  let html = `
    <div class="itinerary-container">
      <h1>${itinerary.title}</h1>
      <p><strong>Destination:</strong> ${itinerary.destination}</p>
      <p><strong>Dates:</strong> ${formatDate(itinerary.startDate)} - ${formatDate(itinerary.endDate)}</p>
      <p><strong>Total Cost:</strong> ${itinerary.totalCost}</p>
  `;

  // Add days
  itinerary.days.forEach(day => {
    html += `
      <div class="day-container">
        <h2>Day ${day.day} - ${day.date}</h2>
        <div class="activities-container">
    `;

    // Add activities
    day.activities.forEach(activity => {
      html += `
        <div class="activity">
          <h3>${activity.time} - ${activity.title}</h3>
          <p><strong>Location:</strong> ${activity.location}</p>
          <p><strong>Duration:</strong> ${activity.duration}</p>
          <p>${activity.description}</p>
          ${activity.cost ? `<p><strong>Cost:</strong> ${activity.cost}</p>` : ''}
          ${activity.rating ? `<p><strong>Rating:</strong> ${activity.rating}/5</p>` : ''}
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
} 