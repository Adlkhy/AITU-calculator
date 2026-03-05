// // import { GlowEffect } from '@/components/ui/glow-button';
import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { GradeCalculator } from '../components/GradeCalculator';
import { parseSyllabus } from '../services/geminiService';
import RotatingText from '@/components/shadcn/gsap/RotatingText';
import { Navbar08 } from '../components/Navbar2';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { useGemini } from '@/hooks/useGemini';
import { useGeminiClient } from '../lib/GeminiClient';
import type { SyllabusData } from '../hooks/types';
import Footer from '@/components/Footer';
// import CircularGallery from '@/components/shadcn/gsap/CircularGallary';
import { BadgeAlert, CircleArrowLeft} from 'lucide-react';

const App: React.FC = () => {
  const [syllabusData, setSyllabusData] = useState<SyllabusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiKey } = useGemini();
  const { clearKey } = useGeminiClient();

  const handleFileUpload = async (base64: string, mimeType: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await parseSyllabus(base64, mimeType, apiKey);
      setSyllabusData(response.syllabus);
    } catch (err: unknown) {
      // If the error code indicates an API key issue:
      if ((err instanceof Error && err.message?.includes('API_KEY_INVALID')) || (err instanceof Error && err.message?.includes('401')) || (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 401)) {
        alert("Your API Key seems to be invalid or expired. Please re-enter it.");
        clearKey(); // This triggers the UI to show the Input Modal again via Context
      } else {
        setError("Failed to parse the syllabus. Please ensure the image is clear and contains a grading table.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSyllabusData(null);
    setError(null);
  };

  // const items = [
  //   { image: '/quote1.jpeg', text: '' },
  //   { image: '/quote2.jpeg', text: '' },
  //   { image: '/quote4.jpeg', text: '' },
  //   { image: '/quote5.jpeg', text: '' },
  //   { image: '/quote3.jpeg', text: '' },
  //   { image: '/quote6.jpeg', text: '' },

  // ];

  return (
    <>
    <Navbar08 />
    <div className="max-w-4xl min-h-screen mx-auto px-4 md:px-8">
      {/* Header */}
      <header className="mb-10 px-4 md:px-8 mt-6">
        {/* <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
          We Asked AI. <br className='md:hidden'/>It Said <span className="text-primary">‘Sure’</span>
        </h1> */}
        <RotatingText
          texts={["We Asked AI. It Said 'Sure'", "We Put AI in It. You're Welcome. Or Sorry.", "An Overengineered Solution to a Simple Problem", "Because Someone Said 'What If You Add AI?'", "Yep, I Trained a Model Instead of Writing Logic"]}
          mainClassName='text-3xl justify-center flex items-center md:text-5xl text-center font-bold text-foreground tracking-tight mb-4'
          staggerFrom={"first"}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-120%", opacity: 0 }}
          staggerDuration={0.25}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring"}}
          rotationInterval={6500}
          splitBy='lines'/>
        <p className="text-lg text-foreground text-center max-w-2xl mx-auto">
          Don't guess your grades. Upload your syllabus and let AI build your custom grade tracker instantly.
        </p>
      </header>

      <section>
        {!syllabusData ? (
          <div className="animate-in px-4 md:px-8 fade-in slide-in-from-bottom-4 duration-700">
            {error &&  (
              <div className="my-6 p-4 bg-card text-destructive rounded-xl text-center flex items-center justify-center">
                <BadgeAlert className="w-6 h-6 mr-2 text-destructive" />
                {error} Error
              </div>
            )}
            { !apiKey ? (
              <ApiKeyInput />
            ) : (
              <FileUpload onFileSelect={handleFileUpload} isLoading={loading} />
            )}
            
            {/* <div style={{ height: '40vh', width: '100%', position: 'relative' }}>
              <CircularGallery 
              items={items}
              borderRadius={0.05} 
              bend={-1}
              scrollSpeed={2}
              scrollEase={0.05}
              />
            </div> */}
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-500 mb-10">
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
      </section>

    </div>
    <Footer />
    </>
  );
};

export default App;
