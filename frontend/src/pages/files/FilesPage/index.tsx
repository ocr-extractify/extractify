import { useState } from 'react';
import IconButton from '@/components/buttons/IconButton';
import { APIFile } from '@/utils/types';
import { useFilesStore } from '@/utils/zustandStorage';
import { RiDeleteBinLine } from 'react-icons/ri';
import { LiaExternalLinkAltSolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { httpClient } from '@/utils/axios';
import { GET_STARTED, NO_FILES } from '@/constants/uiTexts';
import Button from '@/components/buttons/Button';
import { LuImagePlus } from 'react-icons/lu';
import { FaPlus } from 'react-icons/fa6';
import SearchInput from '@/components/inputs/SearchInput';

const FilesPage = () => {
  const [query, setQuery] = useState('');
  const nav = useNavigate();
  const files = useFilesStore((state) =>
    state.files.filter((file) =>
      file.name.toLowerCase().includes(query.toLowerCase()),
    ),
  );
  const removeFile = useFilesStore((state) => state.remove);
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return httpClient.delete(`/files/${id}`).then(() => {
        removeFile(id);
      });
    },
  });

  return (
    <div className="space-y-4 mt-4">
      <SearchInput setQuery={setQuery} />

      {files.length === 0 && (
        <div className="flex flex-col justify-center items-center sm:pt-20">
          <LuImagePlus className="h-12 w-12 text-gray-400" />
          <h2 className="text-gray-900 dark:text-gray-100 mt-2 text-sm font-medium ">
            {NO_FILES}
          </h2>
          <h3 className="text-gray-500 dark:text-gray-300 mt-1 text-sm">
            {GET_STARTED}
          </h3>

          <Button
            className="mt-2 flex items-center"
            onClick={() => nav('/upload')}
          >
            <FaPlus className="w-3 h-3 mr-2" />
            <span>Upload a file</span>
          </Button>
        </div>
      )}

      {files.map((file: APIFile) => (
        <div
          key={file._id}
          className="flex justify-between bg-white dark:bg-slate-900 mt-4 rounded-md p-2 shadow-sm"
        >
          <span className="font-medium truncate">{file.name}</span>

          <div className="flex">
            <IconButton
              onClick={() => {
                deleteMutation.mutateAsync(file._id);
              }}
            >
              <RiDeleteBinLine className="w-5 h-5" />
            </IconButton>

            <IconButton onClick={() => nav(`/files/${file._id}`)}>
              <LiaExternalLinkAltSolid className="w-5 h-5" />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilesPage;
