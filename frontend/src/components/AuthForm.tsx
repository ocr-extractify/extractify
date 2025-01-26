import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { twMerge } from "tailwind-merge"
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom"
import { UseMutationResult } from "@tanstack/react-query"
import { UserAuth } from "@/utils/types/api/auth"

interface Props {
  type: "signin" | "signup"
  mutation: UseMutationResult<unknown, unknown, UserAuth, unknown>;
}

export function AuthForm({
  type,
  mutation,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & Props) {
  const { t } = useTranslation()
  const nav = useNavigate();
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    return mutation.mutateAsync({
      username: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    }).then(() => {
      nav('/')
    })
  }

  return (
    <div className={twMerge("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('WELCOME_BACK')}</CardTitle>
          <CardDescription>
            {type === 'signin' ? t('SIGNIN_WITH_GOOGLE_OR_EMAIL') : t('SIGNUP_WITH_GOOGLE_OR_EMAIL')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {type === 'signin' ? t('SIGNIN_WITH_GOOGLE') : t("SIGNUP_WITH_GOOGLE")}
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  {t("OR_CONTINUE_WITH")}
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("EMAIL")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">{t("PASSWORD")}</Label>
                    {type === 'signin' && (
                      <Link
                        to="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        {t("FORGOT_YOUR_PASSWORD")}
                      </Link>
                    )}
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" isLoading={mutation.isPending}>
                  {type === 'signup' ? t("SIGN_UP") : t("SIGN_IN")}
                </Button>
              </div>
              
              <div className="text-center text-sm">
                {type === 'signin' ? t('DONT_HAVE_AN_ACCOUNT') : t("ALREADY_HAVE_AN_ACCOUNT")}{" "}
                <Link to={type === 'signin' ? '/auth/signup' : '/auth/signin'} className="underline underline-offset-4">
                  {type === 'signin' ? t("SIGN_UP") : "Sign in"} 
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        {t("AUTH_SCREEN_TERMS_OF_SERVICE_AGREE")} <Link to="#">{t('TERMS_OF_SERVICE')}</Link>{" "}
        {t('AND')} <Link to="#">{t('PRIVACY_POLICY')}</Link>.
      </div>
    </div>
  )
}
