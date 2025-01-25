import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useTranslation } from "react-i18next"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export function UserLanguageForm() {
  const { t, i18n } = useTranslation();
  const schema = z.object({
    lang: z.enum(["en", "pt"], {
      required_error: t("PLEASE_SELECT_A_LANGUAGE"),
    }),
  })  
  type UserLanguageFormValues = z.infer<typeof schema>
  const form = useForm<UserLanguageFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { lang: i18n.language as "en" | "pt" },
  })

  function onSubmit(data: UserLanguageFormValues) {
    i18n.changeLanguage(data.lang);
    // `i18next-browser-languagedetector` lib will lookup for the user's preferred language saved in localStorage (https://github.com/i18next/i18next-browser-languageDetector)
    localStorage.setItem("i18nextLng", data.lang);
    toast({
      title: t("PREFERENCES_UPDATED"),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="lang"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>{t("LANGUAGE")}</FormLabel>
              <FormDescription>
                {t("SELECT_YOUR_PREFERRED_LANGUAGE")}
              </FormDescription>

              <FormMessage />

              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="text-sm placeholder-gray-500 dark:placeholder-gray-400">
                  <SelectValue placeholder={t("SELECT_A_LANGUAGE")} />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="en">{t("ENGLISH")}</SelectItem>
                  <SelectItem value="pt">{t("PORTUGUESE")}</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button type="submit">{t("UPDATE_PREFERENCES")}</Button>
      </form>
    </Form>
  )
}