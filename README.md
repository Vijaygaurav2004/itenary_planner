# Travel Planner Web App

A complete travel planning web application that generates personalized itineraries based on user preferences using the Perplexity AI API.

## Features

- Responsive, modern UI built with Next.js and Tailwind CSS
- Multi-step form to collect detailed travel preferences
- Integration with Perplexity AI for smart itinerary generation
- Day-by-day itinerary display with sections for accommodation, restaurants, transportation, and tips
- Dark mode support
- Mobile-friendly design

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js Server Actions
- **API Integration**: Perplexity AI API
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
   - Add your Perplexity API key:
     ```
     PERPLEXITY_API_KEY=your_perplexity_api_key_here
     ```
   - You can get an API key by signing up at [Perplexity AI](https://www.perplexity.ai/)

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Fill in the multi-step form with your travel preferences:
   - Destination and travel dates
   - Budget type and interests
   - Travel style preferences (pace, accommodation, transportation)
   - Traveler details and any special requirements

2. Submit the form to generate your personalized itinerary.

3. View your detailed itinerary with different sections:
   - Overview
   - Day-by-day plan
   - Recommended accommodations
   - Restaurant suggestions
   - Transportation tips
   - Additional advice

## Project Structure

- `/app` - Next.js app router pages and server actions
- `/components` - React components
- `/components/ui` - shadcn/ui components
- `/public` - Static assets
- `/styles` - Global CSS styles
- `/lib` - Utility functions and helpers

## Future Improvements

- Add user authentication
- Save and retrieve past itineraries
- Share itineraries via social media or email
- Add export to PDF functionality
- Implement trip cost estimation
- Add map visualization for daily activities 