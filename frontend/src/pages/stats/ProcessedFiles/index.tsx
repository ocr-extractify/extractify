import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { ptBR, enUS } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, CartesianGrid, XAxis, Bar } from 'recharts';
import { httpClient } from '@/utils/axios';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
  ChartTooltip,
} from '@/components/ui/chart';
import { useTranslation } from 'react-i18next';
import { ChartAreaIcon } from 'lucide-react';
type RangeType = 'daily' | 'weekly' | 'monthly';

const ProcessedFilesPage = () => {
  const { t, i18n } = useTranslation();
  const chartConfig = {
    value: {
      label: t('QTY'),
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;
  const [dateRange, _] = useState({
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date()),
  });
  const [rangeType, setRangeType] = useState<RangeType>('daily');
  
  const dateLocale = i18n.language === 'pt' ? ptBR : enUS;
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatDateForAPI = (date: Date) => {
    return formatInTimeZone(date, userTimezone, 'yyyy-MM-dd');
  };
  
  const createTimezoneAwareDate = (date: Date, timeOfDay: 'start' | 'end') => {
    const zonedDate = toZonedTime(date, userTimezone);
    if (timeOfDay === 'start') {
      return startOfDay(zonedDate);
    } else {
      return endOfDay(zonedDate);
    }
  };
  
  const getDateRanges = () => {
    switch (rangeType) {
      case 'daily':
        return eachDayOfInterval({
          start: dateRange.from,
          end: dateRange.to,
        }).map((date) => ({
          start: createTimezoneAwareDate(date, 'start'),
          end: createTimezoneAwareDate(date, 'end'),
          label: format(date, 'MMM dd', { locale: dateLocale }),
        }));
      case 'weekly':
        return eachWeekOfInterval({
          start: dateRange.from,
          end: dateRange.to,
        }).map((date) => {
          const weekStart = startOfWeek(date);
          const weekEnd = endOfWeek(date);
          return {
            start: createTimezoneAwareDate(weekStart, 'start'),
            end: createTimezoneAwareDate(weekEnd, 'end'),
            label: i18n.language === 'pt' 
              ? `Semana ${format(date, 'w', { locale: dateLocale })}` 
              : `Week ${format(date, 'w', { locale: dateLocale })}`,
          };
        });
      case 'monthly':
        return eachMonthOfInterval({
          start: dateRange.from,
          end: dateRange.to,
        }).map((date) => {
          const monthStart = startOfMonth(date);
          const monthEnd = endOfMonth(date);
          return {
            start: createTimezoneAwareDate(monthStart, 'start'),
            end: createTimezoneAwareDate(monthEnd, 'end'),
            label: format(date, 'MMM yyyy', { locale: dateLocale }),
          };
        });
    }
  };

  const queries = useQueries({
    queries: getDateRanges().map((range) => ({
      queryKey: ['processed-files', range.start, range.end, rangeType],
      queryFn: async () => {
        const response = await httpClient.get(
          `/stats/processed-files-qty?start_date=${formatDateForAPI(
            range.start,
          )}&end_date=${formatDateForAPI(range.end)}&tz=${userTimezone}`,
        );
        return {
          date: range.label,
          value: response.data,
        };
      },
    })),
  });

  const isLoading = queries.some((query) => query.isLoading);
  const error = queries.find((query) => query.error)?.error;
  const chartData = queries
    .filter((query) => query.data)
    .map((query) => query.data);

  const total = chartData.reduce((acc, curr) => acc + (curr?.value ?? 0), 0);

  // Get user's timezone for display
  const timezoneAbbr = formatInTimeZone(new Date(), userTimezone, 'zzz');

  return (
    <div className="container mx-auto">
      <div className="flex items-center gap-2 mb-2"> 
        <ChartAreaIcon className="w-4 h-4" />
        <h1 className="text-2xl">{t('STATS')}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle>{t('PROCESSED_FILES_TITLE')}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {t('TIMEZONE_DISPLAY', { 
                  timezone: userTimezone, 
                  abbreviation: timezoneAbbr 
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={rangeType}
                onValueChange={(value: RangeType) => setRangeType(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('SELECT_RANGE_TYPE')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t('DAILY')}</SelectItem>
                  <SelectItem value="weekly">{t('WEEKLY')}</SelectItem>
                  <SelectItem value="monthly">{t('MONTHLY')}</SelectItem>
                </SelectContent>
              </Select>
              {/* <DateRangePicker value={dateRange} onChange={setDateRange} /> */}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">
                  {t('TOTAL_PROCESSED_FILES')}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total.toLocaleString()}
                </span>
              </div>
            </div>
            <div>
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : error ? (
                <div className="flex h-full items-center justify-center text-destructive">
                  {t('ERROR_LOADING_DATA')}
                </div>
              ) : (
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-[250px] w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          className="w-[150px]"
                          nameKey="value"
                          labelFormatter={(value) => value}
                        />
                      }
                    />
                    <Bar dataKey="value" fill="var(--chart-1)" />
                  </BarChart>
                </ChartContainer>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessedFilesPage;
