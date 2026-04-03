import { Worker, Viewer } from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PDFViewer = ({ base64Pdf }: { base64Pdf: string }) => {
  return (
    <div
      style={{
        width: "100%", // Set the width to fill the entire screen
        maxWidth: "100%", // Set the maximum width to prevent exceeding the screen size
        height: "90%", // Set the height to 90% of the viewport height
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={base64Pdf} />
      </Worker>
    </div>
  );
};

export default PDFViewer;
