import {
  defaultRegexFields,
  type DataExtractionRegexField,
} from '@/constants/dataExtractionRegexFields';
import { httpClient } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import RegexForm from '../../UploadFilesPage/fragments/RegexForm';
import { useTranslation } from 'react-i18next';

// TODO: add types to filesSet
const ExtractionConfig = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const filesSet = useQuery({
    queryKey: ['filesSet', id],
    queryFn: () => httpClient.get(`/files/sets/${id}`),
  });
  const [regexFields, setRegexFields] =
    useState<DataExtractionRegexField[]>(defaultRegexFields);

  return (
    <div>
      <p className="font-medium">{t('EXTRACTION_CONFIG_TAB_DESCRIPTION')}</p>
      <RegexForm regexFields={regexFields} setRegexFields={setRegexFields} />
    </div>
  );
};

export default ExtractionConfig;
