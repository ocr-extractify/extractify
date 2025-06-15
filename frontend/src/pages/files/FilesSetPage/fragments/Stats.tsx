import { httpClient } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
const Stats = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const stats = useQuery({
    queryKey: ['stats', id],
    queryFn: () => httpClient.get(`/stats/files/sets/${id}`),
  });

  if (stats.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('TOTAL_FILES')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('TOTAL_CURRENCY_VALUE')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (stats.isError) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">{t('ERROR')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('FAILED_TO_LOAD_STATISTICS')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('TOTAL_FILES')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.data?.data.total_files}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('TOTAL_CURRENCY_VALUE')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {stats.data?.data.total_currency_value}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
