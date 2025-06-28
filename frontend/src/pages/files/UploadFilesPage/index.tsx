import { useMutation } from '@tanstack/react-query';
import { httpClient } from '@/utils/axios';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/ui/file-uploader';
import { Separator } from '@radix-ui/react-separator';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import {
  DataExtractionRegexField,
  defaultRegexFields,
} from '@/constants/dataExtractionRegexFields';
import RegexForm, { RegexFormRef } from './fragments/RegexForm';
import { useNavigate } from 'react-router-dom';

function UploadFilesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[] | []>([]);
  const [regexFields, setRegexFields] =
    useState<DataExtractionRegexField[]>(defaultRegexFields);
  const regexFormRef = useRef<RegexFormRef>(null);
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
        name: t('EXTRACTION') + ' ' + new Date().toLocaleString(),
        file_ids: file_ids,
      });
      return api_file_set.data;
    },
    onSuccess: (response) => {
      console.log('response', response);
      toast({ title: t('FILE_SET_CREATED') });
      navigate(`/files/sets/${response.id}`);
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    // Validate RegexForm before proceeding
    const isRegexFormValid = await regexFormRef.current?.validateForm();
    if (!isRegexFormValid) {
      toast({ title: t('FORM_VALIDATION_ERROR') });
      setIsLoading(false);
      return;
    }

    if (regexFields.length === 0) {
      toast({ title: t('NO_REGEX_FIELDS') });
      setIsLoading(false);
      return;
    }

    if (files.length === 0) {
      toast({ title: t('NO_FILE') });
      setIsLoading(false);
      return;
    }

    toast({ title: t('CREATING_FILE_SET') });

    const filesIds: string[] = [];
    const filesArray: File[] = Array.from(files);

    await Promise.all(
      filesArray.map(async (file: File, index: number) => {
        const file_id = await uploadFileMutation.mutateAsync(file);
        console.log('file_id', file_id);

        toast({
          title: t('EXTRACTING_DATA_FROM_FILE', {
            current: index + 1,
            total: filesArray.length,
          }),
        });

        createFileOcrExtractionMutation.mutateAsync(file_id);
        filesIds.push(file_id);
      }),
    );

    await createFileSetMutation.mutateAsync(filesIds);
    setIsLoading(false);
  }

  return (
    <div className="mx-auto w-full">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">{t('CREATE_EXTRACTION')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('CREATE_EXTRACTION_DESCRIPTION')}
          </p>
        </div>

        <Separator />

        <RegexForm 
          ref={regexFormRef}
          regexFields={regexFields} 
          setRegexFields={setRegexFields} 
        />

        <form className="w-full flex flex-col" onSubmit={handleSubmit}>
          <Label className="mb-2">{t('FILES')}</Label>

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
            isLoading={isLoading || uploadFileMutation.isPending}
          >
            <span className="uppercase font-medium">{t('CREATE')}</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

export default UploadFilesPage;
