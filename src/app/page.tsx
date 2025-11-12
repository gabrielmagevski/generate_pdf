"use client";

import { useRef } from "react";

export default function Home() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const savePdf = async () => {
    const html = inputRef.current?.value.trim();
    if (!html) {
      alert("Cole o HTML primeiro!");
      return;
    }

    if (!previewRef.current) return;

    previewRef.current.innerHTML = html;

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 10,
      filename: "material-ingles.pdf",
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(previewRef.current).save();
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

      <button
        onClick={savePdf}
        style={{
          display: "block",
          width: "100%",
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
