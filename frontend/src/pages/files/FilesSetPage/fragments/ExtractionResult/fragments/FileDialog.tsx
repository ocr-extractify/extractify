import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const FileDialog = ({
  file_uri,
  triggerButtonVariant,
}: {
  file_uri: string;
  triggerButtonVariant?:
    | 'outline'
    | 'default'
    | 'none'
    | 'destructive'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'loading';
}) => {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={triggerButtonVariant || 'outline'}>{t('FILE')}</Button>
      </DialogTrigger>
      <DialogContent className="flex justify-center items-center">
        <img src={file_uri} alt="image" className="w-auto max-h-[600px]" />
      </DialogContent>
    </Dialog>
  );
};
export default FileDialog;
