import * as React from 'react';
import { Upload } from 'lucide-react';
import Dropzone, { type FileRejection } from 'react-dropzone';
import { useControllableState } from '@/hooks/use-controllable-state';
import { ScrollArea } from '@/components/ui/scroll-area';
import { twMerge } from 'tailwind-merge';
import { formatBytes } from '@/utils/datastructures/bytes';
import { useToast } from '@/hooks/use-toast';
import isFileWithPreview from './utils/isFileWithPreview';
import FileCard from './fragments/FileCard';
import type { FileUploaderProps } from './types';
import { useTranslation } from 'react-i18next';

export function FileUploader(props: FileUploaderProps) {
  const { t } = useTranslation();
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = {
      'image/*': [],
      'application/pdf': [],
    },
    maxSize = props.maxSize || 1024 * 1024 * 2, // 2MB
    maxFileCount = props.maxFileCount || 5,
    multiple = props.multiple || false,
    disabled = props.disabled || false,
    className,
    ...dropzoneProps
  } = props;
  const { toast } = useToast();
  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
        toast({ title: 'Cannot upload more than 1 file at a time' });
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
        toast({ title: `Cannot upload more than ${maxFileCount} files` });
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast({ title: `File ${file.name} was rejected ` });
        });
      }

      // if (
      //   onUpload &&
      //   updatedFiles.length > 0 &&
      //   updatedFiles.length <= maxFileCount
      // ) {
      //   const target =
      //     updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`

      //   toast.promise(onUpload(updatedFiles), {
      //     loading: `Uploading ${target}...`,
      //     success: () => {
      //       setFiles([])
      //       return `${target} uploaded`
      //     },
      //     error: `Failed to upload ${target}`,
      //   })
      // }
    },

    [files, maxFileCount, multiple, onUpload, setFiles],
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount;

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFileCount}
        multiple={maxFileCount > 1 || multiple}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={twMerge(
              'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isDragActive && 'border-muted-foreground/50',
              isDisabled && 'pointer-events-none opacity-60',
              className,
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <Upload
                    className="size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <p className="font-medium text-muted-foreground">
                  {t('DROP_FILES_HERE')}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <Upload
                    className="size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col gap-px">
                  <p className="font-medium text-muted-foreground">
                    {t('DRAG_DROP_FILES_HERE')}
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    {t('YOU_CAN_UPLOAD')}
                    {maxFileCount > 1
                      ? ` ${
                          maxFileCount === Infinity ? 'multiple' : maxFileCount
                        }
                      ${t('FILES_UPLOAD_LIMIT', {
                        maxSize: formatBytes(maxSize),
                      })}`
                      : ` ${t('FILE_UPLOAD_LIMIT', {
                          maxSize: formatBytes(maxSize),
                        })}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>

      {files?.length ? (
        <ScrollArea className="h-fit w-full px-3">
          <div className="flex max-h-48 flex-col gap-4">
            {files?.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => onRemove(index)}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
}
