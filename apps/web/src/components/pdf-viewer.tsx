import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import "react-pdf/dist/esm/Page/TextLayer.css";

export interface PdfViewerProps {
  url: string;
  width?: number;
  pageNumber?: number;
}

export default function PdfViewer({ url, width, pageNumber }: PdfViewerProps) {
  return (
    <Document file={url}>
      <Page pageNumber={pageNumber} width={width} />
    </Document>
  );
}
