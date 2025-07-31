const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth.middleware');
const { rateLimit } = require('../middleware/rateLimit.middleware');
const { handleValidationErrors } = require('../middleware/validation.middleware');
const { body } = require('express-validator');

// Import services
const UploadService = require('../services/upload.service');
const uploadService = new UploadService();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Max 5 files per request
  },
  fileFilter: (req, file, cb) => {
    // Allow images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    }
    // Allow documents
    else if (file.mimetype === 'application/pdf' || 
             file.mimetype === 'application/msword' ||
             file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    }
    // Allow videos
    else if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    }
    else {
      cb(new Error('Invalid file type. Only images, documents, and videos are allowed.'), false);
    }
  }
});

// Validation rules
const uploadValidation = [
  body('category').optional().isIn(['profile', 'team', 'match', 'document', 'media']).withMessage('Invalid category'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description too long'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
];

// POST /api/upload/image - Upload single image
router.post('/image', authenticateToken, rateLimit, upload.single('image'), uploadValidation, handleValidationErrors, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const userId = req.user.id;
    const { category = 'media', description, tags } = req.body;

    const uploadResult = await uploadService.uploadImage(req.file, {
      userId,
      category,
      description,
      tags: tags ? JSON.parse(tags) : []
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: uploadResult
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// POST /api/upload/images - Upload multiple images
router.post('/images', authenticateToken, rateLimit, upload.array('images', 10), uploadValidation, handleValidationErrors, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const userId = req.user.id;
    const { category = 'media', description, tags } = req.body;

    const uploadResults = await uploadService.uploadMultipleImages(req.files, {
      userId,
      category,
      description,
      tags: tags ? JSON.parse(tags) : []
    });

    res.status(201).json({
      success: true,
      message: `${uploadResults.length} images uploaded successfully`,
      data: uploadResults
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

// POST /api/upload/document - Upload document
router.post('/document', authenticateToken, rateLimit, upload.single('document'), uploadValidation, handleValidationErrors, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No document file provided'
      });
    }

    const userId = req.user.id;
    const { category = 'document', description, tags } = req.body;

    const uploadResult = await uploadService.uploadDocument(req.file, {
      userId,
      category,
      description,
      tags: tags ? JSON.parse(tags) : []
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: uploadResult
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message
    });
  }
});

// POST /api/upload/video - Upload video
router.post('/video', authenticateToken, rateLimit, upload.single('video'), uploadValidation, handleValidationErrors, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file provided'
      });
    }

    const userId = req.user.id;
    const { category = 'media', description, tags } = req.body;

    const uploadResult = await uploadService.uploadVideo(req.file, {
      userId,
      category,
      description,
      tags: tags ? JSON.parse(tags) : []
    });

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: uploadResult
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload video',
      error: error.message
    });
  }
});

// POST /api/upload/player-photo - Upload player photo
router.post('/player-photo/:playerId', authenticateToken, rateLimit, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No photo file provided'
      });
    }

    const userId = req.user.id;
    const { playerId } = req.params;

    const uploadResult = await uploadService.uploadPlayerPhoto(req.file, playerId, userId);

    res.status(201).json({
      success: true,
      message: 'Player photo uploaded successfully',
      data: uploadResult
    });
  } catch (error) {
    console.error('Error uploading player photo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload player photo',
      error: error.message
    });
  }
});

// POST /api/upload/team-logo - Upload team logo
router.post('/team-logo/:teamId', authenticateToken, rateLimit, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No logo file provided'
      });
    }

    const userId = req.user.id;
    const { teamId } = req.params;

    const uploadResult = await uploadService.uploadTeamLogo(req.file, teamId, userId);

    res.status(201).json({
      success: true,
      message: 'Team logo uploaded successfully',
      data: uploadResult
    });
  } catch (error) {
    console.error('Error uploading team logo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload team logo',
      error: error.message
    });
  }
});

// GET /api/upload/files - Get user files
router.get('/files', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, category, search } = req.query;

    const files = await uploadService.getUserFiles(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      search
    });

    res.json({
      success: true,
      data: files,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: files.length
      }
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch files',
      error: error.message
    });
  }
});

// GET /api/upload/files/:id - Get file details
router.get('/files/:id', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const file = await uploadService.getFileById(id, userId);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch file',
      error: error.message
    });
  }
});

// PUT /api/upload/files/:id - Update file metadata
router.put('/files/:id', authenticateToken, rateLimit, uploadValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    const updatedFile = await uploadService.updateFileMetadata(id, userId, updateData);

    if (!updatedFile) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      message: 'File updated successfully',
      data: updatedFile
    });
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update file',
      error: error.message
    });
  }
});

// DELETE /api/upload/files/:id - Delete file
router.delete('/files/:id', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await uploadService.deleteFile(id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
});

// POST /api/upload/files/:id/share - Share file
router.post('/files/:id/share', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { shareWith, permissions = 'read' } = req.body;

    const shareResult = await uploadService.shareFile(id, userId, {
      shareWith,
      permissions
    });

    res.json({
      success: true,
      message: 'File shared successfully',
      data: shareResult
    });
  } catch (error) {
    console.error('Error sharing file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to share file',
      error: error.message
    });
  }
});

// GET /api/upload/files/:id/download - Download file
router.get('/files/:id/download', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const downloadUrl = await uploadService.getDownloadUrl(id, userId);

    if (!downloadUrl) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      data: {
        downloadUrl,
        expiresIn: 3600 // 1 hour
      }
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate download URL',
      error: error.message
    });
  }
});

// POST /api/upload/bulk-delete - Bulk delete files
router.post('/bulk-delete', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { fileIds } = req.body;

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'File IDs array is required'
      });
    }

    const deletedCount = await uploadService.bulkDeleteFiles(fileIds, userId);

    res.json({
      success: true,
      message: `${deletedCount} files deleted successfully`,
      data: { deletedCount }
    });
  } catch (error) {
    console.error('Error bulk deleting files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete files',
      error: error.message
    });
  }
});

// GET /api/upload/storage-usage - Get storage usage
router.get('/storage-usage', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;

    const usage = await uploadService.getStorageUsage(userId);

    res.json({
      success: true,
      data: usage
    });
  } catch (error) {
    console.error('Error fetching storage usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch storage usage',
      error: error.message
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files per request.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
});

module.exports = router; 