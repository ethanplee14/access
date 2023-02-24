import { useCallback, useState } from "react";
import { Document, Page, pdfjs, TextLayerItemInternal } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
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
        <Page className="mx-auto" scale={0.75} pageNumber={pageNumber} />
      </Document>
      <p>
        <button onClick={() => setPageNumber(Math.max(pageNumber - 1, 0))}>
          {"<"}
        </button>
        Page {pageNumber} of {numPages}
        <button
          onClick={() => setPageNumber(Math.min(pageNumber + 1, numPages ?? 1))}
        >
          {">"}
        </button>
      </p>
    </div>
  );
}
