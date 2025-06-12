async function download(data: string | Blob, filename?: string) {
  let blob: Blob;
  let url: string;

  if (typeof data === 'string') {
    // If it's a URL string
    const response = await fetch(data);
    blob = await response.blob();
    url = URL.createObjectURL(blob);
  } else {
    // If it's already a Blob/File
    blob = data;
    url = URL.createObjectURL(blob);
  }

  const a = document.createElement('a');
  a.href = url;
  a.download =
    filename ||
    (typeof data === 'string'
      ? data.split('/').pop() || 'download'
      : 'download');
  a.click();
  URL.revokeObjectURL(url);
}

export default download;
