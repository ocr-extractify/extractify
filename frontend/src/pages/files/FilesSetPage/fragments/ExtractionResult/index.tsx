import { httpClient } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import RawTextDialog from './fragments/RawTextDialog';
import FileDialog from './fragments/FileDialog';
import { mountBlobApiUri } from '@/utils/api/mount-blob-api-uri';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

// TODO: add types to filesSet
const ExtractionResult = () => {
  const { id } = useParams<{ id: string }>();

  const filesSet = useQuery({
    queryKey: ['filesSet', id],
    queryFn: () => httpClient.get(`/files/sets/${id}`),
  });

  return (
    <>
      {filesSet.data?.data?.files?.map((file: any) => (
        <div key={file.id} className="*:my-4">
          {file.file.ocr_extractions?.map((ocrExtraction: any) => (
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="truncate">{file.file.name}</CardTitle>
                <CardAction>
                  {/* Mobile Dropdown */}
                  <div className="md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="flex flex-col"
                      >
                        <DropdownMenuItem asChild>
                          <RawTextDialog
                            text={ocrExtraction.text}
                            triggerButtonVariant="none"
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <FileDialog
                            file_uri={mountBlobApiUri(file.file.uri)}
                            triggerButtonVariant="none"
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Desktop Buttons */}
                  <div className="hidden md:flex space-x-2">
                    <RawTextDialog text={ocrExtraction.text} />
                    <FileDialog file_uri={mountBlobApiUri(file.file.uri)} />
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent>
                <ul className="*:py-2 divide-y-2 divide-accent">
                  {ocrExtraction.regex_extractions?.map(
                    (regexExtraction: any) => (
                      <li
                        key={regexExtraction.field}
                        className="flex justify-between"
                      >
                        <span>{regexExtraction.name}</span>
                        <span>{regexExtraction.value}</span>
                      </li>
                    ),
                  )}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </>
  );
};

export default ExtractionResult;
