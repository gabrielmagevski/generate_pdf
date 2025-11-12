/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";

export default function Home() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const extractTextFromImages = async (container: HTMLElement) => {
    const Tesseract = (await import("tesseract.js")).default;
    const images = container.querySelectorAll("img");

    for (const img of images) {
      try {
        const result = await Tesseract.recognize(img.src, "por+eng", {
          logger: (m) => console.log(`[OCR] ${m.status}`),
        });

        const text = result.data.text.trim();
        if (text) {
          const textElement = document.createElement("pre");
          textElement.textContent = text;
          textElement.style.whiteSpace = "pre-wrap";
          textElement.style.fontFamily = "monospace";
          textElement.style.background = "#f8f8f8";
          textElement.style.padding = "10px";
          textElement.style.border = "1px solid #ddd";
          textElement.style.borderRadius = "4px";
          textElement.style.margin = "10px 0";
          img.replaceWith(textElement);
        }
      } catch (error) {
        console.error("Erro ao processar OCR da imagem:", error);
      }
    }
  };

  const savePdf = async () => {
    const html = inputRef.current?.value.trim();
    if (!html) {
      alert("Cole o HTML primeiro!");
      return;
    }

    if (!previewRef.current) return;

    previewRef.current.innerHTML = html;
    await extractTextFromImages(previewRef.current);

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 10,
      filename: "material-ingles.pdf",
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(previewRef.current).save();
  };

  const saveWord = async () => {
    const html = inputRef.current?.value.trim();
    if (!html) {
      alert("Cole o HTML primeiro!");
      return;
    }

    if (!previewRef.current) return;

    previewRef.current.innerHTML = html;
    await extractTextFromImages(previewRef.current);

    const htmlDocx = (await import("html-docx-js-typescript")).default;

    const pageHTML = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body>${previewRef.current.innerHTML}</body>
      </html>
    `;

    const blob = await htmlDocx.asBlob(pageHTML);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob as any);
    link.download = "material-ingles.docx";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Gerador de PDF — Material de Inglês</h1>

      <textarea
        ref={inputRef}
        id="htmlInput"
        placeholder="Cole aqui o HTML do material..."
        style={{
          width: "100%",
          height: "300px",
          padding: "10px",
          fontFamily: "monospace",
          borderRadius: "8px",
          border: "1px solid #ccc",
          resize: "vertical",
          marginBottom: "20px",
        }}
      ></textarea>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={savePdf}
          style={{
            flex: 1,
            padding: "15px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Gerar PDF
        </button>

        <button
          onClick={saveWord}
          style={{
            flex: 1,
            padding: "15px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Baixar Word
        </button>
      </div>

      <div
        ref={previewRef}
        id="preview"
        style={{
          background: "white",
          padding: "20px",
          marginTop: "30px",
          borderRadius: "8px",
          boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        }}
      ></div>
    </div>
  );
}
