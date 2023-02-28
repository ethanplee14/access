import { useEffect, useState } from "react";
import { Document, Page, pdfjs, TextLayerItemInternal } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

export interface PdfViewerProps {
  file: string;
}

export default function PdfViewer(props: PdfViewerProps) {
  const [totalPages, setTotalPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  }, []);

  return (
    <Document
      file={props.file}
      className="border border-gray-300 rounded-lg shadow-lg"
      onLoadSuccess={(doc) => setTotalPages(doc.numPages)}
    >
      <Page className="w-min mx-auto" pageNumber={pageNumber} />
    </Document>
  );
}
