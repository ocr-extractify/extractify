import { API_URL } from '@/utils/constants';

export function mountBlobApiUri(url: string) {
  if (url.startsWith('http')) {
    return url;
  }

  return `${API_URL}/storage/?path=${url}`;
}
