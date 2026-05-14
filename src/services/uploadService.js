// Since your backend handles file upload in controller endpoints,
// we don't need a separate upload service.
// Images are uploaded directly with complaint/resolution data.

export const uploadService = {
  // This is now handled directly in complaintService
  validateImage: (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPG, PNG, and GIF files are allowed');
    }

    return true;
  }
};