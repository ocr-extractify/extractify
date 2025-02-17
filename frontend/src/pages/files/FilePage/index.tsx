// import Result from '@/fragments/Result';
import { httpClient } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const FilePage = () => {
  const { id } = useParams<{ id: string }>();
  const analyzedFile = useQuery({
    queryKey: ['analyzedFile', id],
    queryFn: () => httpClient.get(`/files/${id}`),
  });

  return (
    <p>under dev</p>
    // <Result
    //   result={analyzedFile.data?.data}
    //   isLoading={analyzedFile.isLoading}
    // />
  );
};

export default FilePage;
