
import React, { useRef } from 'react';
import { CloudUpload, Loader } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      onFileSelect(base64Data, file.type);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 border-2 border-dashed border-foreground/80 rounded-2xl bg-card shadow-sm hover:border-primary transition-colors">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-secondary rounded-full">
          <CloudUpload className="text-4xl text-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground">Upload Syllabus</h3>
          <p className="text-foreground/80 mt-1">Upload a photo or PDF of your grading table</p>
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
          accept="image/*,application/pdf"
        />
        <p className="text-xs text-foreground/80">Supported: JPG, PNG, WEBP, PDF</p>
      </div>
    </div>
  );
};
