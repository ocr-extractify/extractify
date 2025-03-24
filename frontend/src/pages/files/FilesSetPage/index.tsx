import { httpClient } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/flat-tabs"
import ExtractionResult from './fragments/ExtractionResult';

// TODO: add types to filesSet
const FilesSetPage = () => {
  const { id } = useParams<{ id: string }>();
  const filesSet = useQuery({
    queryKey: ['filesSet', id],
    queryFn: () => httpClient.get(`/files/sets/${id}`),
  });

  console.log("filesSet", filesSet);
  return (
    <>
      <h1 className="text-2xl">{filesSet.data?.data?.name}</h1>



      <Tabs defaultValue="extraction_result">
        <TabsList >
          <TabsTrigger value="extraction_result">Extraction result</TabsTrigger>
          <TabsTrigger value="extraction_config">Extraction config</TabsTrigger>
        </TabsList>

        <TabsContent value="extraction_result">
          <ExtractionResult />
        </TabsContent>
        <TabsContent value="extraction_config">
          aaa
        </TabsContent>
      </Tabs>
    </>
  );
};

export default FilesSetPage;
