import { useMutation } from '@tanstack/react-query';
import { httpClient } from '@/utils/axios';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { NO_FILE } from '@/constants/errorsMsgs';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/ui/file-uploader';
import { Separator } from '@radix-ui/react-separator';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import {
  DataExtractionRegexField,
  defaultRegexFields,
} from '@/constants/dataExtractionRegexFields';
import RegexForm from './fragments/RegexForm';

function UploadFilesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[] | []>([]);
  const [regexFields, setRegexFields] =
    useState<DataExtractionRegexField[]>(defaultRegexFields);
  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const api_file = await httpClient.post('/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return api_file.data.id;
    },
  });
  const createFileOcrExtractionMutation = useMutation({
    mutationFn: async (file_id: string) => {
      const api_ocr_extraction = await httpClient.post(
        `/files/${file_id}/ocr_extractions/`,
        {
          regex_fields: regexFields,
        },
      );
      console.log('api_ocr_extraction', api_ocr_extraction);
    },
  });
  const createFileSetMutation = useMutation({
    mutationFn: async (file_ids: string[]) => {
      const api_file_set = await httpClient.post('/files/sets/', {
        name: t('FILES_SET') + ' ' + new Date().toLocaleString(),
        file_ids: file_ids,
      });
      console.log('api_file_set', api_file_set);
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (files.length === 0) {
      toast({ title: NO_FILE });
      return;
    }

    const filesIds: string[] = [];
    const filesArray: File[] = Array.from(files);
    await Promise.all(
      filesArray.map(async (file: File) => {
        const file_id = await uploadFileMutation.mutateAsync(file);
        console.log('file_id', file_id);
        createFileOcrExtractionMutation.mutateAsync(file_id);
        filesIds.push(file_id);
      }),
    );

    createFileSetMutation.mutateAsync(filesIds);
  }

  console.log('regexFields', regexFields);
  return (
    <div className="mx-auto w-full">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">{t('UPLOAD')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('UPLOAD_FILES_FORM_DESCRIPTION')}
          </p>
        </div>

        <Separator />

        <RegexForm regexFields={regexFields} setRegexFields={setRegexFields} />

        <form className="w-full flex flex-col" onSubmit={handleSubmit}>
          <Label className="mb-2">Files</Label>

          {/** TODO: use user limits to set FileUploader constraints. */}
          <FileUploader
            value={files}
            onValueChange={setFiles}
            multiple
            // TODO: in future, use user limits to set FileUploader constraints.
            maxFileCount={20}
          />

          <Button
            className="w-fit mt-4 flex items-center"
            isLoading={uploadFileMutation.isPending}
          >
            <span className="uppercase font-medium">{t('UPLOAD')}</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

export default UploadFilesPage;
