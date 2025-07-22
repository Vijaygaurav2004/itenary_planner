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
  destination: z.string()
    .min(2, "Destination is required")
    .refine((val) => /^[A-Za-z\s\-,.()]+$/.test(val), {
      message: "Destination should only contain letters, spaces, and common punctuation",
    }),
  startDate: z.date({ required_error: "Start date is required" }).nullable(),
  endDate: z.date({ required_error: "End date is required" }).nullable(),
  budget: z.number().min(500, "Budget must be at least $500"),
  interests: z.string().nullable(),
  travelStyle: z.string().nullable(),
  isCollaborative: z.boolean().default(false),
  collaboratorEmails: z.string().nullable(),
  inspirationUrl: z.string().nullable(),
  travelDays: z.number().default(0),
  openToSuggestions: z.boolean().default(false),
  groupSize: z.number().min(1, "At least one person required").default(1),
  ageGroups: z.array(z.string()).default([]),
  customAgeGroup: z.string().nullable(),
  groupType: z.enum(["solo", "couple", "family", "friends"]).default("solo"),
  hasChildren: z.boolean().default(false),
  hasElderly: z.boolean().default(false),
  hasMobilityNeeds: z.boolean().default(false),
  dietaryRestrictions: z.string().nullable(),
  allergies: z.string().nullable(),
  spendingPriority: z.enum(["accommodation", "activities", "food", "transportation"]).default("accommodation"),
  accommodationType: z.string().nullable(),
  accommodationRequirements: z.string().nullable(),
  accommodationUnique: z.boolean().default(false),
  foodPreferences: z.string().nullable(),
  localFoodInterest: z.boolean().default(false),
  internationalFoodInterest: z.boolean().default(false),
  mainInterests: z.string().nullable(),
  mustSee: z.string().nullable(),
  popularVsHidden: z.enum(["popular", "hidden", "both"]).default("both"),
  itineraryPace: z.enum(["relaxed", "packed"]).default("relaxed"),
  wantsFreeTime: z.boolean().default(false),
  transportModes: z.string().nullable(),
  multiModal: z.boolean().default(false),
  specialOccasion: z.string().nullable(),
  tripTheme: z.string().nullable(),
  beenBefore: z.boolean().default(false),
  likesDislikes: z.string().nullable(),
  realTimeAdapt: z.boolean().default(false),
  wantsNotifications: z.boolean().default(false),
  preferredDestinations: z.string().nullable(),
  openToAISuggestions: z.boolean().default(false),
  mustVisit: z.string().nullable(),
  previouslyVisited: z.string().nullable(),
  accommodationTypeSelect: z.string().nullable(),
  desiredAmenities: z.array(z.string()).default([]),
  locationPreferences: z.string().nullable(),
  roomConfig: z.string().nullable(),
  primaryTransportModes: z.array(z.string()).default([]),
  rentalCarNeeds: z.string().nullable(),
  drivingComfort: z.boolean().default(false),
  accessibilityNeeds: z.string().nullable()
})

type FormValues = z.infer<typeof formSchema>

