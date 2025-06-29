"use client"

import { forwardRef, useId, useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next"
import { cn } from "@/utils/cn"

interface PwdInputProps extends React.ComponentProps<typeof Input> {
  label?: string
  showLabel?: boolean
  loading?: boolean
}

const PwdInput = forwardRef<HTMLInputElement, PwdInputProps>(
  ({ className, label, showLabel = true, loading = false, ...props }, ref) => {
    const id = useId()
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const { t } = useTranslation()

    const toggleVisibility = () => setIsVisible((prevState) => !prevState)

    return (
      <div className="*:not-first:mt-2">
        {showLabel && (
          <Label htmlFor={id}>
            {label || t("PWD_INPUT_LABEL")}
          </Label>
        )}
        <div className="relative">
          <Input
            {...props}
            ref={ref}
            id={id}
            className={cn("pe-9", className)}
            placeholder={props.placeholder || t("NEW_PWD_INPUT_PLACEHOLDER")}
            type={isVisible ? "text" : "password"}
            disabled={loading}
          />
          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? t("PWD_INPUT_HIDE_LABEL") : t("PWD_INPUT_SHOW_LABEL")}
            aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? (
              <EyeOffIcon size={16} aria-hidden="true" />
            ) : (
              <EyeIcon size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    )
  }
)

PwdInput.displayName = "PwdInput"

export default PwdInput
