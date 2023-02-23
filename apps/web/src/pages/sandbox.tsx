import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";

export default function Sandbox() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(2);
  const pdfUrl =
    "https://cdn.access.ws/res/cl8kl9nyq0008sgrsozbsjyq0/3bjt6qGzmH5znvp50V_HG/SOLID_UncleBOB.pdf";
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  return (
    <div>
      <Document
        file={pdfUrl}
        onLoadSuccess={(doc) => setNumPages(doc.numPages)}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}
