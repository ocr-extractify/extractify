import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useMutation, useQuery } from '@tanstack/react-query';
import { httpClient } from '@/utils/axios';
import { FileText, Trash2, Search, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { mountBlobApiUri } from '@/utils/api/mount-blob-api-uri';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/states/EmptyState';
import { useToast } from '@/hooks/use-toast';

const CardsSkeleton = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl">{t('EXTRACTIONS')}</h1>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={t('SEARCH_FILES_SETS')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          disabled
        />
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="relative animate-pulse">
            <div className="absolute right-2 top-2 w-10 h-10 bg-gray-200 rounded-md dark:bg-gray-700"></div>
            
            <CardHeader>
              <div className="aspect-square w-full bg-gray-200 rounded-lg dark:bg-gray-700"></div>
            </CardHeader>

            <CardContent>
              <div className="h-6 bg-gray-200 rounded-md mb-2 dark:bg-gray-700"></div>
              <div className="h-4 bg-gray-200 rounded-md w-20 dark:bg-gray-700"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
const FilesSetsPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const filesSet = useQuery({
    queryKey: ['filesSets'],
    queryFn: () => httpClient.get('/files/sets/'),
  });
  const deleteMutation = useMutation({
    mutationKey: ['delete-fileset'],
    mutationFn: (id: string) => httpClient.delete(`/files/sets/${id}`),
    onMutate: () => {
      toast({
        title: t('DELETING_FILE_SET'),
        description: t('PLEASE_WAIT'),
      });
    },
    onSuccess: () => {
      filesSet.refetch();
      toast({
        title: t('FILE_SET_DELETED_SUCCESSFULLY'),
      });
    },
    onError: () => {
      toast({
        title: t('ERROR'),
        description: t('FAILED_TO_DELETE_FILE_SET'),
        variant: 'destructive',
      });
    },
  });
  const filteredFilesSets = filesSet?.data?.data?.filter((fileSet: any) =>
    fileSet.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (filesSet.isLoading) {
    return <CardsSkeleton />;
  }

  if (!filesSet.isLoading && filesSet.data?.data?.length === 0) {
    return (
      <EmptyState
        title={t('NO_FILES_SETS_FOUND')}
        description={t('NO_FILES_SET_IN_DATABASE')}
      >
        <Button variant="outline" asChild>
          <Link to="/files/upload">
            <Plus className="h-4 w-4" />
            {t('CREATE_FILE_SET')}
          </Link>
        </Button>
      </EmptyState>
    );
  } 

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <h1 className="text-2xl">{t('EXTRACTIONS')}</h1>
        </div>

        <Button variant="outline" asChild>
          <Link to="/files/upload">
            <Plus className="h-4 w-4" />
            {t('CREATE_FILE_SET')}
          </Link>
        </Button>
      </div>

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

      {filteredFilesSets?.length === 0 ? (
        <EmptyState
          title={t('NO_FILES_SETS_FOUND')}
          description={t('NO_FILES_SETS_FOUND_DESCRIPTION')}
        >
          <Button
            variant="outline"
            onClick={() => setSearchQuery('')}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            {t('CLEAR_FILTER')}
          </Button>
        </EmptyState>
      ) : (
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
      )}
    </div>
  );
};

export default FilesSetsPage;
