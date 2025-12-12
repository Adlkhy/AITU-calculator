import React, { useState } from 'react';
import { parseSyllabus } from '../services/geminiService';
import type { GradeItem } from '../hooks/types';
import { Loader } from './ui/Loader';

interface SyllabusUploaderProps {
  onDataParsed: (items: GradeItem[]) => void;
}

export const SyllabusUploader: React.FC<SyllabusUploaderProps> = ({ onDataParsed }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setError(null);
    setFileName(file.name);
    setIsLoading(true);

    try {
      // 1. Convert File to Base64
      const base64Data = await fileToBase64(file);
      
      // 2. Determine generic mime type validation (Gemini handles specific details well)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Unsupported file type. Please upload an Image or PDF.");
      }

      // 3. Strip header "data:image/png;base64," to get raw bytes
      const rawBase64 = base64Data.split(',')[1];

      // 4. Call Gemini API
      const result = await parseSyllabus(rawBase64, file.type);
      
      if (!result.breakdown || result.breakdown.length === 0) {
        throw new Error("Could not identify grading criteria. Please try a clearer image.");
      }

      // 5. Transform to GradeItem
      const newItems: GradeItem[] = result.breakdown.map((item, index) => ({
        id: `parsed-${Date.now()}-${index}`,
        category: item.category,
        weight: item.weight,
        score: undefined, // User needs to fill this
      }));

      onDataParsed(newItems);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to parse syllabus");
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="max-w-4xl mx-auto mb-10">
      <div className="bg-card rounded-xl shadow-lg border border-foreground p-4 sm:p-8">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Auto-Fill from Syllabus</h2>
          <p className="text-sm sm:text-md text-muted-foreground mb-6">
            Upload a screenshot of your syllabus grading table. 
            Gemini AI will extract the weights for you.
          </p>
        </div>

        <div className="relative group">
          <label 
            htmlFor="syllabus-upload" 
            className={`
              flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer
              transition-all duration-200 bg-muted
              ${isLoading ? 'bg-muted border-muted' : 'border-muted-foreground hover:bg-accent'}
            `}
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader size="lg" className="text-primary" />
                <p className="text-foreground font-medium animate-pulse">Analyzing document...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <svg className="w-10 h-10 text-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG (Max 10MB)</p>
                </div>
              </div>
            )}
            <input 
              id="syllabus-upload" 
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,image/*"
              disabled={isLoading}
            />
          </label>
        </div>

        {fileName && !isLoading && !error && (
           <div className="mt-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
             <span>Successfully processed: <strong>{fileName}</strong></span>
           </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
