'use client';

import { useEffect, useRef, useState } from 'react';

export default function PDFViewer({ pdfUrl }: { pdfUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);

  useEffect(() => {
    const loadPdfJs = async () => {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      setPdfjsLib(pdfjs);
    };
    loadPdfJs();
  }, []);

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

      await page.render({ canvasContext: context, viewport }).promise;
    };

    renderPDF();
  }, [pdfUrl, pdfjsLib]);

  return <canvas ref={canvasRef} />;
}
