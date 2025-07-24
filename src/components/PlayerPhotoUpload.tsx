import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, Upload, X, Crop, RotateCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PlayerPhotoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSave: (photoUrl: string) => void;
  currentPhoto?: string;
  playerName: string;
}

export const PlayerPhotoUpload: React.FC<PlayerPhotoUploadProps> = ({
  isOpen,
  onClose,
  onPhotoSave,
  currentPhoto,
  playerName
}) => {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhoto || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(t('photo.upload.invalid.type'));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('photo.upload.too.large'));
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!selectedFile && !previewUrl) return;

    setIsUploading(true);
    try {
      // In production, upload to your storage service (Supabase Storage, AWS S3, etc.)
      // For demo, we'll use the preview URL
      if (previewUrl) {
        onPhotoSave(previewUrl);
      }
    } catch (error) {
      console.error('Photo upload failed:', error);
      alert(t('photo.upload.failed'));
    } finally {
      setIsUploading(false);
      onClose();
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {t('photo.upload.title')} - {playerName}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Photo Preview */}
          <div className="flex justify-center">
            <div className="relative">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt={playerName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                  <Button
                    onClick={handleRemovePhoto}
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-8 h-8 p-0 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Upload Controls */}
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              onClick={triggerFileInput}
              variant="outline"
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {t('photo.upload.select')}
            </Button>

            {selectedFile && (
              <div className="text-sm text-gray-600 text-center">
                <p>{t('photo.upload.selected')}: {selectedFile.name}</p>
                <p>{t('photo.upload.size')}: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              {t('photo.upload.cancel')}
            </Button>
            <Button
              onClick={handleSave}
              disabled={!previewUrl || isUploading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {t('photo.upload.uploading')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('photo.upload.save')}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};