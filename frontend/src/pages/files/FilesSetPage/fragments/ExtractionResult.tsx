import { httpClient } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';

// TODO: add types to filesSet
const ExtractionResult = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const filesSet = useQuery({
    queryKey: ['filesSet', id],
    queryFn: () => httpClient.get(`/files/sets/${id}`),
  });

  return (
    <>
      {filesSet.data?.data?.files?.map((file: any) => (
        <div key={file.id} className="*:my-4">
          {file.file.ocr_extractions?.map((ocrExtraction: any) => (
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className='truncate'>{file.file.name}</CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
                <CardAction>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        {t('RAW_TEXT')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{t('RAW_TEXT_RESULT_MODAL_TITLE')}</DialogTitle>
                        <DialogDescription>
                          {t('RAW_TEXT_RESULT_MODAL_DESC')}
                        </DialogDescription>
                      </DialogHeader>
                      {ocrExtraction.text}
                    </DialogContent>
                  </Dialog>
                </CardAction>
              </CardHeader>
              <CardContent>
                <ul className="*:py-2 divide-y-2 divide-accent">
                  {ocrExtraction.regex_extractions?.map((regexExtraction: any) => (
                    <li key={regexExtraction.field} className="flex justify-between">
                      <span>{regexExtraction.name}</span>
                      <span>{regexExtraction.value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </>
  );
};

export default ExtractionResult;
