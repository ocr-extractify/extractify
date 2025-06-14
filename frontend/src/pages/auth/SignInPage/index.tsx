import { FileText } from 'lucide-react';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation } from '@tanstack/react-query';
import { UserAuth } from '@/utils/types/api/auth';
import { APP_NAME } from '@/constants/ui';

export default function SignInPage() {
  const { signin } = useAuth();
  const mutation = useMutation({
    mutationFn: async (data: UserAuth) => {
      return signin(data);
    },
  });

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileText className="size-4" />
          </div>
          {/* <img src={logo} alt="logo" className="size-12" /> */}
          {APP_NAME}
        </a>
        <AuthForm type="signin" mutation={mutation} />
      </div>
    </div>
  );
}
