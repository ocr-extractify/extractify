import { VALID_MIMETYPES } from '@/constants/constraints';
// import { INVALID_MIMETYPE } from '@/constants/errorsMsgs';
import {
  DROP_FILES,
  FILENAME,
  FILESIZE,
  FILE_INPUT_MIMETYPES,
  OR_DRAG_AND_DROP,
  UPLOAD_FILE,
} from '@/constants/uiTexts';
import {
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
// import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import IconButton from '@/components/buttons/IconButton';
import { LuImagePlus } from 'react-icons/lu';

interface Props extends ComponentProps<'input'> {
  id: string;
  files: File[] | [];
  setFiles: React.Dispatch<React.SetStateAction<[] | File[]>>;
}

const FileInput = ({ id, files, setFiles, ...rest }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const isValidMimetype = useCallback(
    async (mimetype: string): Promise<boolean> => {
      if (VALID_MIMETYPES.includes(mimetype)) return true;
      // toast.error(INVALID_MIMETYPE);
      return false;
    },
    [],
  );

  const addFiles = useCallback(
    async (files: File[] | FileList | null) => {
      if (files) {
        const filesArray = Array.from(files);

        const arrayOfValidFileOrNull = await Promise.all(
          filesArray.map(async (file) => {
            const isValid = await isValidMimetype(file.type);
            if (isValid) return file;
            return null;
          }),
        );

        const isFile = (file: File | null): file is File => file !== null;
        const validFiles = arrayOfValidFileOrNull.filter(isFile);
        if (validFiles.length > 0) {
          setFiles((prevState) => [...prevState, ...validFiles]);
        }
      }
    },
    [isValidMimetype, setFiles],
  );

  const removeFile = useCallback(
    async (filename: string) => {
      setFiles((prevState) =>
        prevState.filter((file) => file.name !== filename),
      );
    },
    [setFiles],
  );

  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(event.target.files);
    },
    [addFiles],
  );

  const handleDrag = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        dragCounter.current = 0;
        event.dataTransfer.clearData();
        setFiles((prevState) => [...prevState, ...event.dataTransfer!.files]);
      }
    },
    [setFiles],
  );

  const handleDragIn = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current++;
    if (event.dataTransfer?.items && event.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current > 0) return;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener('dragenter', handleDragIn);
    window.addEventListener('dragleave', handleDragOut);
    window.addEventListener('dragover', handleDrag);
    window.addEventListener('drop', handleDrop);

    return function cleanUp() {
      window.removeEventListener('dragenter', handleDragIn);
      window.removeEventListener('dragleave', handleDragOut);
      window.removeEventListener('dragover', handleDrag);
      window.removeEventListener('drop', handleDrop);
    };
  });

  return (
    <div>
      {isDragging && (
        <div className="w-full absolute inset-0 bg-gray-300 dark:bg-gray-900 opacity-75 flex flex-col justify-center items-center z-50">
          <LuImagePlus
            className="mx-auto h-12 w-12"
            stroke="currentColor"
            fill="none"
          />
          <p className="text-lg font-medium">{DROP_FILES}</p>
        </div>
      )}

      <div>
        <label>
          <div className="h-52 sm:pt-5">
            <div className="w-full h-full mt-1 sm:mt-0">
              <div className="h-full flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <LuImagePlus
                    className="mx-auto w-10 h-10 sm:h-12 sm:w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                  />

                  <div className="flex flex-col sm:flex-row justify-center text-sm text-gray-700 dark:text-gray-100">
                    <span>{UPLOAD_FILE}</span>
                    <input
                      id={id}
                      type="file"
                      className="sr-only"
                      onChange={handleChange}
                      {...rest}
                    />

                    <p className="pl-1">{OR_DRAG_AND_DROP}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {FILE_INPUT_MIMETYPES}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </label>
        <ul className="mt-2 space-y-2">
          {files.map((file) => (
            <li
              key={file.name}
              className="flex flex-col justify-between border rounded-md p-2 font-medium relative pr-10 text-gray-900 dark:text-gray-300"
            >
              <span className="w-full flex justify-between">
                <span>{FILENAME}</span>
                <span className="truncate">{file.name}</span>
              </span>
              <span className="w-full flex justify-between">
                <span>{FILESIZE}</span>
                <span className="truncate">
                  {(file.size / 1000 / 1000).toFixed(2)} MB
                </span>
              </span>

              <IconButton
                onClick={() => removeFile(file.name)}
                className="absolute right-2 top-1.5"
              >
                <IoClose className="w-5 h-5" />
              </IconButton>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileInput;
