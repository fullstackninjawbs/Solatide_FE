/**
 * Normalizes an API error or JS error into a safe, user-friendly string.
 * It prevents technical stack traces or database errors from leaking to the UI.
 * 
 * @param {Error|any} error - The error object caught in a try/catch or fetch rejection.
 * @param {string} context - The action being performed (e.g., 'productDelete', 'couponImport').
 * @returns {string} A safe, readable error message.
 */
export function getUserFriendlyErrorMessage(error, context = 'default') {
  // 1. If it's a string already, check if it's safe (doesn't look like a stack trace or DB error)
  if (typeof error === 'string') {
    if (error.includes('E11000') || error.includes('MongoError') || error.includes('Cast to ObjectId failed')) {
      return getFallbackMessage(context);
    }
    // Assume string errors from our API are safe if they don't contain DB leakage
    return error;
  }

  // 2. If it's a standard JS error object with a message
  if (error?.message) {
    // Filter out common unsafe messages
    const msg = error.message;
    if (
      msg.includes('E11000') || 
      msg.includes('Mongo') || 
      msg.includes('Cast to') ||
      msg.includes('validation failed') ||
      msg.includes('SQL') ||
      msg.includes('ECONNREFUSED')
    ) {
      return getFallbackMessage(context);
    }
    
    // Some messages are just "Failed to fetch" (Network Error)
    if (msg === 'Failed to fetch' || msg === 'Network Error') {
      return 'Network error: Unable to connect to the server. Please check your connection and try again.';
    }

    return msg;
  }

  // 3. Fallback
  return getFallbackMessage(context);
}

function getFallbackMessage(context) {
  switch (context) {
    case 'productDelete':
      return 'Unable to delete this product. Please try again later.';
    case 'productCreate':
    case 'productUpdate':
      return 'Unable to save product details. Please check your inputs and try again.';
    case 'couponImport':
      return 'Unable to import coupons from Tagada. Please try again.';
    case 'collectionDelete':
      return 'Unable to delete this collection. Please try again.';
    case 'batchDelete':
      return 'Unable to delete this batch. Please try again.';
    case 'coaDelete':
      return 'Unable to remove the COA document. Please try again.';
    case 'inventoryUpdate':
      return 'Unable to update inventory levels. Please try again.';
    case 'tagadaSync':
      return 'Unable to sync products from Tagada. Please try again.';
    case 'discountDelete':
      return 'Unable to delete this discount. Please try again.';
    case 'reviewUpdate':
      return 'Unable to update review. Please try again.';
    case 'reviewDelete':
      return 'Unable to delete review. Please try again.';
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
}
