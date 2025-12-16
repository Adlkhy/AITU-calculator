import { useState, useEffect } from 'react';
import { Card, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
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
  const [quiz, setQuiz] = useState('');
  const [classwork, setClasswork] = useState('');
  const [homework, setHomework] = useState('');
  const [lectureQuiz11, setLectureQuiz11] = useState('');
  const [lectureQuiz12, setLectureQuiz12] = useState('');
  const [lectureQuiz13, setLectureQuiz13] = useState('');
  const [lectureQuiz14, setLectureQuiz14] = useState('');
  const [midtermQuiz, setMidtermQuiz] = useState('');

  const [quiz2, setQuiz2] = useState('');
  const [classwork2, setClasswork2] = useState('');
  const [homework2, setHomework2] = useState('');
  const [lectureQuiz21, setLectureQuiz21] = useState('');
  const [lectureQuiz22, setLectureQuiz22] = useState('');
  const [lectureQuiz23, setLectureQuiz23] = useState('');
  const [lectureQuiz24, setLectureQuiz24] = useState('');
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
    const avgLectureQuiz = ((p(lectureQuiz11) + p(lectureQuiz12) + p(lectureQuiz13) + p(lectureQuiz14)) / 4);
    const avgAssignments1 = (((p(quiz) + (avgLectureQuiz)) / 100) * 20 + (((p(classwork) + p(homework)) / 100) * 10));
    const midtermScore = (p(midtermQuiz) / 100) * 40;
    const calculatedAtt1 = (avgAssignments1) + (midtermScore);
    setAttestation1(calculatedAtt1);

    // --- RegEnd Calculation ---
    const avgLectureQuiz2 = ((p(lectureQuiz21) + p(lectureQuiz22) + p(lectureQuiz23) + p(lectureQuiz24)) / 4);
    const avgAssignments2 = (((p(quiz2) + (avgLectureQuiz2)) / 100) * 20 + (((p(classwork2) + p(homework2)) / 100) * 10));
    const endtermScore = (p(endtermQuiz) / 100) * 40;
    const calculatedAtt2 = (avgAssignments2) + (endtermScore);
    setAttestation2(calculatedAtt2);

    // --- Final Grade Calculation ---
    const calculatedFinal = (calculatedAtt1 * 0.3) + (calculatedAtt2 * 0.3) + (p(finalExam) * 0.4);
    setFinalGrade(calculatedFinal);

  }, [
    quiz, classwork, homework, midtermQuiz, lectureQuiz11, lectureQuiz12, lectureQuiz13, lectureQuiz14,
    quiz2, classwork2, homework2, lectureQuiz21, lectureQuiz22, lectureQuiz23, lectureQuiz24, endtermQuiz,
    finalExam
  ]);

  // --- JSX TO RENDER ---
  return (
    <div className="bg-background text-foreground font-sans px-4 pt-4 sm:px-8 sm:pt-8">
      <div className="max-w-4xl mx-auto">

        {/* --- RESULTS DISPLAY --- */}
        <Card className="p-6 mb-8">
          <CardContent className="px-0">
          <CardTitle className="text-lg text-center">
            Your Calculated Final Grade < br/> (Duman Adilet)
          </CardTitle>
          <CardDescription className="text-4xl font-bold text-center text-primary">
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
              <CardContent className="px-0">
                <CardTitle className="text-2xl mb-4 text-center">RegMid (30%)</CardTitle>
                <CardDescription className="font-semibold text-lg mb-2 text-foreground">Assignments (60%)</CardDescription>
                <GradeInput label="Quiz" value={quiz} onChange={setQuiz} />
                <GradeInput label="Homework" value={homework} onChange={setHomework} />
                <GradeInput label="Classwork" value={classwork} onChange={setClasswork} />
                <GradeInput label="Lecture quiz (1)" value={lectureQuiz11} onChange={setLectureQuiz11} />
                <GradeInput label="Lecture quiz (2)" value={lectureQuiz12} onChange={setLectureQuiz12} />
                <GradeInput label="Lecture quiz (3)" value={lectureQuiz13} onChange={setLectureQuiz13} />
                <GradeInput label="Lecture quiz (4)" value={lectureQuiz14} onChange={setLectureQuiz14} />
                <hr className="border-foreground my-4" />
                <CardDescription className="font-semibold text-lg mb-2 text-foreground">Midterm (40%)</CardDescription>
                <GradeInput label="Exam" value={midtermQuiz} onChange={setMidtermQuiz} />
              </CardContent>
            </Card>

            {/* RegEnd & Final Column */}
            <div>
                <Card className="p-5 mb-8">
                  <CardContent className="px-0">
                    <CardTitle className="text-2xl mb-4 text-center">RegEnd (30%)</CardTitle>
                    <CardDescription className="font-semibold text-lg mb-2 text-foreground">Assignments (60%)</CardDescription>
                    <GradeInput label="Quiz" value={quiz2} onChange={setQuiz2} />
                    <GradeInput label="Homework" value={homework2} onChange={setHomework2} />
                    <GradeInput label="Classwork" value={classwork2} onChange={setClasswork2} />
                    <GradeInput label="Lecture quiz (1)" value={lectureQuiz21} onChange={setLectureQuiz21} />
                    <GradeInput label="Lecture quiz (2)" value={lectureQuiz22} onChange={setLectureQuiz22} />
                    <GradeInput label="Lecture quiz (3)" value={lectureQuiz23} onChange={setLectureQuiz23} />
                    <GradeInput label="Lecture quiz (4)" value={lectureQuiz24} onChange={setLectureQuiz24} />
                    <hr className="border-foreground my-4" />
                    <CardDescription className="font-semibold text-lg mb-2 text-foreground">Endterm (40%)</CardDescription>
                    <GradeInput label="Exam" value={endtermQuiz} onChange={setEndtermQuiz} />
                  </CardContent>
                </Card>
                <Card className="p-5">
                  <CardContent className="px-0">
                    <CardTitle className="text-2xl mb-4 text-center">Final Exam (40%)</CardTitle>
                    <GradeInput label="Written Exam" value={finalExam} onChange={setFinalExam} />
                  </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Programming;