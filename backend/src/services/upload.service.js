const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

class UploadService {
  constructor() {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = process.env.R2_BUCKET_NAME;
    this.table = 'files';
  }

  async uploadImage(file, options = {}) {
    try {
      const { userId, category = 'media', description, tags = [] } = options;
      
      // Generate unique filename
      const fileId = uuidv4();
      const extension = this.getFileExtension(file.originalname);
      const filename = `${fileId}.${extension}`;
      const key = `images/${category}/${filename}`;

      // Process image with Sharp
      let processedBuffer = file.buffer;
      
      if (file.mimetype.startsWith('image/')) {
        processedBuffer = await sharp(file.buffer)
          .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
      }

      // Upload to R2
      const uploadParams = {
        Bucket: this.bucketName,
        Key: key,
        Body: processedBuffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedBy: userId,
          category: category,
          description: description || '',
          tags: JSON.stringify(tags)
        }
      };

      await this.s3Client.send(new PutObjectCommand(uploadParams));

      // Save file record to database
      const { data, error } = await supabase
        .from(this.table)
        .insert({
          id: fileId,
          user_id: userId,
          filename: filename,
          original_name: file.originalname,
          file_path: key,
          file_size: processedBuffer.length,
          mime_type: file.mimetype,
          category: category,
          description: description,
          tags: tags,
          url: this.getPublicUrl(key)
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async uploadMultipleImages(files, options = {}) {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file, options));
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  }

  async uploadDocument(file, options = {}) {
    try {
      const { userId, category = 'document', description, tags = [] } = options;
      
      // Generate unique filename
      const fileId = uuidv4();
      const extension = this.getFileExtension(file.originalname);
      const filename = `${fileId}.${extension}`;
      const key = `documents/${category}/${filename}`;

      // Upload to R2
      const uploadParams = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedBy: userId,
          category: category,
          description: description || '',
          tags: JSON.stringify(tags)
        }
      };

      await this.s3Client.send(new PutObjectCommand(uploadParams));

      // Save file record to database
      const { data, error } = await supabase
        .from(this.table)
        .insert({
          id: fileId,
          user_id: userId,
          filename: filename,
          original_name: file.originalname,
          file_path: key,
          file_size: file.buffer.length,
          mime_type: file.mimetype,
          category: category,
          description: description,
          tags: tags,
          url: this.getPublicUrl(key)
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async uploadVideo(file, options = {}) {
    try {
      const { userId, category = 'media', description, tags = [] } = options;
      
      // Generate unique filename
      const fileId = uuidv4();
      const extension = this.getFileExtension(file.originalname);
      const filename = `${fileId}.${extension}`;
      const key = `videos/${category}/${filename}`;

      // Upload to R2
      const uploadParams = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedBy: userId,
          category: category,
          description: description || '',
          tags: JSON.stringify(tags)
        }
      };

      await this.s3Client.send(new PutObjectCommand(uploadParams));

      // Save file record to database
      const { data, error } = await supabase
        .from(this.table)
        .insert({
          id: fileId,
          user_id: userId,
          filename: filename,
          original_name: file.originalname,
          file_path: key,
          file_size: file.buffer.length,
          mime_type: file.mimetype,
          category: category,
          description: description,
          tags: tags,
          url: this.getPublicUrl(key)
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }

  async uploadPlayerPhoto(file, playerId, userId) {
    try {
      // Verify player belongs to user
      const { data: player, error: playerError } = await supabase
        .from('players')
        .select('id, teams!inner(user_id)')
        .eq('id', playerId)
        .eq('teams.user_id', userId)
        .single();

      if (playerError || !player) {
        throw new Error('Player not found or access denied');
      }

      const fileData = await this.uploadImage(file, {
        userId,
        category: 'player_photos',
        description: `Photo for player ${playerId}`
      });

      // Update player record
      const { data, error } = await supabase
        .from('players')
        .update({ photo_url: fileData.url })
        .eq('id', playerId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error uploading player photo:', error);
      throw error;
    }
  }

  async uploadTeamLogo(file, teamId, userId) {
    try {
      // Verify team belongs to user
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('id', teamId)
        .eq('user_id', userId)
        .single();

      if (teamError || !team) {
        throw new Error('Team not found or access denied');
      }

      const fileData = await this.uploadImage(file, {
        userId,
        category: 'team_logos',
        description: `Logo for team ${teamId}`
      });

      // Update team record
      const { data, error } = await supabase
        .from('teams')
        .update({ logo_url: fileData.url })
        .eq('id', teamId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error uploading team logo:', error);
      throw error;
    }
  }

  async getUserFiles(userId, options = {}) {
    try {
      const { page = 1, limit = 20, category, search } = options;
      const offset = (page - 1) * limit;

      let query = supabase
        .from(this.table)
        .select('*')
        .eq('user_id', userId);

      if (category) {
        query = query.eq('category', category);
      }

      if (search) {
        query = query.or(`original_name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        files: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching user files:', error);
      throw error;
    }
  }

  async getFileById(fileId, userId) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('id', fileId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  }

  async updateFileMetadata(fileId, userId, updateData) {
    try {
      // Verify file belongs to user
      const file = await this.getFileById(fileId, userId);
      if (!file) {
        return null;
      }

      const { data, error } = await supabase
        .from(this.table)
        .update(updateData)
        .eq('id', fileId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating file metadata:', error);
      throw error;
    }
  }

  async deleteFile(fileId, userId) {
    try {
      // Verify file belongs to user
      const file = await this.getFileById(fileId, userId);
      if (!file) {
        return false;
      }

      // Delete from R2
      const deleteParams = {
        Bucket: this.bucketName,
        Key: file.file_path
      };

      await this.s3Client.send(new DeleteObjectCommand(deleteParams));

      // Delete from database
      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('id', fileId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async shareFile(fileId, userId, shareData) {
    try {
      const { shareWith, permissions = 'read' } = shareData;

      // Verify file belongs to user
      const file = await this.getFileById(fileId, userId);
      if (!file) {
        throw new Error('File not found');
      }

      // Create share record
      const { data, error } = await supabase
        .from('file_shares')
        .insert({
          file_id: fileId,
          shared_by: userId,
          shared_with: shareWith,
          permissions: permissions,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sharing file:', error);
      throw error;
    }
  }

  async getDownloadUrl(fileId, userId) {
    try {
      // Verify file belongs to user
      const file = await this.getFileById(fileId, userId);
      if (!file) {
        return null;
      }

      // Generate presigned URL for download
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: file.file_path
      });

      const downloadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600 // 1 hour
      });

      return downloadUrl;
    } catch (error) {
      console.error('Error generating download URL:', error);
      throw error;
    }
  }

  async bulkDeleteFiles(fileIds, userId) {
    try {
      let deletedCount = 0;

      for (const fileId of fileIds) {
        const deleted = await this.deleteFile(fileId, userId);
        if (deleted) {
          deletedCount++;
        }
      }

      return deletedCount;
    } catch (error) {
      console.error('Error bulk deleting files:', error);
      throw error;
    }
  }

  async getStorageUsage(userId) {
    try {
      const { data: files, error } = await supabase
        .from(this.table)
        .select('file_size')
        .eq('user_id', userId);

      if (error) throw error;

      const totalSize = files.reduce((sum, file) => sum + file.file_size, 0);
      const fileCount = files.length;

      return {
        totalSize,
        fileCount,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        totalSizeGB: (totalSize / (1024 * 1024 * 1024)).toFixed(2)
      };
    } catch (error) {
      console.error('Error fetching storage usage:', error);
      throw error;
    }
  }

  getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  }

  getPublicUrl(key) {
    return `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`;
  }
}

module.exports = UploadService; 