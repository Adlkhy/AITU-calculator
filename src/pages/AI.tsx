// import { useState } from 'react';
// import { SyllabusUploader } from '../components/SyllabusUploader';
// import { GradeCalculator } from '../components/GradeCalculator';
import { Navbar08 } from '../components/Navbar2';
// import Footer from '../components/Footer';
// import type { GradeItem } from '../hooks/types';

// function AI() {
//   const [items, setItems] = useState<GradeItem[]>([
//     { id: '1', category: 'Homework', weight: 20, score: 95 },
//     { id: '2', category: 'Midterm', weight: 30, score: 82 },
//     { id: '3', category: 'Final Project', weight: 50 }, // No score yet
//   ]);

//   const handleParsedData = (parsedItems: GradeItem[]) => {
//     setItems(parsedItems);
//   };

//   return (
//     <>
//       {/* Navbar */}
//       <Navbar08
//         subjects={[]}
//         selectedSubject=""
//         onSelectSubject={() => {}}
//       />
//     <div className="min-h-screen flex flex-col">
//     <div className="max-w-4xl mx-auto p-4 sm:p-8">
//       {/* Main Content */}
//       <main className="flex-grow">
//         <div className="max-w-4xl mx-auto space-y-6">
          
//           <div className="text-center space-y-2 py-4">
//              <h2 className="text-2xl sm:text-4xl font-bold text-foreground">Calculate Your Success</h2>
//              <p className="text-base sm:text-lg text-foreground max-w-2xl mx-auto">
//                Stop guessing. Upload your syllabus to automatically configure the grade calculator, or enter values manually below.
//              </p>
//           </div>

//           <SyllabusUploader onDataParsed={handleParsedData} />
          
//           <div id="calculator-section">
//             <GradeCalculator initialItems={items} />
//           </div>

//         </div>
//       </main>

//       {/* Footer */}
//       <Footer />
//       </div>
//     </div>
//     </>
//   );
// }

// export default AI;

export default function PlaceholderAI({ subject } : { subject: string }) {
  return (
    <>
    <Navbar08 />
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
    <div className="rounded-lg bg-card p-8 text-center border border-foreground">
      <h2 className="text-3xl text-primary font-bold mb-4">{subject} AI</h2>
      <p className="text-foreground">
        The AI feature is coming soon.
      </p>
    </div>
    </div>
    </>
  );
}
