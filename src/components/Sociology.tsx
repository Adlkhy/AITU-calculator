import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from './ui/card';
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
  const [quiz, setQuiz] = useState('');
  const [sis, setSis] = useState('');
  const [midtermQuiz, setMidtermQuiz] = useState('');

  const [assignment3, setAssignment3] = useState('');
  const [assignment4, setAssignment4] = useState('');
  const [quiz2, setQuiz2] = useState('');
  const [sis2, setSis2] = useState('');
  const [endtermQuiz, setEndtermQuiz] = useState('');

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
    const avgAssignments1 = (((p(assignment1) + p(assignment2)) / 100) * 20) + (((p(quiz) + p(sis)) / 100) * 10);
    const midtermScore = (p(midtermQuiz) / 100) * 40;
    const calculatedAtt1 = (avgAssignments1) + (midtermScore);
    setAttestation1(calculatedAtt1);

    // --- RegEnd Calculation ---
    const avgAssignments2 = (((p(assignment3) + p(assignment4)) / 100) * 20) + (((p(quiz2) + p(sis2)) / 100) * 10);
    const endtermScore = (p(endtermQuiz) / 100) * 40;
    const calculatedAtt2 = (avgAssignments2) + (endtermScore);
    setAttestation2(calculatedAtt2);

    // --- Final Grade Calculation ---
    const calculatedFinal = (calculatedAtt1 * 0.3) + (calculatedAtt2 * 0.3) + (p(finalExam) * 0.4);
    setFinalGrade(calculatedFinal);

  }, [
    assignment1, assignment2, quiz, sis, midtermQuiz,
    assignment3, assignment4, quiz2, sis2, endtermQuiz,
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
            Your Calculated Final Grade < br/> (Zhanadilova Aigul)
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
                <GradeInput label="Quiz" value={quiz} onChange={setQuiz} />
                <GradeInput label="SIS" value={sis} onChange={setSis} />
                <hr className="border-foreground my-4" />
                <CardDescription className="font-semibold text-lg mb-2 text-foreground">Midterm (40%)</CardDescription>
                <GradeInput label="Quiz" value={midtermQuiz} onChange={setMidtermQuiz} />
              </CardContent>
            </Card>

            {/* RegEnd & Final Column */}
            <div>
                <Card className="p-5 mb-8">
                  <CardContent className='px-0'>
                    <CardTitle className="text-2xl mb-4 text-center">RegEnd (30%)</CardTitle>
                    <CardDescription className="font-semibold text-lg mb-2 text-foreground">Assignments (60%)</CardDescription>
                    <GradeInput label="Assignment 3" value={assignment3} onChange={setAssignment3} />
                    <GradeInput label="Assignment 4" value={assignment4} onChange={setAssignment4} />
                    <GradeInput label="Quiz" value={quiz2} onChange={setQuiz2} />
                    <GradeInput label="SIS" value={sis2} onChange={setSis2} />
                    <hr className="border-foreground my-4" />
                    <CardDescription className="font-semibold text-lg mb-2 text-foreground">Endterm (40%)</CardDescription>
                    <GradeInput label="Quiz" value={endtermQuiz} onChange={setEndtermQuiz} />
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