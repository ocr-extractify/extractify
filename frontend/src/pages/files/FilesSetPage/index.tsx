import { httpClient } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const FilesSetPage = () => {
  const { id } = useParams<{ id: string }>();
  const filesSet = useQuery({
    queryKey: ['filesSet', id],
    queryFn: () => httpClient.get(`/files/sets/${id}`),
  });

  console.log("filesSet", filesSet);

  return (
    <>
      <h1>{filesSet.data?.data?.name}</h1>

      <h2>Files</h2>

    </>
  );
};

export default FilesSetPage;
