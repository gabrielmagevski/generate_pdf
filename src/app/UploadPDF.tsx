import { useState } from "react";

export default function UploadPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`✅ Arquivo enviado com sucesso! ${JSON.stringify(data.url)}`);
    } else {
      setMessage(`${data.error}`);
    }
  };

  return (
    <div
      style={{
        marginTop: "40px",
        display: "flex",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "30px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 28px rgba(0,0,0,0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontWeight: 600, fontSize: "1.4rem" }}>
          Enviar Arquivo
        </h2>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              width: "100%",
              padding: "18px",
              border: "2px dashed #6c6cff",
              borderRadius: "12px",
              cursor: "pointer",
              color: "#000",
              fontWeight: 500,
              marginBottom: "20px",
              transition: "0.3s",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLLabelElement).style.borderColor = "#9b9bff")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLLabelElement).style.borderColor = "#6c6cff")
            }
          >
            {file ? `📄 ${file.name}` : "Clique para selecionar PDF ou DOCX"}

            <input
              type="file"
              accept=".pdf,.docx"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: file ? "#6c63ff" : "#666",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: file ? "pointer" : "not-allowed",
              transition: "0.3s",
              letterSpacing: "0.4px",
            }}
          >
            Enviar Arquivo
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "20px", fontWeight: 500, color: "#000" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
