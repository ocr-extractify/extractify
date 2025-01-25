import { useTranslation } from "react-i18next"

const NotFoundPage = () => {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-center h-full">
        <span>{t("PAGE_NOT_FOUND")}</span>
    </div>
  )
}

export default NotFoundPage