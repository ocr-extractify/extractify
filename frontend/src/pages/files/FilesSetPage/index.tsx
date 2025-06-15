import { httpClient } from '@/utils/axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/flat-tabs';
import ExtractionResult from './fragments/ExtractionResult';
import ExtractionConfig from './fragments/ExtractionConfig';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import download from '@/utils/download';

// TODO: add types to filesSet
const FilesSetPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
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

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">{filesSet.data?.data?.name}</h1>
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
        <TabsContent value="stats"></TabsContent>
      </Tabs>
    </>
  );
};

export default FilesSetPage;
