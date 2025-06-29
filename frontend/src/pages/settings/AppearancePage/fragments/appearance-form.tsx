import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/providers/theme-provider"
import { useTranslation } from "react-i18next"
import { AVAILABLE_THEMES, getCurrentCustomTheme, setCurrentCustomTheme, type CustomTheme } from "@/lib/theme-utils"
import { useEffect, useState } from "react"

export function AppearanceForm() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [currentCustomTheme, setCurrentCustomThemeState] = useState<CustomTheme>(getCurrentCustomTheme());

  const appearanceFormSchema = z.object({
    theme: z.enum(["light", "dark", "system"], {
      required_error: t("PLEASE_SELECT_A_THEME"),
    }),
    customTheme: z.string().min(1, t("PLEASE_SELECT_A_CUSTOM_THEME") || "Please select a custom theme"),
  })
  
  type AppearanceFormValues = z.infer<typeof appearanceFormSchema>
  
  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: { 
      theme: theme || 'system',
      customTheme: currentCustomTheme,
    },
  })

  // Update form when theme changes externally
  useEffect(() => {
    form.setValue('theme', theme || 'system');
    form.setValue('customTheme', currentCustomTheme);
  }, [theme, currentCustomTheme, form]);

  function onSubmit(data: AppearanceFormValues) {
    // Apply light/dark theme
    setTheme(data.theme)
    
    // Apply custom theme
    setCurrentCustomTheme(data.customTheme as CustomTheme)
    setCurrentCustomThemeState(data.customTheme as CustomTheme)
    
    toast({
      title: t("PREFERENCES_UPDATED"),
      description: t("THEME_UPDATED_SUCCESSFULLY") || "Your theme preferences have been updated",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Light/Dark Mode Selection */}
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>{t("THEME")}</FormLabel>
              <FormDescription>
                {t("SELECT_THEME")}
              </FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="light" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                      <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                        <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      {t("LIGHT")}
                    </span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="dark" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                        <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      {t("DARK")}
                    </span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        {/* Custom Theme Selection */}
        <FormField
          control={form.control}
          name="customTheme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>{t("COLOR_THEME") || "Color Theme"}</FormLabel>
              <FormDescription>
                {t("SELECT_COLOR_THEME_DESCRIPTION") || "Choose a color theme that will be applied on top of your light/dark preference"}
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue placeholder={t("SELECT_COLOR_THEME") || "Select a color theme"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AVAILABLE_THEMES.map((theme) => (
                    <SelectItem key={theme.name} value={theme.name}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{t("UPDATE_PREFERENCES")}</Button>
      </form>
    </Form>
  )
}