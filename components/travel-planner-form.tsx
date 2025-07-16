"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon, Sparkles, Globe, PlaneTakeoff, Zap, Users, Link as LinkIcon, ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { generateItinerary } from "@/app/actions"
import { ItineraryDisplay } from "@/components/itinerary-display"
import { LoadingItinerary } from "@/components/loading-itinerary"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Form schema with Zod
const formSchema = z.object({
  destination: z.string().min(2, "Destination is required"),
  startDate: z.date({ required_error: "Start date is required" }).nullable().default(null),
  endDate: z.date({ required_error: "End date is required" }).nullable().default(null),
  budget: z.number().min(500, "Budget must be at least $500"),
  interests: z.string().nullable().default(""),
  travelStyle: z.string().nullable().default(""),
  isCollaborative: z.boolean().default(false),
  collaboratorEmails: z.string().nullable().default(""),
  inspirationUrl: z.string().nullable().default(""),
  travelDays: z.number().default(0),
  openToSuggestions: z.boolean().default(false),
  groupSize: z.number().min(1, "At least one person required").default(1),
  ageGroups: z.array(z.string()).default([]),
  customAgeGroup: z.string().nullable().default(""),
  groupType: z.enum(["solo", "couple", "family", "friends"]).default("solo"),
  hasChildren: z.boolean().default(false),
  hasElderly: z.boolean().default(false),
  hasMobilityNeeds: z.boolean().default(false),
  dietaryRestrictions: z.string().nullable().default(""),
  allergies: z.string().nullable().default(""),
  spendingPriority: z.enum(["accommodation", "activities", "food", "transportation"]).default("accommodation"),
  accommodationType: z.string().nullable().default(""),
  accommodationRequirements: z.string().nullable().default(""),
  accommodationUnique: z.boolean().default(false),
  foodPreferences: z.string().nullable().default(""),
  localFoodInterest: z.boolean().default(false),
  internationalFoodInterest: z.boolean().default(false),
  mainInterests: z.string().nullable().default(""),
  mustSee: z.string().nullable().default(""),
  popularVsHidden: z.enum(["popular", "hidden", "both"]).default("both"),
  itineraryPace: z.enum(["relaxed", "packed"]).default("relaxed"),
  wantsFreeTime: z.boolean().default(false),
  transportModes: z.string().nullable().default(""),
  multiModal: z.boolean().default(false),
  specialOccasion: z.string().nullable().default(""),
  tripTheme: z.string().nullable().default(""),
  beenBefore: z.boolean().default(false),
  likesDislikes: z.string().nullable().default(""),
  realTimeAdapt: z.boolean().default(false),
  wantsNotifications: z.boolean().default(false),
  preferredDestinations: z.string().nullable().default(""),
  openToAISuggestions: z.boolean().default(false),
  mustVisit: z.string().nullable().default(""),
  previouslyVisited: z.string().nullable().default(""),
  accommodationTypeSelect: z.string().nullable().default(""),
  desiredAmenities: z.array(z.string()).default([]),
  locationPreferences: z.string().nullable().default(""),
  roomConfig: z.string().nullable().default(""),
  primaryTransportModes: z.array(z.string()).default([]),
  rentalCarNeeds: z.string().nullable().default(""),
  drivingComfort: z.boolean().default(false),
  accessibilityNeeds: z.string().nullable().default("")
})

type FormValues = z.infer<typeof formSchema>

