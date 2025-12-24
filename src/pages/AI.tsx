// // import { GlowEffect } from '@/components/ui/glow-button';
import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { GradeCalculator } from '../components/GradeCalculator';
import { parseSyllabus } from '../services/geminiService';
import { Navbar08 } from '../components/Navbar2';
import Footer from '../components/Footer';
import type { SyllabusData } from '../hooks/types';
import { SlidersHorizontal, ChartLine, WandSparkles, BadgeAlert, CircleArrowLeft} from 'lucide-react';

const App: React.FC = () => {
  const [syllabusData, setSyllabusData] = useState<SyllabusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (base64: string, mimeType: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await parseSyllabus(base64, mimeType);
      setSyllabusData(response.syllabus);
    } catch (err) {
      setError("Failed to parse the syllabus. Please ensure the image is clear and contains a grading table.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSyllabusData(null);
    setError(null);
  };

  return (
    <>
    <Navbar08 />
    <div className="max-w-4xl mx-auto px-4 md:px-8">
      {/* Header */}
      <header className="text-center mb-16 px-4 md:px-8 mt-6">
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
          SmartSyllabus <span className="text-primary">Calculator</span>
        </h1>
        <p className="text-lg text-foreground max-w-2xl mx-auto">
          Don't guess your grades. Upload your syllabus and let AI build your custom grade tracker instantly.
        </p>
      </header>

      <main>
        {!syllabusData ? (
          <div className="animate-in px-4 md:px-8 fade-in slide-in-from-bottom-4 duration-700">
            <FileUpload onFileSelect={handleFileUpload} isLoading={loading} />
            
            {error &&  (
              <div className="mt-6 p-4 bg-destructive-foreground text-destructive rounded-xl text-center flex items-center justify-center">
                <BadgeAlert className="w-6 h-6 mr-2 text-destructive" />
                {error}
              </div>
            )}

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="w-12 h-12 bg-chart-1 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <WandSparkles className="w-6 h-6" />
                </div>
                <h4 className="font-bold mb-2">Instant Extraction</h4>
                <p className="text-sm text-foreground/80">Gemini AI reads complex tables and nested grading structures for you.</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-chart-2 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h4 className="font-bold mb-2">Interactive Tracker</h4>
                <p className="text-sm text-foreground/80">Enter your scores for assignments to see your weighted progress.</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-chart-3 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChartLine className="w-6 h-6" />
                </div>
                <h4 className="font-bold mb-2">Grade Visualization</h4>
                <p className="text-sm text-foreground/80">See exactly which categories are pulling your GPA up or down.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-8">
              <button 
                onClick={reset}
                className="text-foreground hover:text-primary flex items-center font-medium transition-colors"
              >
                <CircleArrowLeft className="w-5 h-5 mr-2" /> Upload another syllabus
              </button>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                AI ANALYZED
              </div>
            </div>
            
            <GradeCalculator data={syllabusData} />
          </div>
        )}
      </main>

      <Footer />
    </div>
    </>
  );
};

export default App;
