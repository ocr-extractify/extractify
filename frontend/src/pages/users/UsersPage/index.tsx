import { useState } from 'react';
import {  useQuery } from '@tanstack/react-query';
import { httpClient } from '@/utils/axios';
import { User, Search, X, Mail, Calendar, UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/states/EmptyState';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const TableSkeleton = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl">{t('USERS')}</h1>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={t('SEARCH_USERS')}
          className="pl-10"
          disabled
        />
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>{t('EMAIL')}</TableHead>
              <TableHead>{t('CREATED_AT')}</TableHead>
              <TableHead>{t('FILES_QTY')}</TableHead>
              <TableHead>{t('FILES_SETS_QTY')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="animate-pulse">
                <TableCell>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded-md w-24 dark:bg-gray-700"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded-md w-24 dark:bg-gray-700"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded-md w-24 dark:bg-gray-700"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded-md w-24 dark:bg-gray-700"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const UsersPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  
  const users = useQuery({
    queryKey: ['users'],
    queryFn: () => httpClient.get('/users'),
  });

  // const deleteMutation = useMutation({
  //   mutationKey: ['delete-user'],
  //   mutationFn: (id: string) => httpClient.delete(`/users/${id}`),
  //   onMutate: () => {
  //     toast({
  //       title: t('DELETING_USER'),
  //       description: t('PLEASE_WAIT'),
  //     });
  //   },
  //   onSuccess: () => {
  //     users.refetch();
  //     toast({
  //       title: t('USER_DELETED_SUCCESSFULLY'),
  //     });
  //   },
  //   onError: () => {
  //     toast({
  //       title: t('ERROR'),
  //       description: t('FAILED_TO_DELETE_USER'),
  //       variant: 'destructive',
  //     });
  //   },
  // });

  const filteredUsers = users?.data?.data?.filter((user: any) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // const handleDeleteUser = (userId: string) => {
  //   deleteMutation.mutate(userId);
  // };

  if (users.isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <UsersIcon className="w-4 h-4" />
          <h1 className="text-2xl">{t('USERS')}</h1>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={t('SEARCH_USERS')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredUsers?.length === 0 ? (
        <EmptyState
          title={t('NO_USERS_FOUND')}
          description={t('NO_USERS_FOUND_DESCRIPTION')}
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
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>{t('EMAIL')}</TableHead>
                <TableHead>{t('CREATED_AT')}</TableHead>
                <TableHead>{t('FILES_QTY')}</TableHead>
                <TableHead>{t('FILES_SETS_QTY')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.created_at && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(user.created_at)}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span>{user.files_qty}</span>
                  </TableCell>
                  <TableCell>
                    <span>{user.files_sets_qty}</span>
                  </TableCell>
                  {/* <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deleteMutation.isPending}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
