/**
 * Firebase Storage Service
 * Provides safe, client-side object and data URL handling without network retries on unprovisioned buckets.
 */

export interface StorageUploadProgressCallback {
  (progressPercent: number, snapshot?: any): void;
}

export const firebaseStorageService = {
  /**
   * Safe report document handler
   */
  async uploadMedicalReport(
    _userId: string,
    _reportId: string,
    file: File | Blob,
    _fileName: string,
    onProgress?: StorageUploadProgressCallback
  ): Promise<string> {
    if (onProgress) {
      onProgress(100);
    }
    try {
      return URL.createObjectURL(file);
    } catch {
      return '';
    }
  },

  /**
   * Safe equipment photo handler
   */
  async uploadEquipmentImage(
    _userId: string,
    _scanId: string,
    file: File | Blob,
    _fileName: string = 'equipment.jpg',
    onProgress?: StorageUploadProgressCallback
  ): Promise<string> {
    if (onProgress) {
      onProgress(100);
    }
    try {
      return URL.createObjectURL(file);
    } catch {
      return '';
    }
  },

  /**
   * Delete file notice
   */
  async deleteFile(_path: string): Promise<void> {
    // No-op for client-side object URLs
  }
};

