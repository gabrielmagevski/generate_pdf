/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {

    const formData = await req.formData();
    const file = formData.get("file") as File | null;


    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const uploaded = await put(`uploads/${file.name}`, buffer, {
      access: "public",
      contentType: file.type,
    });


    return NextResponse.json({ url: uploaded.url });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || "Erro no upload" }, { status: 500 });
  }
}
