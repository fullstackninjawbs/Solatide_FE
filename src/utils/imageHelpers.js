/**
 * Helper to determine the alt text for a product image.
 * Uses the saved altText from the image metadata if available,
 * otherwise generates a fallback based on the product name.
 * 
 * @param {Object} image - The product image object (from product.images)
 * @param {string} productName - The name of the product
 * @param {number} index - The index of the image in the gallery (optional)
 * @returns {string} The resolved alt text
 */
export const getProductImageAltText = (image, productName, index = 0) => {
  // If the image object has a specific altText, use it
  if (image && image.altText && image.altText.trim() !== '') {
    return image.altText.trim();
  }
  
  // Fallback to legacy alt field if it was populated
  if (image && image.alt && image.alt.trim() !== '') {
    return image.alt.trim();
  }
  
  // Fallback generation based on product name
  const baseName = productName || 'Product';
  
  // If it's explicitly marked as primary, or it's the first image
  if ((image && image.isPrimary) || index === 0) {
    return `${baseName} product image`;
  }
  
  return `${baseName} product image - view ${index + 1}`;
};