export function TravelPlannerForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<string>("basic")
  const [formStep, setFormStep] = useState(0)
  const [otherInterest, setOtherInterest] = useState("")
  const [isValidatingDestination, setIsValidatingDestination] = useState(false)
  
  // List of popular destinations for validation
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      destination: "",
      startDate: null,
      endDate: null,
      budget: 5000,
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
        groupSize: data.groupSize,
        ageGroups: data.ageGroups,
        groupType: data.groupType,
        accommodationType: data.accommodationType || "",
        accommodationTypeSelect: data.accommodationTypeSelect || "",
        roomConfig: data.roomConfig || "",
        rentalCarNeeds: data.rentalCarNeeds || "",
        accessibilityNeeds: data.accessibilityNeeds || "",
        dietaryRestrictions: data.dietaryRestrictions || "",
        foodPreferences: data.foodPreferences || "",
        localFoodInterest: data.localFoodInterest,
        internationalFoodInterest: data.internationalFoodInterest,
        spendingPriority: data.spendingPriority,
        mustVisit: data.mustVisit || ""
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
    
    // Additional validation for destination
    if (formStep === 0) {
      const destination = form.getValues("destination");
      
      // Check if destination is valid
      if (destination) {
        setIsValidatingDestination(true);
        
        // Simple validation with a regex pattern
        const isValidDestination = /^[A-Za-z\s\-,.()]+$/.test(destination);
        
        if (!isValidDestination) {
          form.setError("destination", {
            type: "manual",
            message: "Please enter a valid destination",
          });
          setIsValidatingDestination(false);
          return;
        }
        
        setIsValidatingDestination(false);
      }
      
      // Additional validation for end date
      if (form.getValues("startDate") && form.getValues("endDate")) {
        const startDate = form.getValues("startDate");
        const endDate = form.getValues("endDate");
        
        if (endDate && startDate && endDate <= startDate) {
          form.setError("endDate", {
            type: "manual",
            message: "End date must be after start date",
          });
          return;
        }
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
      fields: ["destination", "startDate", "endDate", "travelDays", "openToSuggestions", "openToAISuggestions"],
    },
    {
      title: "Group & Preferences",
      description: "Tell us about your group and preferences",
      fields: [
        "groupSize", "ageGroups", "groupType", "hasChildren", "hasElderly", "hasMobilityNeeds", "dietaryRestrictions", "allergies",
        "budget", "spendingPriority", "accommodationType", "accommodationRequirements", "accommodationUnique", "foodPreferences", "localFoodInterest", "internationalFoodInterest", "mainInterests", "mustSee", "popularVsHidden", "itineraryPace", "wantsFreeTime", "transportModes", "multiModal", "accommodationTypeSelect", "desiredAmenities", "locationPreferences", "roomConfig", "rentalCarNeeds", "accessibilityNeeds"
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
  const AGE_GROUP_OPTIONS = ["Infants (0-2)", "Children (3-12)", "Teenagers (13-17)", "Adults (18-64)", "Seniors (65+)"];
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
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
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
                      control={form.control as any}
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
                                onChange={(e) => {
                                  field.onChange(e);
                                  // Clear error when typing
                                  if (form.formState.errors.destination) {
                                    form.clearErrors("destination");
                                  }
                                }}
                              />
                              {isValidatingDestination && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Enter a valid city, country, or region name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control as any}
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
                        control={form.control as any}
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
                                  selected={field.value as Date | undefined}
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
                        control={form.control as any}
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
                                  selected={field.value as Date | undefined}
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
                      control={form.control as any}
                      name="budget"
                      render={({ field }) => {
                        const [useCustomBudget, setUseCustomBudget] = useState(false);
                        const [customBudget, setCustomBudget] = useState(field.value.toString());
                        
                        return (
                          <FormItem>
                            <FormLabel>Budget (INR)</FormLabel>
                            <div className="space-y-4">
                              {!useCustomBudget ? (
                                <>
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
                                </>
                              ) : (
                                <FormControl>
                                  <div className="flex items-center">
                                    <span className="mr-2">₹</span>
                                    <Input
                                      type="number"
                                      min={5000}
                                      value={customBudget}
                                      onChange={(e) => {
                                        setCustomBudget(e.target.value);
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value) && value >= 5000) {
                                          field.onChange(value);
                                        }
                                      }}
                                      className="w-full"
                                      placeholder="Enter custom budget"
                                    />
                                  </div>
                                </FormControl>
                              )}
                              
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="custom-budget"
                                  checked={useCustomBudget}
                                  onChange={(e) => setUseCustomBudget(e.target.checked)}
                                  className="mr-2"
                                />
                                <label htmlFor="custom-budget" className="text-sm cursor-pointer">
                                  Enter custom budget
                                </label>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    
                    {/* Spending Priorities Section */}
                    <FormField
                      control={form.control as any}
                      name="spendingPriority"
                      render={({ field }) => {
                        const priorities = [
                          { value: "accommodation", label: "Accommodation", icon: "🏨", description: "Luxury or comfortable stays" },
                          { value: "activities", label: "Activities", icon: "🎭", description: "Experiences and attractions" },
                          { value: "food", label: "Food & Dining", icon: "🍽️", description: "Culinary experiences" },
                          { value: "transportation", label: "Transportation", icon: "🚗", description: "Getting around in style" }
                        ];
                        
                        return (
                          <FormItem>
                            <FormLabel>Spending Priorities</FormLabel>
                            <FormDescription>
                              Where would you prefer to allocate more of your budget?
                            </FormDescription>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                              {priorities.map((priority) => (
                                <FormControl key={priority.value}>
                                  <div
                                    className={cn(
                                      "flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer transition-all",
                                      field.value === priority.value
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-900/10"
                                    )}
                                    onClick={() => field.onChange(priority.value)}
                                  >
                                    <div className="text-2xl">{priority.icon}</div>
                                    <div className="space-y-1">
                                      <p className="font-medium leading-none">{priority.label}</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {priority.description}
                                      </p>
                                    </div>
                                  </div>
                                </FormControl>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    
                    <FormField
                      control={form.control as any}
                      name="interests"
                      render={({ field }) => {
                        // Parse the value as an array
                        const valueArray = field.value ? field.value.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
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
                                        let newArr = valueArray.filter((v: string) => v !== option);
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
                                      let newArr = valueArray.filter((v: string) => v !== "Other");
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
                                      let newArr = valueArray.filter((v: string) => v !== "Other" && !v.startsWith("Other:"));
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
                      render={({ field }) => {
                        const styles = ["Relaxed", "Adventurous", "Cultural", "Luxury", "Budget", "Romantic"];
                        const selectedStyles = field.value ? field.value.split(", ").filter(Boolean) : [];
                        const isOtherSelected = selectedStyles.some(style => style.startsWith("Other:"));
                        const otherValue = isOtherSelected 
                          ? selectedStyles.find(style => style.startsWith("Other:"))?.replace("Other:", "") 
                          : "";
                        const [otherInput, setOtherInput] = useState(otherValue || "");
                        
                        return (
                          <FormItem>
                            <FormLabel>Travel Style</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {styles.map((style) => (
                                    <Badge 
                                      key={style}
                                      variant={selectedStyles.includes(style) ? "default" : "outline"}
                                      className={cn(
                                        "cursor-pointer justify-center py-1.5",
                                        selectedStyles.includes(style) 
                                          ? "bg-blue-600 hover:bg-blue-700" 
                                          : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                      )}
                                      onClick={() => {
                                        const newStyles = selectedStyles.includes(style)
                                          ? selectedStyles.filter(s => s !== style)
                                          : [...selectedStyles, style];
                                        field.onChange(newStyles.join(", "));
                                      }}
                                    >
                                      {style}
                                    </Badge>
                                  ))}
                                  <Badge 
                                    variant={isOtherSelected ? "default" : "outline"}
                                    className={cn(
                                      "cursor-pointer justify-center py-1.5",
                                      isOtherSelected 
                                        ? "bg-blue-600 hover:bg-blue-700" 
                                        : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    )}
                                    onClick={() => {
                                      const newStyles = isOtherSelected
                                        ? selectedStyles.filter(s => !s.startsWith("Other:"))
                                        : [...selectedStyles, "Other:"];
                                      field.onChange(newStyles.join(", "));
                                    }}
                                  >
                                    Other
                                  </Badge>
                                </div>
                                
                                {isOtherSelected && (
                                  <Input
                                    placeholder="Please specify other travel style"
                                    value={otherInput}
                                    onChange={(e) => {
                                      setOtherInput(e.target.value);
                                      const newStyles = selectedStyles.filter(s => !s.startsWith("Other:"));
                                      if (e.target.value.trim()) {
                                        newStyles.push(`Other:${e.target.value.trim()}`);
                                      } else {
                                        newStyles.push("Other:");
                                      }
                                      field.onChange(newStyles.join(", "));
                                    }}
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>
                              Select all that apply to your travel preferences.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
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
                        const AGE_GROUP_OPTIONS = ["Infants (0-2)", "Children (3-12)", "Teenagers (13-17)", "Adults (18-64)", "Seniors (65+)"];
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
                              </div>
                            </FormControl>
                            <FormDescription>
                              Select all that apply to your group.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="accommodationTypeSelect"
                      render={({ field }) => {
                        const [showOther, setShowOther] = useState(field.value === "other");
                        const [otherValue, setOtherValue] = useState("");
                        
                        return (
                          <FormItem>
                            <FormLabel>Accommodation Type</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <select 
                                  value={field.value ?? ""} 
                                  onChange={e => {
                                    field.onChange(e.target.value);
                                    setShowOther(e.target.value === "other");
                                  }} 
                                  className="w-full border rounded px-3 py-2"
                                >
                                  <option value="">Select type</option>
                                  <option value="hotel">Hotel</option>
                                  <option value="hostel">Hostel</option>
                                  <option value="airbnb">Airbnb</option>
                                  <option value="other">Other</option>
                                </select>
                                
                                {showOther && (
                                  <Input
                                    placeholder="Please specify accommodation type"
                                    value={otherValue}
                                    onChange={(e) => {
                                      setOtherValue(e.target.value);
                                    }}
                                    onBlur={() => {
                                      if (otherValue.trim()) {
                                        field.onChange(`other:${otherValue.trim()}`);
                                      } else {
                                        field.onChange("other");
                                      }
                                    }}
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>
                              Choose your preferred type of accommodation.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="desiredAmenities"
                      render={({ field }) => {
                        const options = ["WiFi", "Breakfast", "Gym", "Pool", "Pet-friendly"];
                        const valueArray = field.value || [];
                        const [showOther, setShowOther] = useState(valueArray.some(item => item.startsWith("Other:")));
                        const [otherValue, setOtherValue] = useState(
                          valueArray.find(item => item.startsWith("Other:"))?.replace("Other:", "") || ""
                        );
                        
                        return (
                          <FormItem>
                            <FormLabel>Desired Amenities</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <div className="flex flex-wrap gap-3">
                                  {options.map(option => (
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
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={showOther}
                                      onChange={e => {
                                        setShowOther(e.target.checked);
                                        let newArr = valueArray.filter(v => !v.startsWith("Other:"));
                                        if (e.target.checked && otherValue) {
                                          newArr.push(`Other:${otherValue}`);
                                        }
                                        field.onChange(newArr);
                                      }}
                                    />
                                    Other
                                  </label>
                                </div>
                                
                                {showOther && (
                                  <Input
                                    placeholder="Please specify other amenities"
                                    value={otherValue}
                                    onChange={(e) => {
                                      setOtherValue(e.target.value);
                                      let newArr = valueArray.filter(v => !v.startsWith("Other:"));
                                      if (e.target.value.trim()) {
                                        newArr.push(`Other:${e.target.value.trim()}`);
                                      }
                                      field.onChange(newArr);
                                    }}
                                  />
                                )}
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
                      name="rentalCarNeeds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rentals</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. car, bike, scooter, boat, etc." value={field.value ?? ""} onChange={field.onChange} />
                          </FormControl>
                          <FormDescription>
                            Specify any rental requirements for your trip.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Food Preferences Section */}
                    <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
                      <h3 className="font-medium text-lg">Food Preferences</h3>
                      
                      <FormField
                        control={form.control as any}
                        name="dietaryRestrictions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dietary Restrictions</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. vegetarian, vegan, gluten-free, nut allergies" 
                                value={field.value ?? ""} 
                                onChange={field.onChange} 
                              />
                            </FormControl>
                            <FormDescription>
                              List any dietary restrictions or allergies.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control as any}
                        name="foodPreferences"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Food Preferences</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your food preferences, cuisines you enjoy, or specific dishes you'd like to try" 
                                value={field.value ?? ""} 
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormDescription>
                              Tell us about your food preferences for this trip.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control as any}
                          name="localFoodInterest"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Local Cuisine</FormLabel>
                                <FormDescription>
                                  Interested in trying local dishes
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control as any}
                          name="internationalFoodInterest"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">International Cuisine</FormLabel>
                                <FormDescription>
                                  Interested in international restaurants
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
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
                type="button" 
                onClick={form.handleSubmit(onSubmit as any)}
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
