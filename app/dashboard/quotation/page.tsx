"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileVolume, PlusIcon, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import Editor from "@/components/TemplateEditor"; // TipTap editor component we'll create
import mammoth from "mammoth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Quotationpage = () => {
  const [htmlContent, setHtmlContent] = useState("<p>Start your quotation here...</p>");
  const [open, setOpen] = useState(false);
  const editorRef = useRef(null);

  // Handle file input and convert docx to HTML
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".docx")) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const { value } = await mammoth.convertToHtml({ arrayBuffer });
        setHtmlContent(value);
        setOpen(false); // close modal after loading
      } catch (err) {
        alert("Error processing file");
        console.error(err);
      }
    } else {
      alert("Please upload a valid .docx file");
    }
  };

  // Export editor content as PDF
  const exportPDF = async () => {
    if (!editorRef.current) return;

    const element = editorRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("quotation.pdf");
  };

  return (
    <div className="container mx-auto py-5">
      <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Quotation</h2>
        </div>

        <div className="flex flex-row xs:flex-row gap-2">
          <Button
            className="border bg-transparent hover:bg-[#f7f7f7] text-black cursor-pointer"
            onClick={exportPDF}
          >
            <FileVolume className="mr-2" />
            Export
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer flex items-center gap-2">
                <PlusIcon />
                Create Quote
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload Quotation Template (.docx)</DialogTitle>
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <X className="h-4 w-4" />
                </DialogClose>
              </DialogHeader>
              <input
                type="file"
                accept=".docx"
                onChange={handleFileChange}
                className="mt-4"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator className="mt-4" />

      <div ref={editorRef} className="mt-6 border rounded-md p-4 min-h-[400px]">
        <Editor content={htmlContent} onUpdate={setHtmlContent} />
      </div>
    </div>
  );
};

export default Quotationpage;
