import { Separator } from "@/components/ui/separator"
import { useTranslation } from "react-i18next"
import { PwdUpdateForm } from "./fragments/pwd-update-form"
import { LockIcon } from "lucide-react"

export default function PwdUpdatePage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <LockIcon className="w-4 h-4" />
          <h1 className="text-lg font-medium">{t("PWD_UPDATE_TITLE")}</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("PWD_UPDATE_DESCRIPTION")}
        </p>
      </div>
      <Separator />
      <PwdUpdateForm />
    </div>
  )
}