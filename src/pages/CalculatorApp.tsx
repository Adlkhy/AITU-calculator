import { useState, useEffect } from "react";
import { Navbar08 } from "../components/Navbar2";
import Footer from "../components/Footer";
import Dynamic from "../components/Dynamic";
import Budget from "../components/Budget";
import Attendance from "../components/Attendance";
import GPA from "../components/GPA";
import { GradeCalculator } from "../components/GradeCalculator";
import { type SyllabusData } from "../hooks/types";
import { DotLoader } from '@/components/shadcn/gsap/dot-loader';

export default function MainCalculator() {
  const subjects = [
    "Custom",
    "Attendance",
    "GPA",
    "Budget",
    "Calculus",
    "History",
    "ADS",
    "English B2",
    "Programming",
    "Sociology",
    "Discrete Math",
    "Psychology",
    "English",
    "ICT",
  ];
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [templateData, setTemplateData] = useState<SyllabusData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const templates = ["Programming", "English", "Sociology", "Discrete Math", "Psychology", "ICT", "Calculus", "History", "ADS", "English B2"];
    if (templates.includes(selectedSubject)) {
      setIsLoading(true);
      fetch(`/templates/${selectedSubject.replace(" ", "")}.json`)
        .then(res => res.json())
        .then(data => {
          setTemplateData(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error loading template:", err);
          setIsLoading(false);
        });
    } else {
      setTemplateData(null);
    }
  }, [selectedSubject]);

  const renderCalculator = () => {
      const game = [[14, 7, 0, 8, 6, 13, 20], [14, 7, 13, 20, 16, 27, 21], [14, 20, 27, 21, 34, 24, 28], [27, 21, 34, 28, 41, 32, 35], [34, 28, 41, 35, 48, 40, 42], [34, 28, 41, 35, 48, 42, 46], [34, 28, 41, 35, 48, 42, 38], [34, 28, 41, 35, 48, 30, 21], [34, 28, 41, 48, 21, 22, 14], [34, 28, 41, 21, 14, 16, 27], [34, 28, 21, 14, 10, 20, 27], [28, 21, 14, 4, 13, 20, 27], [28, 21, 14, 12, 6, 13, 20], [28, 21, 14, 6, 13, 20, 11], [28, 21, 14, 6, 13, 20, 10], [14, 6, 13, 20, 9, 7, 21]]; 
    
      if (isLoading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center flex items-center gap-5 rounded px-4 py-3">
            <DotLoader frames={game} className='gap-0.5' color="primary" duration={150} isPlaying={true} dotClassName='bg-foreground/15 [&.active]:bg-foreground size-1.5 sm:size-2.5' />
            <p className="text-base sm:text-2xl font-medium text-foreground">Loading...</p>
          </div>
        </div>
      );

    if (templateData) {
      return <GradeCalculator data={templateData} />;
    }

    switch (selectedSubject) {
      case "Custom":
        return <Dynamic />;
      case "Attendance":
        return <Attendance />;
      case "Budget":
        return <Budget />;
      case "GPA":
        return <GPA />;
      default:
        return <p className="text-center py-10">Please select a subject</p>;
    }
  };

  return (
    <>
      <Navbar08
        subjects={subjects}
        selectedSubject={selectedSubject}
        onSelectSubject={setSelectedSubject}
      />
      <div className="text-foreground min-h-screen font-sans">
        <div className="max-w-5xl mx-auto min-h-screen px-4 pt-4 mb-4 sm:mb-16 sm:px-8 sm:pt-16">
          <main className="">{renderCalculator()}</main>
        </div>
        <Footer />
      </div>
    </>
  );
}
