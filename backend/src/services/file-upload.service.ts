/**
 * File Upload Service
 * Handles file uploads, image processing, and storage management
 */

import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';
import { getEnv, getEnvNumber } from '../../../src/utils/envValidation.js';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

interface UploadedFile {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  thumbnailUrl?: string;
  metadata: {
    width?: number;
    height?: number;
    duration?: number;
    format?: string;
  };
  uploadedBy: string;
  uploadedAt: Date;
  isPublic: boolean;
  tags?: string[];
}

interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface FileProcessingOptions {
  resize?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  };
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'gif';
  generateThumbnail?: boolean;
  thumbnailSize?: number;
  watermark?: {
    text?: string;
    image?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  };
}

class FileUploadService {
  private static instance: FileUploadService;
  private uploadPath: string;
  private maxFileSize: number;
  private allowedTypes: string[];
  private storage: multer.StorageEngine;

  private constructor() {
    this.uploadPath = getEnv('UPLOAD_PATH', './uploads');
    this.maxFileSize = getEnvNumber('UPLOAD_MAX_SIZE', 10485760); // 10MB
    this.allowedTypes = getEnv('UPLOAD_ALLOWED_TYPES', 'image/jpeg,image/png,image/gif,image/webp').split(',');
    
    this.initializeStorage();
    this.ensureUploadDirectory();
  }

  static getInstance(): FileUploadService {
    if (!FileUploadService.instance) {
      FileUploadService.instance = new FileUploadService();
    }
    return FileUploadService.instance;
  }

