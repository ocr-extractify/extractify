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
import RegexForm from './fragments/RegexForm';
import { DataExtractionRegexField } from '@/constants/dataExtractionRegexFields';

const DEFAULT_REGEX_FIELDS: DataExtractionRegexField[] = [
  { name: 'Email', regex: 'email' },
];

function UploadFilesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[] | []>([]);
  const [regexFields, setRegexFields] = useState<DataExtractionRegexField[]>(DEFAULT_REGEX_FIELDS);
  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      return httpClient
        .post('/files/upload/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .catch((err) => {
          toast({ title: err.response.data.detail });
        });
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (files.length === 0) {
      toast({ title: NO_FILE });
      return;
    }

    const filesArray: File[] = Array.from(files);
    Promise.all(
      filesArray.map((file: File) => {
        return uploadFileMutation.mutateAsync(file);
      }),
    );
  }

  return (
    <div className="mx-auto w-full">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">{t("UPLOAD")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("UPLOAD_FILES_FORM_DESCRIPTION")}
          </p>
        </div>

        <Separator />

        <RegexForm
          regexFields={regexFields}
          setRegexFields={setRegexFields}
        />

        <form
          className="w-full flex flex-col"
          onSubmit={handleSubmit}
        >
          <Label className='mb-2'>Files</Label>

          {/** TODO: use user limits to set FileUploader constraints. */}
          <FileUploader
            value={files}
            onValueChange={setFiles}
            multiple
          />

          <Button
            className="w-fit mt-4 flex items-center"
            isLoading={uploadFileMutation.isPending}
          >
            <span className='uppercase font-medium'>{t("UPLOAD")}</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

export default UploadFilesPage;
