export const optimizeCloudinaryUrl = (url) => {
    if (!url || typeof url !== 'string') return url;
    
    // Only process cloudinary URLs
    if (url.includes('res.cloudinary.com')) {
        // If it already has f_auto or q_auto transformations, return as is
        if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) {
            return url;
        }
        
        // Inject the transformation right after /upload/
        return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
    
    return url;
};
