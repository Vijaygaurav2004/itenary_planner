"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon, Loader2, PlaneIcon, Map, Briefcase, Utensils, MapPin, Star, Bed, User, Camera } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { generateItinerary } from "@/app/actions"
import { ItineraryDisplay } from "@/components/itinerary-display"
import { LoadingItinerary } from "@/components/loading-itinerary"
import { Badge } from "@/components/ui/badge"

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
  numberOfTravelers: z.coerce.number().min(1),
  ageGroups: z.array(z.string()).optional(),
  specialRequirements: z.string().optional(),
  openaiApiKey: z.string().optional(),
  
  // Must-Have Experiences
  specificActivities: z.string().optional(),
  mustVisitPlaces: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const interestOptions = [
  { id: "beaches", label: "Beaches" },
  { id: "historical", label: "Historical Sites" },
  { id: "nightlife", label: "Nightlife" },
  { id: "nature", label: "Nature" },
  { id: "shopping", label: "Shopping" },
  { id: "museums", label: "Museums" },
  { id: "food", label: "Food & Dining" },
  { id: "adventure", label: "Adventure" },
  { id: "cultural", label: "Cultural Experiences" },
  { id: "relaxation", label: "Relaxation" },
  { id: "photography", label: "Photography" },
  { id: "wildlife", label: "Wildlife" },
]

const transportationOptions = [
  { id: "public", label: "Public Transport" },
  { id: "rental-car", label: "Rental Car" },
  { id: "rental-scooter", label: "Rental Scooter/Bike" },
  { id: "walking", label: "Walking" },
  { id: "taxi", label: "Taxi/Rideshare" },
  { id: "private-driver", label: "Private Driver" },
  { id: "tour-bus", label: "Tour Bus" },
]

const ageGroupOptions = [
  { id: "infants", label: "Infants (0-2 years)" },
  { id: "children", label: "Children (3-12 years)" },
  { id: "teenagers", label: "Teenagers (13-17 years)" },
  { id: "adults", label: "Adults (18-64 years)" },
  { id: "seniors", label: "Seniors (65+ years)" },
]

