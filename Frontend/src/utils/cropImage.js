/**
 * cropImage.js
 *
 * Canvas-based image cropping utility for react-easy-crop.
 * Accepts a source image URL and a pixel-area crop rectangle,
 * draws the cropped region onto an off-screen canvas, and
 * returns a File object suitable for FormData upload.
 */

/**
 * Creates a new HTMLImageElement from a given URL.
 * @param {string} url — Object URL or data URL of the source image.
 * @returns {Promise<HTMLImageElement>}
 */
function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    // Required for cross-origin images (Supabase storage URLs etc.)
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

/**
 * Extracts the cropped area from the source image and returns it as a File.
 *
 * @param {string} imageSrc       — Object URL of the original image.
 * @param {Object} pixelCrop      — { x, y, width, height } from react-easy-crop's onCropComplete.
 * @param {string} [fileName]     — Output file name (defaults to 'cropped-skin-image.jpg').
 * @returns {Promise<File>}       — A JPEG File object of the cropped region.
 */
export default async function getCroppedImage(imageSrc, pixelCrop, fileName = 'cropped-skin-image.jpg') {
  const image = await createImage(imageSrc);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas 2D context');
  }

  // Set canvas dimensions to the cropped area size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw only the cropped rectangle from the source image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert canvas to a Blob, then wrap it in a File
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob failed — could not generate cropped image.'));
          return;
        }
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        resolve(file);
      },
      'image/jpeg',
      0.95 // High quality JPEG
    );
  });
}
