import { Separator } from "@/components/ui/separator"
import { UserLanguageForm } from "./fragments/user-language-form"
import { useTranslation } from "react-i18next"
import { LanguagesIcon } from "lucide-react";

export default function UserLanguagePage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <LanguagesIcon className="w-4 h-4" />
          <h3 className="text-lg font-medium">{t("LANGUAGE")}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("SETTINGS_LANGUAGE_FORM_DESCRIPTION")}
        </p>
      </div>
      <Separator />
      <UserLanguageForm />
    </div>
  )
}