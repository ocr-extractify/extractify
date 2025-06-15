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

// TODO: add types to filesSet
const FilesSetPage = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [isFilesSetNameEditing, setIsFilesSetNameEditing] = useState(false);
  const [filesSetName, setFilesSetName] = useState('');
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

  return (
    <>
      <div className="flex justify-between items-center space-x-2">
        {isFilesSetNameEditing ? (
          <Input
            type="text"
            value={filesSetName || filesSet.data?.data?.name}
            onChange={(e) => setFilesSetName(e.target.value)}
            onBlur={() => {
              renameFilesSetMutation.mutateAsync({ name: filesSetName });
              setIsFilesSetNameEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                renameFilesSetMutation.mutateAsync({ name: filesSetName });
                setIsFilesSetNameEditing(false);
              }
              if (e.key === 'Escape') {
                setIsFilesSetNameEditing(false);
              }
            }}
          />
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
              onClick={() => setIsFilesSetNameEditing(!isFilesSetNameEditing)}
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
