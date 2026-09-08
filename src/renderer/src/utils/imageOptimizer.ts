/**
 * Utility to compress and optimize uploaded images to high-quality WebP format.
 * Preserves high resolution (up to 2048px on the longest edge) while reducing
 * file size by 80-90% compared to raw uncompressed PNG/JPEG, keeping project files lightweight.
 */
export async function optimizeImage(
  fileOrBlob: File | Blob,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0.0 - 1.0, default 0.85
  }
): Promise<string> {
  const maxWidth = options?.maxWidth ?? 2048;
  const maxHeight = options?.maxHeight ?? 2048;
  const quality = options?.quality ?? 0.85;

  // If it's an SVG, read directly as data URL without rasterizing to preserve vectors
  if (fileOrBlob.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBlob);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        // Fallback to original data URL if decoding fails
        resolve(e.target?.result as string);
      };
      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale down if larger than max allowed dimension while preserving aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.max(1, Math.round(width * ratio));
            height = Math.max(1, Math.round(height * ratio));
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          // Use high-quality bicubic smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP format (natively supported by Chromium/Electron)
          // WebP maintains alpha channel / transparency and provides superior compression
          const webpDataUrl = canvas.toDataURL('image/webp', quality);

          // If the browser supported and produced image/webp, return it
          if (webpDataUrl.startsWith('data:image/webp')) {
            resolve(webpDataUrl);
          } else {
            // Fallback to JPEG if WebP encoding is not available
            resolve(canvas.toDataURL('image/jpeg', quality));
          }
        } catch (err) {
          console.error('Image optimization failed, falling back to original:', err);
          resolve(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(fileOrBlob);
  });
}
