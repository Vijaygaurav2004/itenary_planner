# Travel Planner Web App

A complete travel planning web application that generates personalized itineraries based on user preferences using the Perplexity AI API and formats them beautifully with ChatGPT.

## Features

- Responsive, modern UI built with Next.js and Tailwind CSS
- Multi-step form to collect detailed travel preferences
- Integration with Perplexity AI for smart itinerary generation
- Enhanced formatting using ChatGPT for beautiful, engaging travel plans
- Day-by-day itinerary display with sections for accommodation, restaurants, transportation, and tips
- Multiple view modes: Timeline, Formatted, and Map
- Dark mode support
- Mobile-friendly design

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js Server Actions
- **API Integration**: Perplexity AI API, OpenAI ChatGPT API
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd travel-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the following environment variables:
     ```
     # Required: Your Perplexity API key
     PERPLEXITY_API_KEY=your_perplexity_api_key_here
     
     # Optional: Your OpenAI API key for enhanced formatting
     OPENAI_API_KEY=your_openai_api_key_here
     
     # Feature flags
     USE_PERPLEXITY_API=true
     USE_CHATGPT_API=true
     ```
   - You can get a Perplexity API key by signing up at [Perplexity AI](https://www.perplexity.ai/api)
   - You can get an OpenAI API key by signing up at [OpenAI](https://platform.openai.com/)

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## AI Integration

This application uses a two-step AI process to create beautiful travel itineraries:

### 1. Perplexity API Integration

1. When a user submits the travel planning form, the application collects all the user preferences.
2. The application sends a structured prompt to the Perplexity API with all the travel details.
3. Perplexity AI generates a detailed itinerary in JSON format with accurate information.
4. If the ChatGPT integration is disabled, this JSON data is displayed directly to the user.

### 2. ChatGPT API Integration

1. After receiving the structured JSON data from Perplexity, the application sends it to ChatGPT.
2. ChatGPT enhances the itinerary with more descriptive details and creates beautiful HTML formatting.
3. The application displays both the enhanced JSON data and the formatted HTML content to the user.
4. Users can switch between different view modes: Timeline (JSON data), Formatted (HTML content), and Map.

### API Configuration

- The application uses the `sonar-deep-research` model from Perplexity and `gpt-4-turbo` from OpenAI.
- If the API keys are missing or the feature flags are set to `false`, the application will fall back to using mock data or simpler formatting.
- You can modify the prompt templates in `lib/perplexity-api.ts` and `lib/chatgpt-api.ts` to customize the AI responses.

## Usage

1. Fill in the multi-step form with your travel preferences:
   - Destination and travel dates
   - Budget type and interests
   - Travel style preferences (pace, accommodation, transportation)
   - Food preferences and spending priorities
   - Traveler details and any special requirements

2. Submit the form to generate your personalized itinerary.

3. View your detailed itinerary in different formats:
   - Timeline View: Day-by-day structured itinerary
   - Formatted View: Beautiful, engaging travel plan created by ChatGPT
   - Map View: Visual representation of your journey (coming soon)

## Project Structure

- `/app` - Next.js app router pages and server actions
- `/components` - React components
- `/components/ui` - shadcn/ui components
- `/public` - Static assets
- `/styles` - Global CSS styles
- `/lib` - Utility functions and helpers, including Perplexity and ChatGPT API clients

## Future Improvements

- Add user authentication
- Save and retrieve past itineraries
- Share itineraries via social media or email
- Add export to PDF functionality
- Implement trip cost estimation
- Complete map visualization for daily activities
- Support for more AI models and providers 