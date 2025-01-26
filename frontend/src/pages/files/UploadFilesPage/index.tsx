import { SUBMIT_BUTTON } from '@/constants/uiTexts';
// import FileInput from '@/components/inputs/FileInput';
// import { VALID_MIMETYPES } from '@/constants/constraints';
import { useMutation } from '@tanstack/react-query';
import { httpClient } from '@/utils/axios';
import { Button } from '@/components/ui/button';
// import { toast } from 'react-toastify';
import { useFilesStore } from '@/utils/zustandStorage';
import { useState } from 'react';
import { APIFile } from '@/utils/types';
import Result from '@/fragments/Result';
import { FileStoreState } from '@/utils/zustandStorage/types';
import { NO_FILE } from '@/constants/errorsMsgs';
import { BsFillFileEarmarkArrowUpFill } from "react-icons/bs";
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/ui/file-uploader';
import { Separator } from '@radix-ui/react-separator';
import { useTranslation } from 'react-i18next';

function UploadFilesPage() {
  const { t } = useTranslation();
  const [results, setResults] = useState<null | APIFile[]>(null);
  const [files, setFiles] = useState<File[] | []>([]);
  const addFile = useFilesStore((state: FileStoreState) => state.add);
  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      return httpClient
        .post('/files/upload/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          addFile(res.data);
          setResults((prevState) => [...(prevState || []), res.data]);
        })
        .catch((err) => {
          toast.error(err.response.data.detail);
        });
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (files.length === 0) {
      toast.error(NO_FILE);
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
      {!results ? (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">{t("UPLOAD")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("UPLOAD_FILES_FORM_DESCRIPTION")}
            </p>
          </div>
          
          <Separator />

          <form
            className="w-full flex flex-col"
            onSubmit={handleSubmit}
          >
            <Label className='mb-2'>Files</Label>
            {/* <FileInput
              id="files"
              files={files}
              setFiles={setFiles}
              multiple
              accept={VALID_MIMETYPES.join(',')}
            /> */}
            <FileUploader
              value={files}
              onValueChange={setFiles}
              multiple
            />
            <Button
              className="w-fit mt-2 mx-auto space-x-2 flex items-center"
              isLoading={uploadFileMutation.isPending}
            >
              <span className='uppercase font-medium'>{SUBMIT_BUTTON}</span>
              <BsFillFileEarmarkArrowUpFill className='w-4 h-4'/>
            </Button>
          </form>
          </div>
      ) : (
        <div className="space-y-10 divide-y-2">
          {results.map((result) => (
            <Result result={result} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadFilesPage;
