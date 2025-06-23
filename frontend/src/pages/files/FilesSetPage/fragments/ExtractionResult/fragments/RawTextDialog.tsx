import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const RawTextDialog = ({
  text,
  triggerButtonVariant,
}: {
  text: string;
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
        <Button variant={triggerButtonVariant || 'outline'}>
          {t('RAW_TEXT')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('RAW_TEXT_RESULT_MODAL_TITLE')}</DialogTitle>
          <DialogDescription>
            {t('RAW_TEXT_RESULT_MODAL_DESC')}
          </DialogDescription>
        </DialogHeader>
        {text}
      </DialogContent>
    </Dialog>
  );
};

export default RawTextDialog;
