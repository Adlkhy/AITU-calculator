import React, { useRef, useState } from 'react';
import { CloudUpload, Loader } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const supportedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  const supportedExtensions = ['png', 'jpg', 'jpeg', 'webp'];

  const isSupportedImage = (file: File) => {
    const mimeType = file.type.toLowerCase();
    if (supportedMimeTypes.includes(mimeType)) {
      return true;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension ? supportedExtensions.includes(extension) : false;
  };

  const processFile = (file: File) => {
    if (!isSupportedImage(file)) {
      setErrorMessage('Only PNG, JPG, JPEG, and WEBP images are allowed.');
      return;
    }

    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      onFileSelect(base64Data, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    processFile(file);
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-8 border-2 border-dashed rounded-2xl bg-card shadow-sm transition-colors ${
        isDragActive ? 'border-primary' : 'border-foreground/80 hover:border-primary'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-secondary rounded-full">
          <CloudUpload className="text-4xl text-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground">Upload Syllabus</h3>
          <p className="text-foreground/80 mt-1">Upload a photo of your grading table</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className={`px-6 py-3 bg-accent text-foreground rounded-lg font-medium shadow-lg hover:bg-primary hover:text-primary-foreground transition-all ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader className="w-5 h-5 mr-2 animate-spin" /> Analyzing...
            </span>
          ) : (
            'Choose File'
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png,image/jpeg,image/jpg,image/webp"
        />
        {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
        <p className="text-xs text-foreground/80">Supported: JPG, PNG, WEBP</p>
      </div>
    </div>
  );
};
