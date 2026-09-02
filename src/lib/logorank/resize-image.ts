import { LOGO_DATA_MAX } from "@/lib/logorank/core";

const MAX_EDGE = 512;

export async function resizeLogoFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo tiene que ser una imagen");
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo leer el logo");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.9;
  let data = canvas.toDataURL("image/jpeg", quality);
  while (data.length > LOGO_DATA_MAX && quality > 0.45) {
    quality -= 0.1;
    data = canvas.toDataURL("image/jpeg", quality);
  }
  if (data.length > LOGO_DATA_MAX) {
    throw new Error("El logo sigue siendo demasiado pesado. Prueba una imagen más simple.");
  }
  return data;
}
