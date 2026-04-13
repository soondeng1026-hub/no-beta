/**
 * 上传后用 Canvas 缩小宽度并导出 JPEG，减轻上传体积与 Ark 推理耗时。
 */
const MAX_WIDTH = 800;
const JPEG_QUALITY = 0.7;

export async function compressWallImageToJpegBlob(file: File): Promise<Blob> {
  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Could not decode image for compression");
  }

  try {
    let w = bitmap.width;
    let h = bitmap.height;
    if (w > MAX_WIDTH) {
      h = Math.round((h * MAX_WIDTH) / w);
      w = MAX_WIDTH;
    }

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2D not available");
    }
    ctx.drawImage(bitmap, 0, 0, w, h);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
    });
    if (!blob) {
      throw new Error("JPEG compression failed");
    }
    return blob;
  } finally {
    bitmap.close();
  }
}
