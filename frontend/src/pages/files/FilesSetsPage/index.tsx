import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/utils/axios';
import { FileText } from 'lucide-react';
import EmptyState from '@/components/ui/empty-state';

const FilesSetsPage = () => {
  const [query, setQuery] = useState('');
  const filesSet = useQuery({
    queryKey: ['files', { query }],
    queryFn: () => httpClient.get('/files/sets/'),
  })

  if(filesSet?.data?.data.length === 0) { 
    return <EmptyState />
  }

  return (
    <div className="grid sm:grid-cols-3 gap-4 w-full max-w-4xl mx-auto p-4">
      {/**TODO: type apiFile properly */}
      {filesSet?.data?.data?.map((apiFileSet: any) => (
        <Card>
          <CardHeader>
            {apiFileSet.files?.[0]?.file?.mimetype?.name === "application/pdf" ? (
              <FileText className="size-10 text-muted-foreground" aria-hidden="true" />
            ) : (
              <img
                src={apiFileSet.files?.[0]?.file?.uri}
                alt="Image 1"
                className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
                width="300"
                height="300"
              />
            )}
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-bold">{apiFileSet.name}</h2>
            <div className="flex items-center space-x-2 mt-2">
              <Link to={`/files/sets/${apiFileSet.id}`} className="text-blue-500 hover:underline" >
                View more
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // return (
  //   <div className="space-y-4 mt-4">
  //     <SearchInput setQuery={setQuery} />

  //     {files.length === 0 && (
  //       <div className="flex flex-col justify-center items-center sm:pt-20">
  //         <LuImagePlus className="h-12 w-12 text-gray-400" />
  //         <h2 className="text-gray-900 dark:text-gray-100 mt-2 text-sm font-medium ">
  //           {NO_FILES}
  //         </h2>
  //         <h3 className="text-gray-500 dark:text-gray-300 mt-1 text-sm">
  //           {GET_STARTED}
  //         </h3>

  //         <Button
  //           className="mt-2 flex items-center"
  //           onClick={() => nav('/upload')}
  //         >
  //           <FaPlus className="w-3 h-3 mr-2" />
  //           <span>Upload a file</span>
  //         </Button>
  //       </div>
  //     )}

  //     {files.map((file: APIFile) => (
  //       <div
  //         key={file._id}
  //         className="flex justify-between bg-white dark:bg-slate-900 mt-4 rounded-md p-2 shadow-sm"
  //       >
  //         <span className="font-medium truncate">{file.name}</span>

  //         <div className="flex">
  //           <IconButton
  //             onClick={() => {
  //               deleteMutation.mutateAsync(file._id);
  //             }}
  //           >
  //             <RiDeleteBinLine className="w-5 h-5" />
  //           </IconButton>

  //           <IconButton onClick={() => nav(`/files/${file._id}`)}>
  //             <LiaExternalLinkAltSolid className="w-5 h-5" />
  //           </IconButton>
  //         </div>
  //       </div>
  //     ))}
  //   </div>
  // );
};

export default FilesSetsPage;