export function TravelPlannerForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<string>("basic")
  const [formStep, setFormStep] = useState(0)
  const [otherInterest, setOtherInterest] = useState("")
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      startDate: null,
      endDate: null,
      budget: 1000,
      interests: "",
      travelStyle: "",
      isCollaborative: false,
      collaboratorEmails: "",
      inspirationUrl: "",
      travelDays: 0,
      openToSuggestions: false,
      groupSize: 1,
      ageGroups: [],
      customAgeGroup: "",
      groupType: "solo",
      hasChildren: false,
      hasElderly: false,
      hasMobilityNeeds: false,
      dietaryRestrictions: "",
      allergies: "",
      spendingPriority: "accommodation",
      accommodationType: "",
      accommodationRequirements: "",
      accommodationUnique: false,
      foodPreferences: "",
      localFoodInterest: false,
      internationalFoodInterest: false,
      mainInterests: "",
      mustSee: "",
      popularVsHidden: "both",
      itineraryPace: "relaxed",
      wantsFreeTime: false,
      transportModes: "",
      multiModal: false,
      specialOccasion: "",
      tripTheme: "",
      beenBefore: false,
      likesDislikes: "",
      realTimeAdapt: false,
      wantsNotifications: false,
      preferredDestinations: "",
      openToAISuggestions: false,
      mustVisit: "",
      previouslyVisited: "",
      accommodationTypeSelect: "",
      desiredAmenities: [],
      locationPreferences: "",
      roomConfig: "",
      primaryTransportModes: [],
      rentalCarNeeds: "",
      drivingComfort: false,
      accessibilityNeeds: "",
    },
    mode: "onChange",
  })
  
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    // Validate end date is after start date
    if (data.endDate && data.startDate && data.endDate <= data.startDate) {
      form.setError("endDate", {
        type: "manual",
        message: "End date must be after start date",
      });
      return;
    }
    
    // Validate collaborator emails if collaborative is checked
    if (data.isCollaborative && data.collaboratorEmails) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emails = data.collaboratorEmails.split(',').map(email => email.trim());
      const allValid = emails.every(email => emailRegex.test(email));
      
      if (!allValid) {
        form.setError("collaboratorEmails", {
          type: "manual",
          message: "Please enter valid email addresses separated by commas",
        });
        return;
      }
    }
    
    // Validate URL if provided
    if (data.inspirationUrl) {
      try {
        new URL(data.inspirationUrl);
      } catch {
        form.setError("inspirationUrl", {
          type: "manual",
          message: "Please enter a valid URL",
        });
        return;
      }
    }
    
    setIsGenerating(true)
    
    try {
      // Call the server action to generate the itinerary
      const result = await generateItinerary({
        destination: data.destination,
        startDate: data.startDate?.toISOString() || null,
        endDate: data.endDate?.toISOString() || null,
        budget: data.budget,
        interests: data.interests || "",
        travelStyle: data.travelStyle || "",
        isCollaborative: data.isCollaborative,
        collaboratorEmails: data.collaboratorEmails || "",
        inspirationUrl: data.inspirationUrl || "",
      })
      
      setGeneratedItinerary(result)
    } catch (error) {
      console.error("Error generating itinerary:", error)
    } finally {
      setIsGenerating(false)
    }
  }
  
  // Handle form step navigation
  const nextStep = async () => {
    const currentFields = formSteps[formStep].fields
    
    // Validate current step fields
    const result = await form.trigger(currentFields, { shouldFocus: true })
    
    // Additional validation for end date
    if (formStep === 0 && form.getValues("startDate") && form.getValues("endDate")) {
      if (form.getValues("endDate") && form.getValues("startDate") && form.getValues("endDate") <= form.getValues("startDate")) {
        form.setError("endDate", {
          type: "manual",
          message: "End date must be after start date",
        });
        return;
      }
    }
    
    if (result) {
      setFormStep(prev => prev + 1)
    }
  }
  
  const prevStep = () => {
    setFormStep(prev => prev - 1)
  }
  
  // Form steps configuration
  const formSteps: {
    title: string;
    description: string;
    fields: (keyof FormValues)[];
  }[] = [
    {
      title: "Destination & Dates",
      description: "Where and when do you want to travel?",
      fields: ["destination", "preferredDestinations", "startDate", "endDate", "travelDays", "openToSuggestions", "openToAISuggestions"],
    },
    {
      title: "Group & Preferences",
      description: "Tell us about your group and preferences",
      fields: [
        "groupSize", "ageGroups", "groupType", "hasChildren", "hasElderly", "hasMobilityNeeds", "dietaryRestrictions", "allergies",
        "budget", "spendingPriority", "accommodationType", "accommodationRequirements", "accommodationUnique", "foodPreferences", "localFoodInterest", "internationalFoodInterest", "mainInterests", "mustSee", "popularVsHidden", "itineraryPace", "wantsFreeTime", "transportModes", "multiModal", "accommodationTypeSelect", "desiredAmenities", "locationPreferences", "roomConfig", "primaryTransportModes", "rentalCarNeeds", "drivingComfort", "accessibilityNeeds"
      ],
    },
    {
      title: "Special & Experience",
      description: "Special occasions, themes, and past travel",
      fields: [
        "specialOccasion", "tripTheme", "beenBefore", "likesDislikes", "realTimeAdapt", "wantsNotifications", "isCollaborative", "collaboratorEmails", "inspirationUrl", "mustVisit", "previouslyVisited"
      ],
    },
  ]
  
  // Reset the form and state
  const resetForm = () => {
    form.reset()
    setGeneratedItinerary(null)
    setFormStep(0)
    setActiveTab("basic")
  }
  
  // Add at the top of the component
  const AGE_GROUP_OPTIONS = ["Infants (0-2)", "Children (3-12)", "Teenagers (13-17)", "Adults (18-64)", "Seniors (65+)", "Other"];
  const INTEREST_OPTIONS = [
    "Beaches", "Mountains", "Adventure", "Culture", "History", "Nature", "Shopping", "Nightlife", "Food", "Wildlife", "Relaxation", "Photography"
  ];
  
  if (generatedItinerary) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <Button 
            onClick={resetForm} 
            variant="outline" 
            className="rounded-full"
          >
            <X className="mr-2 h-4 w-4" />
            Create New Itinerary
          </Button>
        </div>
        <ItineraryDisplay itinerary={generatedItinerary} />
      </div>
    )
  }
  
  if (isGenerating) {
    return <LoadingItinerary />
  }
  
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {formSteps.map((step, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex flex-col items-center",
                    index > 0 && "ml-auto"
                  )}
                >
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm relative",
                      formStep >= index 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                    )}
                  >
                    {index + 1}
                    {formStep === index && (
                      <motion.div 
                        className="absolute -inset-1 rounded-full border-2 border-blue-400 dark:border-blue-500"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <span className={cn(
                    "text-xs mt-1 hidden sm:block",
                    formStep >= index 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-400 dark:text-gray-500"
                  )}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600 to-indigo-600"
                initial={{ width: "0%" }}
                animate={{ width: `${(formStep / (formSteps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          {/* Form step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={formStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold">{formSteps[formStep].title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formSteps[formStep].description}</p>
                </div>
                
                {formStep === 0 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <Input 
                                placeholder="Where do you want to go?" 
                                className="pl-10" 
                                value={field.value ?? ""}
                                onChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="preferredDestinations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Destinations or Regions</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Europe, Southeast Asia, Japan" value={field.value ?? ""} onChange={field.onChange} />
                          </FormControl>
                          <FormDescription>
                            List any specific destinations or regions you prefer.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="openToAISuggestions"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Open to AI Suggestions</FormLabel>
                            <FormDescription>
                              Allow the AI to suggest destinations or experiences outside your preferences.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    // Clear end date error when start date changes
                                    if (form.formState.errors.endDate) {
                                      form.clearErrors("endDate");
                                    }
                                  }}
                                  disabled={(date) =>
                                    date < new Date()
                                  }
                                  initialFocus
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
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    // Validate end date is after start date
                                    const startDate = form.getValues("startDate");
                                    if (startDate && date && date <= startDate) {
                                      form.setError("endDate", {
                                        type: "manual",
                                        message: "End date must be after start date",
                                      });
                                    } else {
                                      form.clearErrors("endDate");
                                    }
                                  }}
                                  disabled={(date) => {
                                    const startDate = form.getValues("startDate");
                                    if (!startDate) return date < new Date();
                                    return date < startDate;
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
                
                {formStep === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget (INR)</FormLabel>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">₹5,000</span>
                              <span className="font-medium">₹{field.value?.toLocaleString()}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">₹5,00,000+</span>
                            </div>
                            <FormControl>
                              <Slider
                                min={5000}
                                max={500000}
                                step={1000}
                                defaultValue={[field.value]}
                                onValueChange={(values) => field.onChange(values[0])}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="interests"
                      render={({ field }) => {
                        // Parse the value as an array
                        const valueArray = field.value ? field.value.split(",").map(s => s.trim()).filter(Boolean) : [];
                        const isOtherChecked = valueArray.includes("Other");
                        return (
                          <FormItem>
                            <FormLabel>Interests</FormLabel>
                            <FormControl>
                              <div className="flex flex-wrap gap-3">
                                {INTEREST_OPTIONS.map(option => (
                                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={valueArray.includes(option)}
                                      onChange={e => {
                                        let newArr = valueArray.filter(v => v !== option);
                                        if (e.target.checked) newArr.push(option);
                                        field.onChange(newArr.join(", "));
                                      }}
                                    />
                                    {option}
                                  </label>
                                ))}
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={isOtherChecked}
                                    onChange={e => {
                                      let newArr = valueArray.filter(v => v !== "Other");
                                      if (e.target.checked) newArr.push("Other");
                                      field.onChange(newArr.join(", "));
                                    }}
                                  />
                                  Other
                                </label>
                                {isOtherChecked && (
                                  <Input
                                    className="w-48"
                                    placeholder="Please specify"
                                    value={otherInterest}
                                    onChange={e => setOtherInterest(e.target.value)}
                                    onBlur={() => {
                                      // Add or update the custom interest in the value
                                      let newArr = valueArray.filter(v => v !== "Other" && !v.startsWith("Other:"));
                                      if (otherInterest.trim()) {
                                        newArr.push(`Other:${otherInterest.trim()}`);
                                      } else {
                                        newArr.push("Other");
                                      }
                                      field.onChange(newArr.join(", "));
                                    }}
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>
                              Select all that apply. If you have other interests, specify them.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    
                    <FormField
                      control={form.control}
                      name="travelStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Travel Style</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {["Relaxed", "Adventurous", "Cultural", "Luxury", "Budget", "Family", "Solo", "Romantic"].map((style) => (
                                <Badge 
                                  key={style}
                                  variant={field.value?.includes(style) ? "default" : "outline"}
                                  className={cn(
                                    "cursor-pointer justify-center py-1.5",
                                    field.value?.includes(style) 
                                      ? "bg-blue-600 hover:bg-blue-700" 
                                      : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  )}
                                  onClick={() => {
                                    const currentStyles = field.value ? field.value.split(", ").filter(Boolean) : []
                                    const newStyles = currentStyles.includes(style)
                                      ? currentStyles.filter(s => s !== style)
                                      : [...currentStyles, style]
                                    field.onChange(newStyles.join(", "))
                                  }}
                                >
                                  {style}
                                </Badge>
                              ))}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Select all that apply to your travel preferences.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="groupSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of People in Group</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Button type="button" variant="outline" onClick={() => field.onChange(Math.max(1, field.value - 1))}>-</Button>
                              <Input
                                type="number"
                                min={1}
                                value={field.value}
                                onChange={e => field.onChange(Number(e.target.value))}
                                className="w-16 text-center"
                              />
                              <Button type="button" variant="outline" onClick={() => field.onChange(field.value + 1)}>+</Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ageGroups"
                      render={({ field }) => {
                        const valueArray = field.value || [];
                        const isOtherChecked = valueArray.includes("Other");
                        return (
                          <FormItem>
                            <FormLabel>Age Groups</FormLabel>
                            <FormControl>
                              <div className="flex flex-wrap gap-3">
                                {AGE_GROUP_OPTIONS.map(option => (
                                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={valueArray.includes(option)}
                                      onChange={e => {
                                        let newArr = valueArray.filter(v => v !== option);
                                        if (e.target.checked) newArr.push(option);
                                        field.onChange(newArr);
                                      }}
                                    />
                                    {option}
                                  </label>
                                ))}
                                {isOtherChecked && (
                                  <Input
                                    className="w-48"
                                    placeholder="Please specify"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>
                              Select all that apply. If you have other age groups, specify them.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="accommodationTypeSelect"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accommodation Type</FormLabel>
                          <FormControl>
                            <select value={field.value ?? ""} onChange={e => field.onChange(e.target.value)} className="w-full border rounded px-3 py-2">
                              <option value="">Select type</option>
                              <option value="hotel">Hotel</option>
                              <option value="hostel">Hostel</option>
                              <option value="airbnb">Airbnb</option>
                              <option value="luxury">Luxury</option>
                              <option value="budget">Budget</option>
                            </select>
                          </FormControl>
                          <FormDescription>
                            Choose your preferred type of accommodation.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="desiredAmenities"
                      render={({ field }) => {
                        const options = ["WiFi", "Breakfast", "Gym", "Pool", "Pet-friendly"];
                        return (
                          <FormItem>
                            <FormLabel>Desired Amenities</FormLabel>
                            <FormControl>
                              <div className="flex flex-wrap gap-3">
                                {options.map(option => (
                                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={Array.isArray(field.value) && field.value.includes(option)}
                                      onChange={e => {
                                        let newArr = (Array.isArray(field.value) ? field.value : []).filter((v: string) => v !== option);
                                        if (e.target.checked) newArr.push(option);
                                        field.onChange(newArr);
                                      }}
                                    />
                                    {option}
                                  </label>
                                ))}
                              </div>
                            </FormControl>
                            <FormDescription>
                              Select all amenities you want in your accommodation.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="locationPreferences"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Preferences</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. City center, quiet areas, near attractions" value={field.value ?? ""} onChange={field.onChange} />
                          </FormControl>
                          <FormDescription>
                            Describe your preferred location for accommodation.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roomConfig"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Configuration Needs</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 2 double beds, family suite, adjoining rooms" value={field.value ?? ""} onChange={field.onChange} />
                          </FormControl>
                          <FormDescription>
                            Specify any special room configuration requirements.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="primaryTransportModes"
                      render={({ field }) => {
                        const options = ["Flights", "Trains", "Cars", "Public Transport"];
                        return (
                          <FormItem>
                            <FormLabel>Primary Transportation Modes</FormLabel>
                            <FormControl>
                              <div className="flex flex-wrap gap-3">
                                {options.map(option => (
                                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={Array.isArray(field.value) && field.value.includes(option)}
                                      onChange={e => {
                                        let newArr = (Array.isArray(field.value) ? field.value : []).filter((v: string) => v !== option);
                                        if (e.target.checked) newArr.push(option);
                                        field.onChange(newArr);
                                      }}
                                    />
                                    {option}
                                  </label>
                                ))}
                              </div>
                            </FormControl>
                            <FormDescription>
                              Select all transportation modes you plan to use.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="rentalCarNeeds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rental Car Needs</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. SUV, automatic, child seat, etc." value={field.value ?? ""} onChange={field.onChange} />
                          </FormControl>
                          <FormDescription>
                            Specify any rental car requirements.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="drivingComfort"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Comfortable Driving in Destination?</FormLabel>
                            <FormDescription>
                              Are you comfortable driving in the destination country/region?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="accessibilityNeeds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobility & Accessibility Needs</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe any mobility or accessibility requirements (e.g. wheelchair access, step-free, etc.)" value={field.value ?? ""} onChange={field.onChange} />
                          </FormControl>
                          <FormDescription>
                            Let us know about any special mobility or accessibility needs.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {formStep === 2 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="isCollaborative"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Collaborative Planning</FormLabel>
                            <FormDescription>
                              Invite others to collaborate on this trip
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (!checked) {
                                  // Clear collaborator emails when turning off collaboration
                                  form.setValue("collaboratorEmails", "");
                                  form.clearErrors("collaboratorEmails");
                                }
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <AnimatePresence>
                      {form.watch("isCollaborative") && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <FormField
                            control={form.control}
                            name="collaboratorEmails"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Collaborator Emails</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    <Input 
                                      placeholder="Enter email addresses separated by commas" 
                                      className="pl-10" 
                                      value={field.value ?? ""}
                                      onChange={field.onChange}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  We'll send them an invitation to join your trip planning.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <FormField
                      control={form.control}
                      name="inspirationUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Anywhere</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <Input 
                                placeholder="Paste a URL with travel content to use as inspiration" 
                                className="pl-10" 
                                value={field.value ?? ""}
                                onChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Convert any travel article, blog post, or social media link into an itinerary.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mustVisit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Must-Visit Places or Bucket List Items</FormLabel>
                          <FormControl>
                            <Textarea placeholder="List any must-see places or experiences for this trip" value={field.value ?? ""} onChange={field.onChange} />
                          </FormControl>
                          <FormDescription>
                            Mention any specific places or activities you want to include.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="previouslyVisited"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previously Visited Locations</FormLabel>
                          <FormControl>
                            <Textarea placeholder="List places you've already visited to avoid repetition" value={field.value ?? ""} onChange={field.onChange} />
                          </FormControl>
                          <FormDescription>
                            This helps us avoid suggesting places you've already been.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={formStep === 0}
              className="rounded-full"
            >
              Back
            </Button>
            
            {formStep < formSteps.length - 1 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                className="rounded-full"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="rounded-full relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></span>
                <span className="relative flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Itinerary
                </span>
              </Button>
            )}
          </div>
        </form>
      </Form>
    </FormProvider>
  )
}
