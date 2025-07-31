import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, Video, Music, FileText } from 'lucide-react';
import { Button } from './button';
import { Progress } from './progress';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  onFileRemove?: (file: File) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
  uploadProgress?: { [key: string]: number };
}

interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  multiple = false,
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  disabled = false,
  className,
  showPreview = true,
  uploadProgress = {}
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    const type = file.type.split('/')[0];
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File ${file.name} is too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
    }
    if (accept !== "*/*" && !file.type.match(accept.replace(/,/g, '|'))) {
      return `File ${file.name} is not an accepted file type`;
    }
    return null;
  };

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles: FileWithPreview[] = [];
    const newErrors: string[] = [];

    Array.from(fileList).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
        return;
      }

      const fileWithPreview: FileWithPreview = {
        ...file,
        id: Math.random().toString(36).substr(2, 9)
      };

      if (showPreview && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fileWithPreview.preview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(fileWithPreview);
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors([]), 5000);
    }

    if (newFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      if (maxFiles && updatedFiles.length > maxFiles) {
        setErrors([`Maximum ${maxFiles} files allowed`]);
        return;
      }
      setFiles(updatedFiles);
      onFileSelect?.(newFiles);
    }
  }, [files, multiple, maxFiles, maxSize, accept, showPreview, onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileToRemove: FileWithPreview) => {
    const updatedFiles = files.filter(f => f.id !== fileToRemove.id);
    setFiles(updatedFiles);
    onFileRemove?.(fileToRemove);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          "hover:border-primary/50 cursor-pointer",
          isDragOver && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          "sm:p-8"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-8 text-muted-foreground mb-4" />
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-muted-foreground">
            {accept !== "*/*" ? `Accepted types: ${accept}` : "All file types accepted"}
            {maxSize && ` • Max size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`}
            {maxFiles && ` • Max files: ${maxFiles}`}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {error}
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files ({files.length})</h4>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-3 p-3 border rounded-lg bg-background"
              >
                {showPreview && file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                ) : (
                  <div className="h-12 w-12 flex items-center justify-center bg-muted rounded">
                    {getFileIcon(file)}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                  {uploadProgress[file.name] !== undefined && (
                    <Progress value={uploadProgress[file.name]} className="mt-1" />
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 