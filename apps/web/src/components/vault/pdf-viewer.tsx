import { useState } from "react";
import { Document, Page, pdfjs, TextLayerItemInternal } from "react-pdf";

export interface PdfViewerProps {
  file: string;
}

export default function PdfViewer(props: PdfViewerProps) {
  const [pageNumber, setPageNumber] = useState(1);

  const pdfUrl =
    "https://cdn.access.ws/res/cl8kl9nyq0008sgrsozbsjyq0/3bjt6qGzmH5znvp50V_HG/SOLID_UncleBOB.pdf";
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

  return (
    <Document file={props.file}>
      <Page pageNumber={pageNumber} />
    </Document>
  );
}
