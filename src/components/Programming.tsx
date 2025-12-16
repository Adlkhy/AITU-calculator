import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardTitle } from './ui/card';
import { Input } from './ui/input';

interface GradeInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

// A reusable component for our input fields to keep the code clean
const GradeInput = ({ label, value, onChange } : GradeInputProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
    <label className="text-foreground mb-1 sm:mb-0">{label}</label>
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0-100"
      className="w-full sm:w-32 bg-input text-accent-foreground p-2 border border-foreground/20 rounded-md"
    />
  </div>
);

// --- MAIN APP COMPONENT ---
function Programming() {
  // --- STATE FOR ALL GRADE INPUTS ---
  const [assignment1, setAssignment1] = useState('');
  const [assignment2, setAssignment2] = useState('');
  const [assignment3, setAssignment3] = useState('');
  const [midtermQuiz, setMidtermQuiz] = useState('');
  const [midtermPractical, setMidtermPractical] = useState('');

  const [assignment4, setAssignment4] = useState('');
  const [assignment5, setAssignment5] = useState('');
  const [assignment6, setAssignment6] = useState('');
  const [endtermQuiz, setEndtermQuiz] = useState('');
  const [endtermPractical, setEndtermPractical] = useState('');

  const [finalExam, setFinalExam] = useState('');

  // --- STATE FOR CALCULATED RESULTS ---
  const [attestation1, setAttestation1] = useState(0);
  const [attestation2, setAttestation2] = useState(0);
  const [finalGrade, setFinalGrade] = useState(0);

  // --- CALCULATION LOGIC ---
  useEffect(() => {
    // Helper function to parse input strings to numbers, defaulting to 0
    const p = (val: string) => parseFloat(val) || 0;

    // --- RegMid Calculation ---
    const avgAssignments1 = (p(assignment1) + p(assignment2) + p(assignment3)) / 3;
    const midtermScore = (((p(midtermQuiz) / 100) * 15) + ((p(midtermPractical) / 100) * 25)) / 40 * 100;
    const calculatedAtt1 = (avgAssignments1 * 0.6) + (midtermScore * 0.4);
    setAttestation1(calculatedAtt1);

    // --- RegEnd Calculation ---
    const avgAssignments2 = (p(assignment4) + p(assignment5) + p(assignment6)) / 3;
    const endtermScore = (((p(endtermQuiz) / 100) * 15) + ((p(endtermPractical) / 100) * 25)) / 40 * 100;
    const calculatedAtt2 = (avgAssignments2 * 0.6) + (endtermScore * 0.4);
    setAttestation2(calculatedAtt2);

    // --- Final Grade Calculation ---
    const calculatedFinal = (calculatedAtt1 * 0.3) + (calculatedAtt2 * 0.3) + (p(finalExam) * 0.4);
    setFinalGrade(calculatedFinal);

  }, [
    assignment1, assignment2, assignment3, midtermQuiz, midtermPractical,
    assignment4, assignment5, assignment6, endtermQuiz, endtermPractical,
    finalExam
  ]);

  // --- JSX TO RENDER ---
  return (
    <div className="text-foreground font-sans px-4 pt-4 sm:px-8 sm:pt-8">
      <div className="max-w-4xl mx-auto">

        {/* --- RESULTS DISPLAY --- */}
        <Card className="p-6 mb-8">
          <CardContent className='px-0'>
            <CardTitle className="text-lg text-foreground text-center">
              Your Calculated Final Grade < br/> (Orazova Arailym)
            </CardTitle>
            <CardDescription className="text-4xl font-bold text-center text-primary mt-2">
              {finalGrade.toFixed(2)}%
            </CardDescription>
            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
              <div>
                  <p className="text-foreground">RegMid Score</p>
                  <p className="text-xl font-semibold text-accent-foreground">{attestation1.toFixed(2)} / 100</p>
              </div>
              <div>
                  <p className="text-foreground">RegEnd Score</p>
                  <p className="text-xl font-semibold text-accent-foreground">{attestation2.toFixed(2)} / 100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- GRADE INPUTS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* RegMid Column */}
            <Card className="p-5">
              <CardContent className='px-0'>
                <CardTitle className="text-2xl mb-4 text-center">RegMid (30%)</CardTitle>
                <CardDescription className="font-semibold text-lg mb-2 text-foreground">Assignments (60%)</CardDescription>
                <GradeInput label="Assignment 1" value={assignment1} onChange={setAssignment1} />
                <GradeInput label="Assignment 2" value={assignment2} onChange={setAssignment2} />
                <GradeInput label="Assignment 3" value={assignment3} onChange={setAssignment3} />
                <hr className="border-foreground my-4" />
                <CardDescription className="font-semibold text-lg mb-2 text-foreground">Midterm (40%)</CardDescription>
                <GradeInput label="Quiz (15pts)" value={midtermQuiz} onChange={setMidtermQuiz} />
                <GradeInput label="Practical Exam (25pts)" value={midtermPractical} onChange={setMidtermPractical} />
              </CardContent>
            </Card>

            {/* RegEnd & Final Column */}
            <div>
                <Card className="p-5 mb-8">
                  <CardContent className='px-0'>
                    <CardTitle className="text-2xl mb-4 text-center">RegEnd (30%)</CardTitle>
                    <CardDescription className="font-semibold text-lg mb-2 text-foreground">Assignments (60%)</CardDescription>
                    <GradeInput label="Assignment 4" value={assignment4} onChange={setAssignment4} />
                    <GradeInput label="Assignment 5" value={assignment5} onChange={setAssignment5} />
                    <GradeInput label="Assignment 6" value={assignment6} onChange={setAssignment6} />
                    <hr className="border-foreground my-4" />
                    <CardDescription className="font-semibold text-lg mb-2 text-foreground">Endterm (40%)</CardDescription>
                    <GradeInput label="Quiz (15pts)" value={endtermQuiz} onChange={setEndtermQuiz} />
                    <GradeInput label="Practical Exam (25pts)" value={endtermPractical} onChange={setEndtermPractical} />
                  </CardContent>
                </Card>
                <Card className="p-5">
                  <CardContent className='px-0'>
                    <CardTitle className="text-2xl mb-4 text-center">Final Exam (40%)</CardTitle>
                    <GradeInput label="MCQ Exam" value={finalExam} onChange={setFinalExam} />
                  </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Programming;