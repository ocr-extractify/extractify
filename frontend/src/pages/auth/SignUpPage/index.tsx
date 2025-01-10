import { GalleryVerticalEnd } from "lucide-react"
import { AuthForm } from "@/components/AuthForm"
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@/providers/AuthProvider"
import { UserLogin } from "@/utils/types/api/auth"

export default function SignUpPage() {
  const { signup } = useAuth()
  const mutation = useMutation({
    mutationFn: async (data: UserLogin) => {
      return signup(data)
    }
  })

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          File to text.
        </a>
        <AuthForm type="signup" mutation={mutation} />
      </div>
    </div>
  )
}
