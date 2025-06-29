import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import { httpClient } from "@/utils/axios"
import PwdInput from "@/components/ui/pwd-input"
import { toast } from "@/hooks/use-toast"


export function PwdUpdateForm() {
  const { t } = useTranslation();
  const schema = z.object({
    pwd: z.string().min(3, { message: t("PWD_UPDATE_MIN_LENGTH") }),
  })  
  type PwdUpdateValues = z.infer<typeof schema>
  const form = useForm<PwdUpdateValues>({
    resolver: zodResolver(schema),
    defaultValues: { pwd: "" },
  })
  const pwdMutation = useMutation({
    mutationFn: async (data: PwdUpdateValues) => {
      const formData = new FormData();
      formData.append("pwd", data.pwd);
      return httpClient.patch("/auth/reset_pwd", formData, {
        headers: {
          "Content-Type": "x-www-form-urlencoded",
        }
      });
    },
    onSuccess: () => {
      toast({
        title: t("PWD_UPDATE_SUCCESS"),
      })
    },
    onError: () => {
      toast({
        title: t("PWD_UPDATE_ERROR"),
      })
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => pwdMutation.mutateAsync(form.getValues()))} className="space-y-8">
        <FormField
          control={form.control}
          name="pwd"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormMessage />
              
              <PwdInput
                {...field}
                loading={pwdMutation.isPending}
              />
            </FormItem>
          )}
        />
      

        <Button type="submit" isLoading={pwdMutation.isPending}>{t("UPDATE_PWD")}</Button>
      </form>
    </Form>
  )
}