import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useMutation, useQuery } from '@tanstack/react-query';
import { httpClient } from '@/utils/axios';
import { FileText, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { mountBlobApiUri } from '@/utils/api/mount-blob-api-uri';
import { Input } from '@/components/ui/input';

const FilesSetsPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const filesSet = useQuery({
    queryKey: ['filesSets'],
    queryFn: () => httpClient.get('/files/sets/'),
  });
  const deleteMutation = useMutation({
    mutationKey: ['delete-fileset'],
    mutationFn: (id: string) => httpClient.delete(`/files/sets/${id}`),
    onSuccess: () => {
      filesSet.refetch();
    },
  });

  const filteredFilesSets = filesSet?.data?.data?.filter((fileSet: any) =>
    fileSet.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={t('SEARCH_FILES_SETS')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFilesSets?.map((apiFileSet: any) => (
          <Card className="relative">
            <Button
              variant="outline"
              className="absolute right-2 top-2"
              onClick={() => deleteMutation.mutateAsync(apiFileSet.id)}
            >
              <Trash2
                className="size-10 text-muted-foreground"
                aria-hidden="true"
              />
            </Button>

            <CardHeader>
              {apiFileSet.files?.[0]?.file?.mimetype?.name ===
              'application/pdf' ? (
                <FileText
                  className="size-10 text-muted-foreground"
                  aria-hidden="true"
                />
              ) : (
                <img
                  src={mountBlobApiUri(apiFileSet.files?.[0]?.file?.uri)}
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
                <Link
                  to={`/files/sets/${apiFileSet.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {t('VIEW_MORE')}
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FilesSetsPage;
