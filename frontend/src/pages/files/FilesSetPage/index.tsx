import { httpClient } from '@/utils/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/flat-tabs';
import ExtractionResult from './fragments/ExtractionResult';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Download, Pencil } from 'lucide-react';
import download from '@/utils/download';
import Stats from './fragments/Stats';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';



// TODO: add types to filesSet
const FilesSetPage = () => {
  const { t } = useTranslation();
  const fileSetNameSchema = z.object({
    name: z.string().min(1, t('FILE_SET_NAME_IS_REQUIRED')).trim(),
  });
  type FileSetNameForm = z.infer<typeof fileSetNameSchema>;
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const [isFilesSetNameEditing, setIsFilesSetNameEditing] = useState(false);
  
  const form = useForm<FileSetNameForm>({
    resolver: zodResolver(fileSetNameSchema),
    defaultValues: {
      name: '',
    },
  });

  const filesSet = useQuery({
    queryKey: ['filesSet', id],
    queryFn: () => httpClient.get(`/files/sets/${id}`),
  });

  const downloadMutation = useMutation({
    mutationFn: async () => {
      const response = await httpClient.get(`/files/sets/${id}/export`, {
        responseType: 'blob',
      });
      download(response.data, `export-${id}.csv`);
      return response.data;
    },
  });

  const renameFilesSetMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await httpClient.patch(`/files/sets/${id}/`, data);
      filesSet.refetch();
      queryClient.invalidateQueries({ queryKey: ['filesSets'] });
      return response.data;
    },
  });

  const handleStartEditing = () => {
    // Set the form value to current name when starting edit
    form.setValue('name', filesSet.data?.data?.name || '');
    setIsFilesSetNameEditing(true);
  };

  const handleSaveEdit = async (data: FileSetNameForm) => {
    try {
      await renameFilesSetMutation.mutateAsync({ name: data.name });
      setIsFilesSetNameEditing(false);
      form.reset();
    } catch (error) {
      // Handle error if needed
      console.error('Failed to rename file set:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsFilesSetNameEditing(false);
    form.reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      form.handleSubmit(handleSaveEdit)();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  return (
    <>
      <div className="flex justify-between items-center space-x-2">
        {isFilesSetNameEditing ? (
          <form onSubmit={form.handleSubmit(handleSaveEdit)} className="flex-1 relative">
            <Input
              {...form.register('name')}
              type="text"
              onBlur={form.handleSubmit(handleSaveEdit)}
              onKeyDown={handleKeyDown}
              autoFocus
              className={form.formState.errors.name ? 'border-red-500' : ''}
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1 absolute -bottom-6 left-0">
                {form.formState.errors.name.message}
              </p>
            )}
          </form>
        ) : (
          <div className="flex items-center gap-2">
            {filesSet.isLoading ? (
              <Skeleton className="w-24 h-4" />
            ) : (
              <h1 className="text-2xl">{filesSet.data?.data?.name}</h1>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={handleStartEditing}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
        )}

        <Button
          onClick={() => downloadMutation.mutateAsync()}
          isLoading={downloadMutation.isPending}
        >
          {t('EXPORT')}
          <Download className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="extraction_result">
        <TabsList>
          <TabsTrigger value="extraction_result">
            {t('EXTRACTION_RESULT')}
          </TabsTrigger>
          <TabsTrigger value="stats">{t('STATS')}</TabsTrigger>
        </TabsList>

        <TabsContent value="extraction_result">
          <ExtractionResult />
        </TabsContent>
        <TabsContent value="stats">
          <Stats />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default FilesSetPage;