  /**
   * Initialize storage configuration
   */
  private initializeStorage(): void {
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        const uploadDir = path.join(this.uploadPath, String(year), month, day);
        fs.mkdir(uploadDir, { recursive: true })
          .then(() => cb(null, uploadDir))
          .catch(err => cb(err, uploadDir));
      },
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      }
    });
  }

  /**
   * Ensure upload directory exists
   */
  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.uploadPath, { recursive: true });
      logger.info(`Upload directory ensured: ${this.uploadPath}`);
    } catch (error) {
      logger.error('Error creating upload directory:', error);
    }
  }

  /**
   * Get multer configuration
   */
  getMulterConfig() {
    return multer({
      storage: this.storage,
      limits: {
        fileSize: this.maxFileSize,
        files: 10 // Maximum 10 files per request
      },
      fileFilter: (req, file, cb) => {
        if (this.allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`File type ${file.mimetype} is not allowed`));
        }
      }
    });
  }

  /**
   * Validate file before upload
   */
  validateFile(file: Express.Multer.File): FileValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push(`File size ${file.size} exceeds maximum allowed size ${this.maxFileSize}`);
    }

    // Check file type
    if (!this.allowedTypes.includes(file.mimetype)) {
      errors.push(`File type ${file.mimetype} is not allowed`);
    }

    // Check file name
    if (file.originalname.length > 255) {
      errors.push('File name is too long');
    }

    // Check for suspicious file extensions
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (suspiciousExtensions.includes(fileExtension)) {
      errors.push(`File extension ${fileExtension} is not allowed for security reasons`);
    }

    // Warnings for large files
    if (file.size > 5 * 1024 * 1024) { // 5MB
      warnings.push('Large file detected - upload may take longer');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Process uploaded file
   */
  async processFile(
    file: Express.Multer.File,
    options: FileProcessingOptions = {},
    userId: string
  ): Promise<UploadedFile> {
    try {
      const fileId = uuidv4();
      const processedPath = await this.processImage(file.path, options);
      const thumbnailPath = options.generateThumbnail 
        ? await this.generateThumbnail(file.path, options.thumbnailSize || 200)
        : undefined;

      // Get file metadata
      const metadata = await this.extractMetadata(file.path);

      // Generate URLs
      const baseUrl = getEnv('API_URL', 'http://localhost:3001');
      const fileUrl = `${baseUrl}/uploads/${path.relative(this.uploadPath, processedPath)}`;
      const thumbnailUrl = thumbnailPath 
        ? `${baseUrl}/uploads/${path.relative(this.uploadPath, thumbnailPath)}`
        : undefined;

      const uploadedFile: UploadedFile = {
        id: fileId,
        originalName: file.originalname,
        filename: path.basename(processedPath),
        mimetype: file.mimetype,
        size: file.size,
        path: processedPath,
        url: fileUrl,
        thumbnailUrl,
        metadata,
        uploadedBy: userId,
        uploadedAt: new Date(),
        isPublic: false,
        tags: []
      };

      // Save to database
      await this.saveFileRecord(uploadedFile);

      logger.info(`File processed successfully: ${fileId}`, {
        originalName: file.originalname,
        size: file.size,
        userId
      });

      return uploadedFile;
    } catch (error) {
      logger.error('Error processing file:', error);
      throw error;
    }
  }

  /**
   * Process image with Sharp
   */
  private async processImage(
    filePath: string,
    options: FileProcessingOptions
  ): Promise<string> {
    try {
      let image = sharp(filePath);

      // Resize if specified
      if (options.resize) {
        image = image.resize(options.resize);
      }

      // Convert format if specified
      if (options.format) {
        switch (options.format) {
          case 'jpeg':
            image = image.jpeg({ quality: options.quality || 80 });
            break;
          case 'png':
            image = image.png({ quality: options.quality || 80 });
            break;
          case 'webp':
            image = image.webp({ quality: options.quality || 80 });
            break;
          case 'gif':
            image = image.gif();
            break;
        }
      }

      // Add watermark if specified
      if (options.watermark) {
        image = await this.addWatermark(image, options.watermark);
      }

      // Generate output path
      const outputPath = filePath.replace(/\.[^/.]+$/, '') + '_processed.' + (options.format || 'jpg');
      
      await image.toFile(outputPath);
      return outputPath;
    } catch (error) {
      logger.error('Error processing image:', error);
      throw error;
    }
  }

  /**
   * Generate thumbnail
   */
  private async generateThumbnail(filePath: string, size: number): Promise<string> {
    try {
      const thumbnailPath = filePath.replace(/\.[^/.]+$/, '') + '_thumb.jpg';
      
      await sharp(filePath)
        .resize(size, size, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      return thumbnailPath;
    } catch (error) {
      logger.error('Error generating thumbnail:', error);
      throw error;
    }
  }

  /**
   * Add watermark to image
   */
  private async addWatermark(
    image: sharp.Sharp,
    watermark: FileProcessingOptions['watermark']
  ): Promise<sharp.Sharp> {
    try {
      if (watermark?.text) {
        // Add text watermark
        const svgText = `
          <svg width="200" height="50">
            <text x="10" y="30" font-family="Arial" font-size="16" fill="rgba(255,255,255,0.7)">
              ${watermark.text}
            </text>
          </svg>
        `;
        
        const svgBuffer = Buffer.from(svgText);
        image = image.composite([{ input: svgBuffer, gravity: watermark.position || 'bottom-right' }]);
      } else if (watermark?.image) {
        // Add image watermark
        image = image.composite([{ input: watermark.image, gravity: watermark.position || 'bottom-right' }]);
      }

      return image;
    } catch (error) {
      logger.error('Error adding watermark:', error);
      return image; // Return original image if watermark fails
    }
  }

  /**
   * Extract file metadata
   */
  private async extractMetadata(filePath: string): Promise<UploadedFile['metadata']> {
    try {
      const metadata = await sharp(filePath).metadata();
      
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
      };
    } catch (error) {
      logger.error('Error extracting metadata:', error);
      return {};
    }
  }

  /**
   * Save file record to database
   */
  private async saveFileRecord(file: UploadedFile): Promise<void> {
    try {
      const { error } = await supabase
        .from('uploaded_files')
        .insert({
          id: file.id,
          original_name: file.originalName,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          url: file.url,
          thumbnail_url: file.thumbnailUrl,
          metadata: file.metadata,
          uploaded_by: file.uploadedBy,
          uploaded_at: file.uploadedAt.toISOString(),
          is_public: file.isPublic,
          tags: file.tags
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      logger.error('Error saving file record:', error);
      throw error;
    }
  }

  /**
   * Get file by ID
   */
  async getFile(fileId: string): Promise<UploadedFile | null> {
    try {
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw error;
      }

      return this.mapDatabaseRecordToFile(data);
    } catch (error) {
      logger.error('Error getting file:', error);
      throw error;
    }
  }

  /**
   * Get user's files
   */
  async getUserFiles(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      isPublic?: boolean;
      tags?: string[];
    } = {}
  ): Promise<{ files: UploadedFile[]; total: number }> {
    try {
      let query = supabase
        .from('uploaded_files')
        .select('*', { count: 'exact' })
        .eq('uploaded_by', userId)
        .order('uploaded_at', { ascending: false });

      if (options.isPublic !== undefined) {
        query = query.eq('is_public', options.isPublic);
      }

      if (options.tags && options.tags.length > 0) {
        query = query.overlaps('tags', options.tags);
      }

      if (options.limit) {
        query = query.range(options.offset || 0, (options.offset || 0) + options.limit - 1);
      }

      const { data, count, error } = await query;

      if (error) {
        throw error;
      }

      return {
        files: data?.map(record => this.mapDatabaseRecordToFile(record)) || [],
        total: count || 0
      };
    } catch (error) {
      logger.error('Error getting user files:', error);
      throw error;
    }
  }

  /**
   * Update file metadata
   */
  async updateFile(
    fileId: string,
    updates: {
      isPublic?: boolean;
      tags?: string[];
      metadata?: Record<string, any>;
    }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('uploaded_files')
        .update({
          is_public: updates.isPublic,
          tags: updates.tags,
          metadata: updates.metadata
        })
        .eq('id', fileId);

      if (error) {
        throw error;
      }

      logger.info(`File ${fileId} updated successfully`);
    } catch (error) {
      logger.error('Error updating file:', error);
      throw error;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string, userId: string): Promise<void> {
    try {
      // Get file record
      const file = await this.getFile(fileId);
      if (!file) {
        throw new Error('File not found');
      }

      // Check ownership
      if (file.uploadedBy !== userId) {
        throw new Error('Unauthorized to delete this file');
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('uploaded_files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        throw dbError;
      }

      // Delete physical files
      await this.deletePhysicalFile(file.path);
      if (file.thumbnailUrl) {
        await this.deletePhysicalFile(file.path.replace(/\.[^/.]+$/, '') + '_thumb.jpg');
      }

      logger.info(`File ${fileId} deleted successfully`);
    } catch (error) {
      logger.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Delete physical file
   */
  private async deletePhysicalFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      logger.warn(`Could not delete physical file ${filePath}:`, error);
    }
  }

  /**
   * Search files
   */
  async searchFiles(
    query: string,
    options: {
      limit?: number;
      offset?: number;
      tags?: string[];
      mimetype?: string;
      isPublic?: boolean;
    } = {}
  ): Promise<{ files: UploadedFile[]; total: number }> {
    try {
      let dbQuery = supabase
        .from('uploaded_files')
        .select('*', { count: 'exact' })
        .or(`original_name.ilike.%${query}%,filename.ilike.%${query}%`)
        .order('uploaded_at', { ascending: false });

      if (options.tags && options.tags.length > 0) {
        dbQuery = dbQuery.overlaps('tags', options.tags);
      }

      if (options.mimetype) {
        dbQuery = dbQuery.eq('mimetype', options.mimetype);
      }

      if (options.isPublic !== undefined) {
        dbQuery = dbQuery.eq('is_public', options.isPublic);
      }

      if (options.limit) {
        dbQuery = dbQuery.range(options.offset || 0, (options.offset || 0) + options.limit - 1);
      }

      const { data, count, error } = await dbQuery;

      if (error) {
        throw error;
      }

      return {
        files: data?.map(record => this.mapDatabaseRecordToFile(record)) || [],
        total: count || 0
      };
    } catch (error) {
      logger.error('Error searching files:', error);
      throw error;
    }
  }

  /**
   * Get file statistics
   */
  async getFileStats(userId?: string): Promise<{
    totalFiles: number;
    totalSize: number;
    byType: Record<string, number>;
    byMonth: Array<{ month: string; count: number }>;
  }> {
    try {
      let query = supabase.from('uploaded_files').select('*');
      
      if (userId) {
        query = query.eq('uploaded_by', userId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (!data) {
        return { totalFiles: 0, totalSize: 0, byType: {}, byMonth: [] };
      }

      const totalFiles = data.length;
      const totalSize = data.reduce((sum, file) => sum + (file.size || 0), 0);

      const byType = data.reduce((acc, file) => {
        const type = file.mimetype.split('/')[0];
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byMonth = data.reduce((acc, file) => {
        const month = new Date(file.uploaded_at).toISOString().slice(0, 7);
        const existing = acc.find(item => item.month === month);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ month, count: 1 });
        }
        return acc;
      }, [] as Array<{ month: string; count: number }>);

      return { totalFiles, totalSize, byType, byMonth };
    } catch (error) {
      logger.error('Error getting file statistics:', error);
      throw error;
    }
  }

  /**
   * Map database record to UploadedFile interface
   */
  private mapDatabaseRecordToFile(record: any): UploadedFile {
    return {
      id: record.id,
      originalName: record.original_name,
      filename: record.filename,
      mimetype: record.mimetype,
      size: record.size,
      path: record.path,
      url: record.url,
      thumbnailUrl: record.thumbnail_url,
      metadata: record.metadata,
      uploadedBy: record.uploaded_by,
      uploadedAt: new Date(record.uploaded_at),
      isPublic: record.is_public,
      tags: record.tags || []
    };
  }

  /**
   * Clean up orphaned files
   */
  async cleanupOrphanedFiles(): Promise<number> {
    try {
      // Get all files in upload directory
      const files = await this.getAllFilesInDirectory(this.uploadPath);
      let deletedCount = 0;

      for (const filePath of files) {
        const relativePath = path.relative(this.uploadPath, filePath);
        
        // Check if file exists in database
        const { data } = await supabase
          .from('uploaded_files')
          .select('id')
          .eq('path', filePath)
          .single();

        if (!data) {
          // File doesn't exist in database, delete it
          await this.deletePhysicalFile(filePath);
          deletedCount++;
        }
      }

      logger.info(`Cleaned up ${deletedCount} orphaned files`);
      return deletedCount;
    } catch (error) {
      logger.error('Error cleaning up orphaned files:', error);
      throw error;
    }
  }

  /**
   * Get all files in directory recursively
   */
  private async getAllFilesInDirectory(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const items = await fs.readdir(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        
        if (stat.isFile()) {
          files.push(fullPath);
        } else if (stat.isDirectory()) {
          files.push(...await this.getAllFilesInDirectory(fullPath));
        }
      }
    } catch (error) {
      logger.error(`Error reading directory ${dir}:`, error);
    }
    
    return files;
  }
}

// Export singleton instance
export const fileUploadService = FileUploadService.getInstance();

// Export for direct use
export default fileUploadService; 