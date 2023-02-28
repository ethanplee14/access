import { useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs, TextLayerItemInternal } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import PdfViewer from "../components/vault/pdf-viewer";

export default function Sandbox() {
  const pdfUrl =
    "https://cdn.access.ws/res/cl8kl9nyq0008sgrsozbsjyq0/QXl8DbXGoLxndzH6RBh2w/designing-data-intensive-applications.pdf";

  return (
    <div>
      <PdfViewer file={pdfUrl} />
    </div>
  );
}
