// services/imageOptimizer.ts

/**
 * Optimizes an image URL using the images.weserv.nl service.
 * @param url The original image URL.
 * @param width The desired width of the image.
 * @param height The desired height of the image.
 * @param quality The desired quality of the image (1-100).
 * @returns The optimized image URL.
 */
export const optimizeImage = (
  url: string,
  width: number = 400,
  height: number = 300,
  quality: number = 80
): string => {
  if (!url) {
    return '';
  }

  // Use the images.weserv.nl service for optimization
  const serviceUrl = 'https://images.weserv.nl/';
  const params = new URLSearchParams({
    url: url,
    w: width.toString(),
    h: height.toString(),
    q: quality.toString(),
    fit: 'cover',
    we: '', // Enable WebP
  });

  return `${serviceUrl}?${params.toString()}`;
};
