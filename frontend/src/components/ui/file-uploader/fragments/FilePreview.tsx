import { FileText } from "lucide-react"
import { Image } from "@/components/ui/image"


interface FilePreviewProps {
  file: File & { preview: string }
}

export default function FilePreview({ file }: FilePreviewProps) {
  if (file.type.startsWith("image/")) {
    return (
      <Image
        src={file.preview}
        alt={file.name}
        width={48}
        height={48}
        loading="lazy"
        className="aspect-square shrink-0 rounded-md object-cover"
      />
    )
  }

  return (
    <FileText className="size-10 text-muted-foreground" aria-hidden="true" />
  )
}