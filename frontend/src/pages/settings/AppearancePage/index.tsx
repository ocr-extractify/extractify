import { Separator } from "@/components/ui/separator"
import { AppearanceForm } from "./fragments/appearance-form"
import { useTranslation } from "react-i18next"
import { PaintbrushIcon } from "lucide-react";

export default function SettingsAppearancePage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <PaintbrushIcon className="w-4 h-4" />
          <h3 className="text-lg font-medium">{t("APPEARANCE")}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("SETTINGS_APPEARANCE_FORM_DESCRIPTION")}
        </p>
      </div>
      <Separator />
      <AppearanceForm />
    </div>
  )
}