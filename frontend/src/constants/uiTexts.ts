import { MAX_FILE_SIZE, VALID_MIMETYPES } from './constraints';

export const TITLE: string = 'File to text';
export const DESCRIPTION: string =
  'Simple app to convert all your files to text.';
export const FILES_INPUT_LABEL: string = 'Files';
export const UPLOAD_FILE: string = 'Upload a file';
export const OR_DRAG_AND_DROP: string = 'or drag and drop';
export const FILE_INPUT_MIMETYPES: string = `${VALID_MIMETYPES.join(', ')
  .replaceAll('image/', '')
  .replaceAll('application/', '')} up to ${(
  MAX_FILE_SIZE /
  1024 /
  1024
).toString()}MB`;
export const UPLOAD: string = 'Upload';
export const FILENAME: string = 'Filename';
export const FILESIZE: string = 'Filesize';
export const RESULT: string = 'Result';
export const CREATING_ID: string = 'Creating id...';
export const CREATING_RESULT: string = 'Creating result...';
export const ANALYZED_FILE_CONFIDENCE: string = 'Confidence';
export const ANALYZED_FILE_DETECTED_LANGUAGES: string = 'Detected languages';
export const ANALYZED_FILE_LEARN_MORE: string =
  'Learn more about extract text of language.';
export const ANALYZED_FILE_LANGUAGE_CODE: string = 'Language code';
export const UPLOAD_FILES_TAB: string = 'Upload files';
export const FILES_TAB: string = 'Files';
export const DROP_FILES: string = 'Drop files here';
export const NO_FILES: string = 'No files';
export const GET_STARTED: string = 'Get started by uploading a file';
export const SEARCH_INPUT_DEFAULT_PLACEHOLDER: string = 'Search...';
export const STATS: string = 'Uploaded files - Stats';
export const STATS_DESCRIPTION: string =
  'Here you are seeing the overall stats of uploaded files of this app.';
export const TOTAL: string = 'Total';
export const TODAY: string = 'Today';
export const THIS_WEEK: string = 'This week';
export const THIS_MONTH: string = 'This month';
export const QUOTA_LIMIT_DESCRIPTION: string =
  'If the quota limit is reached, you will not be able to upload more files.';
export const UPLOADS_DAILY_CHART: string = 'Daily uploads';
