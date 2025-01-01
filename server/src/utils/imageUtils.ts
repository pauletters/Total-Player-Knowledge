export const compressImage = async (base64String: string, maxWidth = 500): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Create an image element
      const img = new Image();
      
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions maintaining aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to compressed base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedBase64);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
      
      img.src = base64String;
    });
  };
  
  export const validateImage = (base64String: string): {
    isValid: boolean;
    error?: string;
    mimeType?: string;
  } => {
    try {
      // Check if it's a valid base64 string
      if (!base64String.includes('base64,')) {
        return { isValid: false, error: 'Invalid image format' };
      }
  
      // Get the MIME type
      const mimeType = base64String.split(';')[0].split(':')[1];
      
      // Validate MIME type
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(mimeType)) {
        return { isValid: false, error: 'Unsupported image format' };
      }
  
      // Check file size (assuming base64 string length is roughly 4/3 of binary size)
      const base64WithoutHeader = base64String.split(',')[1];
      const fileSizeInBytes = (base64WithoutHeader.length * 3) / 4;
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
      
      if (fileSizeInMB > 5) {
        return { isValid: false, error: 'Image size must be less than 5MB' };
      }
  
      return { isValid: true, mimeType };
    } catch (error) {
      return { isValid: false, error: 'Invalid image data' };
    }
  };