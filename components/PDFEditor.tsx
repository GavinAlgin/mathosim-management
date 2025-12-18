'use client';

import { useEffect, useRef, useState } from 'react';
import type * as PdfJs from 'pdfjs-dist';

interface PDFViewerProps {
  pdfUrl: string;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfjsLib, setPdfjsLib] = useState<typeof PdfJs | null>(null);

  /** Load PDF.js dynamically (client-only) */
  useEffect(() => {
    const loadPdfJs = async () => {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf');

      pdfjs.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

      setPdfjsLib(pdfjs);
    };

    loadPdfJs();
  }, []);

  /** Render first page */
  useEffect(() => {
    if (!pdfjsLib || !pdfUrl) return;

    const renderPDF = async () => {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;
    };

    renderPDF();
  }, [pdfUrl, pdfjsLib]);

  return <canvas ref={canvasRef} />;
}