export function TravelPlannerForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [itinerary, setItinerary] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const totalSteps = 5

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      budgetType: "mid-range",
      interests: [],
      travelPace: "moderate",
      accommodation: "hotel",
      transportation: [],
      travelerProfile: "solo",
      numberOfTravelers: 1,
      ageGroups: [],
      specialRequirements: "",
      totalBudget: "",
      spendingPriorities: "",
      foodPreferences: "",
      customPace: "",
      accommodationLocation: "",
      arrivalDetails: "",
      departureDetails: "",
      openaiApiKey: "",
      specificActivities: "",
      mustVisitPlaces: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Validate that end date is after start date
      if (data.endDate < data.startDate) {
        throw new Error("End date must be after start date");
      }
      
      const result = await generateItinerary(data)
      
      // Check if the result is an error message (less than 100 chars)
      if (result.length < 100 && result.toLowerCase().includes("sorry")) {
        setError(result)
        setIsLoading(false)
        return
      }
      
      setItinerary(result)
    } catch (error) {
      console.error("Error generating itinerary:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    // Validate current step fields before proceeding
    if (currentStep === 1) {
      form.trigger(["destination", "startDate", "endDate"]);
      if (form.getFieldState("destination").invalid || 
          form.getFieldState("startDate").invalid || 
          form.getFieldState("endDate").invalid) {
        return;
      }
    } else if (currentStep === 2) {
      form.trigger(["budgetType"]);
      if (form.getFieldState("budgetType").invalid) {
        return;
      }
    } else if (currentStep === 3) {
      form.trigger(["interests", "travelPace"]);
      if (form.getFieldState("interests").invalid || 
          form.getFieldState("travelPace").invalid) {
        return;
      }
    } else if (currentStep === 4) {
      form.trigger(["accommodation", "transportation"]);
      if (form.getFieldState("accommodation").invalid || 
          form.getFieldState("transportation").invalid) {
        return;
      }
    }
    
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  if (isLoading) {
    return <LoadingItinerary />
  }

  if (itinerary) {
    return <ItineraryDisplay itinerary={itinerary} onReset={() => setItinerary(null)} />
  }

  return (
    <Card className="mx-auto max-w-3xl overflow-hidden border-none bg-white/95 shadow-2xl backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-10 text-white relative">
        {/* Background pattern for header */}
        <div className="absolute inset-0 bg-[url('/images/world-map-dots.svg')] opacity-10"></div>
        
        <div className="relative z-10">
          <div className="mb-3 flex items-center">
            <div className="mr-3 rounded-full bg-white/30 p-2.5 shadow-inner">
              <PlaneIcon className="h-6 w-6" />
            </div>
            <Badge variant="outline" className="rounded-full border-white/50 text-white px-4 py-1.5">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <CardTitle className="text-3xl font-bold mb-2 tracking-tight">Plan Your Perfect Trip</CardTitle>
          <CardDescription className="text-blue-100 text-lg">
            Tell us your preferences and get a personalized itinerary in minutes
          </CardDescription>
          
          <div className="mt-6 flex justify-between">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-full ${
                  i + 1 <= currentStep ? "bg-white" : "bg-white/30"
                } ${i > 0 ? "ml-1.5" : ""} rounded-full transition-all duration-500 ease-in-out`}
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        {error && (
          <div className="mb-8 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/30">
            <p className="flex items-center text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-2 h-5 w-5">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Destination & Dates */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 text-xl font-medium text-blue-600 dark:text-blue-400">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h2>Destination & Dates</h2>
                </div>
                <div className="rounded-xl bg-blue-50/80 p-6 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/20 shadow-sm">
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Where do you want to go?</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Pondicherry, South Goa, Tokyo" 
                            className="mt-1.5 bg-white dark:bg-gray-800"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="mt-1.5">
                          Be as specific as possible about your destination
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="rounded-xl bg-indigo-50/80 p-6 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/20 shadow-sm">
                  <div className="mb-4 text-base font-medium">When are you traveling?</div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`mt-1.5 w-full justify-start border-indigo-200 bg-white pl-3 text-left font-normal dark:border-indigo-800 dark:bg-gray-800 ${
                                    !field.value && "text-muted-foreground"
                                  }`}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="rounded-md border"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`mt-1.5 w-full justify-start border-indigo-200 bg-white pl-3 text-left font-normal dark:border-indigo-800 dark:bg-gray-800 ${
                                    !field.value && "text-muted-foreground"
                                  }`}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() || (form.getValues("startDate") && date < form.getValues("startDate"))
                                }
                                initialFocus
                                className="rounded-md border"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Budget */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-xl font-medium text-blue-600 dark:text-blue-400">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h2>Budget</h2>
                </div>
                
                <div className="rounded-xl bg-emerald-50/80 p-6 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/20 shadow-sm space-y-5">
                  <FormField
                    control={form.control}
                    name="totalBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Budget</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., ₹10,000 for 3 days, $1500, €1000" {...field} />
                        </FormControl>
                        <FormDescription>Specify your total budget for the trip</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="budgetType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your budget type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="budget">Budget-friendly</SelectItem>
                            <SelectItem value="mid-range">Mid-range</SelectItem>
                            <SelectItem value="luxury">Luxury</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spendingPriorities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spending Priorities</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., I want to splurge on food but save on hotels, focus on activities, prefer luxury accommodations"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Tell us where you'd like to spend more or less</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Travel Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-xl font-medium text-blue-600 dark:text-blue-400">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Star className="h-5 w-5" />
                  </div>
                  <h2>Travel Preferences</h2>
                </div>
                
                <div className="rounded-xl bg-purple-50/80 p-6 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/20 shadow-sm space-y-5">
                  <FormField
                    control={form.control}
                    name="interests"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Interests</FormLabel>
                          <FormDescription>Select the activities you're interested in</FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {interestOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="interests"
                              render={({ field }) => {
                                return (
                                  <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(field.value?.filter((value) => value !== option.id))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{option.label}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="foodPreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food Preferences</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., South Indian, French fusion, vegetarian, no spicy food, local cuisine"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Tell us about your dietary restrictions or cuisine preferences
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-5" />
                
                <div className="rounded-xl bg-indigo-50/80 p-6 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/20 shadow-sm space-y-5">
                  <FormField
                    control={form.control}
                    name="travelPace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Travel Pace</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your travel pace" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="relaxed">Relaxed</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="packed">Packed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>How busy do you want your days to be?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customPace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Pace Preferences</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., relaxed mornings but packed evenings, adventurous on weekdays, relaxed on weekends" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Any specific pace preferences for different times</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Accommodation & Transportation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-xl font-medium text-blue-600 dark:text-blue-400">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Bed className="h-5 w-5" />
                  </div>
                  <h2>Accommodation & Transportation</h2>
                </div>
                
                <div className="rounded-xl bg-amber-50/80 p-6 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/20 shadow-sm space-y-5">
                  <FormField
                    control={form.control}
                    name="accommodation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accommodation Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select accommodation type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hotel">Hotel</SelectItem>
                            <SelectItem value="hostel">Hostel</SelectItem>
                            <SelectItem value="airbnb">Airbnb/Vacation Rental</SelectItem>
                            <SelectItem value="any">No Preference</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accommodationLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Accommodation Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., near the French Quarter, beachside, city center, quiet area" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Any specific area you'd prefer to stay in</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-5" />
                
                <div className="rounded-xl bg-sky-50/80 p-6 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/20 shadow-sm space-y-5">
                  <FormField
                    control={form.control}
                    name="transportation"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Transportation</FormLabel>
                          <FormDescription>How do you prefer to get around?</FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {transportationOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="transportation"
                              render={({ field }) => {
                                return (
                                  <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(field.value?.filter((value) => value !== option.id))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{option.label}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="arrivalDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arrival Details</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., landing at Chennai Airport at 9 AM, arriving by train at 2 PM" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>How and when you'll be arriving</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="departureDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departure Details</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., departing from Chennai Airport at 8 PM, leaving by train at 3 PM" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>How and when you'll be departing</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Personal Details & Must-Have Experiences */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-xl font-medium text-blue-600 dark:text-blue-400">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <User className="h-5 w-5" />
                  </div>
                  <h2>Personal Details & Special Requests</h2>
                </div>
                
                <div className="rounded-xl bg-rose-50/80 p-6 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/20 shadow-sm space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="travelerProfile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Traveler Profile</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select traveler type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="solo">Solo Traveler</SelectItem>
                              <SelectItem value="couple">Couple</SelectItem>
                              <SelectItem value="family">Family</SelectItem>
                              <SelectItem value="group">Group</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="numberOfTravelers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Travelers</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="ageGroups"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel className="text-base">Age Groups</FormLabel>
                          <FormDescription>Select all that apply to your group</FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {ageGroupOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="ageGroups"
                              render={({ field }) => {
                                return (
                                  <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], option.id])
                                            : field.onChange(field.value?.filter((value) => value !== option.id))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{option.label}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requirements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., wheelchair accessibility, no spicy food, child-friendly activities"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Any special needs or preferences for your trip</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="openaiApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OpenAI API Key (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="sk-..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide your OpenAI API key for enhanced itinerary design. 
                          Your key is not stored and will only be used for this request.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="rounded-xl bg-teal-50/80 p-6 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/20 shadow-sm space-y-5">
                  <h3 className="text-lg font-medium flex items-center">
                    <Camera className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                    Must-Have Experiences
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="specificActivities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specific Activities</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., sunset cruise, heritage walk, cooking class, water sports"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Particular activities you want to experience</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="mustVisitPlaces"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Must-Visit Places</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Auroville, Paradise Beach, specific restaurants, museums"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Specific places you don't want to miss</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-8">
              {currentStep > 1 ? (
                <Button 
                  type="button" 
                  variant="outline"
                  className="rounded-full px-6" 
                  onClick={prevStep}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Previous
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <Button 
                  type="button" 
                  className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-6 shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                  onClick={nextStep}
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-7 shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Itinerary...
                    </>
                  ) : (
                    <>
                      Generate Itinerary
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
