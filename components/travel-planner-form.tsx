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
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  budget: z.number().min(500, "Budget must be at least $500"),
  interests: z.string().optional(),
  travelStyle: z.string().optional(),
  isCollaborative: z.boolean().default(false),
  collaboratorEmails: z.string().optional(),
  inspirationUrl: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function TravelPlannerForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<string>("basic")
  const [formStep, setFormStep] = useState(0)
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      budget: 1000,
      interests: "",
      travelStyle: "",
      isCollaborative: false,
      collaboratorEmails: "",
      inspirationUrl: "",
    },
    mode: "onChange",
  })
  
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    // Validate end date is after start date
    if (data.endDate <= data.startDate) {
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
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
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
      if (form.getValues("endDate") <= form.getValues("startDate")) {
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
  const formSteps = [
    {
      title: "Destination & Dates",
      description: "Where and when do you want to travel?",
      fields: ["destination", "startDate", "endDate"],
    },
    {
      title: "Preferences",
      description: "Tell us about your travel style and interests",
      fields: ["budget", "interests", "travelStyle"],
    },
    {
      title: "Collaboration & Inspiration",
      description: "Add collaborators or inspiration sources",
      fields: ["isCollaborative", "collaboratorEmails", "inspirationUrl"],
    },
  ]
  
  // Reset the form and state
  const resetForm = () => {
    form.reset()
    setGeneratedItinerary(null)
    setFormStep(0)
    setActiveTab("basic")
  }
  
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
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
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
                                    if (startDate && date <= startDate) {
                                      form.setError("endDate", {
                                        type: "manual",
                                        message: "End date must be after start date",
                                      });
                                    } else {
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
                          <FormLabel>Budget (USD)</FormLabel>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">$500</span>
                              <span className="font-medium">${field.value}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">$10,000+</span>
                            </div>
                            <FormControl>
                              <Slider
                                min={500}
                                max={10000}
                                step={100}
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interests</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What are you interested in? (e.g., museums, hiking, food, nightlife)"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Help us tailor your itinerary to your interests.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
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
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        // Validate email format on change
                                        if (e.target.value) {
                                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                          const emails = e.target.value.split(',').map(email => email.trim());
                                          const allValid = emails.every(email => emailRegex.test(email));
                                          
                                          if (!allValid) {
                                            form.setError("collaboratorEmails", {
                                              type: "manual",
                                              message: "Please enter valid email addresses separated by commas",
                                            });
                                          } else {
                                            form.clearErrors("collaboratorEmails");
                                          }
                                        }
                                      }}
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
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  // Validate URL format on change
                                  if (e.target.value) {
                                    try {
                                      new URL(e.target.value);
                                      form.clearErrors("inspirationUrl");
                                    } catch {
                                      form.setError("inspirationUrl", {
                                        type: "manual",
                                        message: "Please enter a valid URL",
                                      });
                                    }
                                  } else {
                                    form.clearErrors("inspirationUrl");
                                  }
                                }}
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
