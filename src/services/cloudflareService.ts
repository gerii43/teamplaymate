interface CloudflareConfig {
  accountId: string;
  accountId: string;
  apiToken: string;
  r2BucketName: string;
  streamAccountId: string;
}

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileId?: string;
}

interface VideoUploadResult extends UploadResult {
  streamId?: string;
  thumbnailUrl?: string;
  playbackUrl?: string;
}

class CloudflareService {
  private config: CloudflareConfig;

  constructor() {
    this.config = {
      accountId: import.meta.env?.VITE_CLOUDFLARE_ACCOUNT_ID || 'demo-account',
      apiToken: import.meta.env?.VITE_CLOUDFLARE_API_TOKEN || 'demo-token',
      r2BucketName: import.meta.env?.VITE_CLOUDFLARE_R2_BUCKET || 'statsor-uploads',
      streamAccountId: import.meta.env?.VITE_CLOUDFLARE_STREAM_ACCOUNT_ID || 'demo-stream-account'
    };
  }

  async uploadToR2(file: File, folder: string = 'general'): Promise<UploadResult> {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop();
      const filename = `${folder}/${timestamp}-${randomString}.${extension}`;

      // In production, implement actual Cloudflare R2 upload
      const formData = new FormData();
      formData.append('file', file);

      // Mock upload for demo - replace with actual Cloudflare R2 API call
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Simulate occasional failures for realistic testing
      if (Math.random() < 0.05) {
        throw new Error('Upload failed - network error');
      }

      const mockUrl = `https://pub-${this.config.accountId}.r2.dev/${this.config.r2BucketName}/${filename}`;

      return {
        success: true,
        url: mockUrl,
        fileId: `${timestamp}-${randomString}`
      };

    } catch (error) {
      console.error('R2 upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  async uploadVideoToStream(file: File): Promise<VideoUploadResult> {
    try {
      // Validate video file
      if (!file.type.startsWith('video/')) {
        throw new Error('File must be a video');
      }

      // Check file size (max 100MB for free tier)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        throw new Error('Video file too large. Maximum size is 100MB.');
      }

      // In production, implement actual Cloudflare Stream upload
      const formData = new FormData();
      formData.append('file', file);

      // Mock upload for demo
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

      // Simulate processing time
      const streamId = `stream_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const mockPlaybackUrl = `https://customer-${this.config.streamAccountId}.cloudflarestream.com/${streamId}/manifest/video.m3u8`;
      const mockThumbnailUrl = `https://customer-${this.config.streamAccountId}.cloudflarestream.com/${streamId}/thumbnails/thumbnail.jpg`;

      return {
        success: true,
        streamId,
        playbackUrl: mockPlaybackUrl,
        thumbnailUrl: mockThumbnailUrl,
        url: mockPlaybackUrl
      };

    } catch (error) {
      console.error('Stream upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Video upload failed'
      };
    }
  }

  async uploadPlayerPhoto(file: File, playerId: string): Promise<UploadResult> {
    // Validate image file
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image'
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'Image file too large. Maximum size is 5MB.'
      };
    }

    return this.uploadToR2(file, `players/${playerId}`);
  }

  async uploadVerificationMedia(file: File, userId: string): Promise<UploadResult> {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      return {
        success: false,
        error: 'File must be an image or video'
      };
    }

    if (isVideo) {
      return this.uploadVideoToStream(file);
    } else {
      return this.uploadToR2(file, `verification/${userId}`);
    }
  }

  async uploadSkillSwapMedia(files: File[], userId: string): Promise<UploadResult[]> {
    const uploadPromises = files.map(async (file, index) => {
      const isVideo = file.type.startsWith('video/');
      
      if (isVideo) {
        return this.uploadVideoToStream(file);
      } else {
        return this.uploadToR2(file, `skill-swaps/${userId}`);
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Batch upload error:', error);
      return files.map(() => ({
        success: false,
        error: 'Batch upload failed'
      }));
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // Extract filename from URL
      const urlParts = fileUrl.split('/');
      const filename = urlParts[urlParts.length - 1];

      // In production, implement actual Cloudflare R2 delete
      console.log(`Deleting file: ${filename}`);
      
      // Mock delete operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Delete file error:', error);
      return false;
    }
  }

  async getFileInfo(fileUrl: string): Promise<{
    size?: number;
    lastModified?: Date;
    contentType?: string;
  }> {
    try {
      // In production, implement actual file info retrieval
      return {
        size: Math.floor(Math.random() * 1000000) + 100000, // Mock size
        lastModified: new Date(),
        contentType: 'application/octet-stream'
      };
    } catch (error) {
      console.error('Get file info error:', error);
      return {};
    }
  }

  // Utility methods
  generateSignedUrl(filename: string, expiresIn: number = 3600): string {
    // In production, generate actual signed URL
    const timestamp = Date.now() + (expiresIn * 1000);
    return `https://pub-${this.config.accountId}.r2.dev/${this.config.r2BucketName}/${filename}?expires=${timestamp}`;
  }

  isValidImageType(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    return validTypes.includes(file.type);
  }

  isValidVideoType(file: File): boolean {
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi'];
    return validTypes.includes(file.type);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Batch operations
  async uploadMultipleFiles(files: File[], folder: string = 'batch'): Promise<UploadResult[]> {
    const uploadPromises = files.map((file, index) => 
      this.uploadToR2(file, `${folder}/${index}`)
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple file upload error:', error);
      return files.map(() => ({
        success: false,
        error: 'Batch upload failed'
      }));
    }
  }

  // Configuration methods
  updateConfig(newConfig: Partial<CloudflareConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): CloudflareConfig {
    return { ...this.config };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      // In production, ping Cloudflare API to check connectivity
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    } catch (error) {
      console.error('Cloudflare health check failed:', error);
      return false;
    }
  }
}

export const cloudflareService = new CloudflareService();
export type { UploadResult, VideoUploadResult, CloudflareConfig };