import { httpClient } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

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
      <h1>{filesSet.data?.data?.name}</h1>

      {filesSet.data?.data?.files?.map((file: any) => (
        <div key={file.id}>
          <h2>{file.file.name}</h2>

          <h3>Dados extraídos</h3>

          <div>
            {file.file.ocr_extractions?.map((ocrExtraction: any) => (
              <div className='space-y-5'>
                <div>
                  <p>text: </p>
                  <p>{ocrExtraction.text}</p>
                </div>
                <ul>
                  {ocrExtraction.regex_extractions?.map((regexExtraction: any) => (
                    <li key={regexExtraction.field}>
                      {regexExtraction.field}: {regexExtraction.value}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}

    </>
  );
};

export default FilesSetPage;
