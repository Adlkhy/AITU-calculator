import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DotLoader } from '@/components/shadcn/gsap/dot-loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar08 } from '@/components/Navbar2';

// List of available subjects
const AVAILABLE_SUBJECTS = [
  "Programming C++",
  "Programming Python",
  "English", 
  "German",
  "Chinese",
  "Korean",
  "Sociology",
  "Discrete Math",
  "Psychology",
  "ICT",
  "Calculus 1",
  "Physics",
  "Physical Education",
  "History",
  "Intro to Computing and Programming",
  "Linear Algebra",
  "Political Science",
  "Culture Studies",
  "Foundations of Journalism",
  "Business Administration",
  "Mathematics for AI",
];

export default function FinalGrades() {
  const { user } = useUser();
  const [savedGrades, setSavedGrades] = useState<Record<string, number>>({});
  const [editingGrades, setEditingGrades] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved grades when component mounts
  useEffect(() => {
    const loadSavedGrades = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('final_grades')
        .select('subject, final_grade')
        .eq('user_id', user.id)
        .eq('semester', 'Fall 2025');

      if (!error && data) {
        const gradesMap: Record<string, number> = {};
        data.forEach(item => {
          gradesMap[item.subject] = item.final_grade;
        });
        setSavedGrades(gradesMap);
      }
      setIsLoading(false);
    };

    loadSavedGrades();
  }, [user]);

  const handleGradeChange = (subject: string, value: string) => {
    setEditingGrades(prev => ({
      ...prev,
      [subject]: value
    }));
  };

  const saveGrade = async (subject: string, gradeValue: number) => {
    if (!user) throw new Error('User not logged in');

    const { error } = await supabase
      .from('final_grades')
      .upsert({
        user_id: user.id,
        subject,
        final_grade: gradeValue,
        semester: 'Fall 2025'
      }, {
        onConflict: 'user_id,subject,semester'
      });

    if (error) throw error;
    
    // Update local state
    setSavedGrades(prev => ({
      ...prev,
      [subject]: gradeValue
    }));
    
    // Clear editing state
    setEditingGrades(prev => ({
      ...prev,
      [subject]: ''
    }));
  };

  const handleSaveGrade = async (subject: string) => {
    const gradeInput = editingGrades[subject] || '';
    const gradeValue = parseFloat(gradeInput);

    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      alert('Please enter a valid grade between 0 and 100');
      return;
    }

    setIsSaving(true);
    try {
      await saveGrade(subject, gradeValue);
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Error saving grade');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditGrade = (subject: string) => {
    setEditingGrades(prev => ({
      ...prev,
      [subject]: savedGrades[subject]?.toString() || ''
    }));
  };

  const handleDeleteGrade = async (subject: string) => {
  if (!user) return;
  
  if (window.confirm(`Delete your ${subject} grade?`)) {
    try {
      const { error } = await supabase
        .from('final_grades')
        .delete()
        .eq('user_id', user.id)
        .eq('subject', subject)

      if (error) throw error;
      
      // Update local state
      setSavedGrades(prev => {
        const newGrades = { ...prev };
        delete newGrades[subject];
        return newGrades;
      });
    } catch (error) {
      console.error('Error deleting grade:', error);
      alert('Error deleting grade');
    }
  }
};

  const calculateAverage = () => {
    const grades = Object.values(savedGrades);
    if (grades.length === 0) return null;
    
    const sum = grades.reduce((total, grade) => total + grade, 0);
    return (sum / grades.length).toFixed(1);
  };

  const calculateGPA = () => {
    const grades = Object.values(savedGrades);
    if (grades.length === 0) return null;
    const gpaPoints = grades.map(grade => {
      if (grade >= 95) return 4.0;
      if (grade >= 90) return 3.67;
      if (grade >= 85) return 3.33;
      if (grade >= 80) return 3.0;
      if (grade >= 75) return 2.67;
      if (grade >= 70) return 2.33;
      if (grade >= 65) return 2.0;
      if (grade >= 60) return 1.67;
      if (grade >= 55) return 1.33;
      if (grade >= 50) return 1.0;
      return 0.0;
    });
    const sum = gpaPoints.reduce((total: number, point) => total + point, 0);
    return (sum / gpaPoints.length).toFixed(2);
  };

  const game = [
    [14, 7, 0, 8, 6, 13, 20],
    [14, 7, 13, 20, 16, 27, 21],
    [14, 20, 27, 21, 34, 24, 28],
    [27, 21, 34, 28, 41, 32, 35],
    [34, 28, 41, 35, 48, 40, 42],
    [34, 28, 41, 35, 48, 42, 46],
    [34, 28, 41, 35, 48, 42, 38],
    [34, 28, 41, 35, 48, 30, 21],
    [34, 28, 41, 48, 21, 22, 14],
    [34, 28, 41, 21, 14, 16, 27],
    [34, 28, 21, 14, 10, 20, 27],
    [28, 21, 14, 4, 13, 20, 27],
    [28, 21, 14, 12, 6, 13, 20],
    [28, 21, 14, 6, 13, 20, 11],
    [28, 21, 14, 6, 13, 20, 10],
    [14, 6, 13, 20, 9, 7, 21],
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex items-center gap-5 rounded px-4 py-3">
          <DotLoader 
            frames={game}
            className='gap-0.5'
            color="primary"
            duration={150}
            isPlaying={true}
            dotClassName='bg-foreground/15 [&.active]:bg-foreground size-1.5 sm:size-2.5' 
          ></DotLoader>
          <p className="text-base sm:text-2xl font-medium text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const averageGrade = calculateAverage();

  return (
    <>
    <Navbar08 />
    <div className="text-foreground min-h-screen font-sans">
      <div className="text-foreground font-sans px-4 py-4 sm:px-8 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Final Grades
            </h1>
            <p className="text-foreground text-sm sm:text-base md:text-lg">
              Enter your final grades for each subject to participate in the leaderboard
            </p>

            {averageGrade && (
              <div>
              <div className="mt-4 inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-lg shadow">
                <span className="font-semibold text-foreground">
                  Current Average: {averageGrade}%
                </span>
              </div>
              <div className="ml-4 mt-4 inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-lg shadow">
                <span className="font-semibold text-foreground">
                  Average GPA: {calculateGPA()}
                </span>
              </div>
              </div>
            )}
          </div>

          <div className='max-w-4xl mx-auto mb-6'>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center justify-center">
                  <span>Disclaimer</span>
                </CardTitle>
                <CardDescription className="text-md md:text-lg text-foreground text-center">
                  Hello, you wonderful, capable person.
                  This little project is built on a fragile, beautiful thing: <span className='font-semibold'>trust.</span> We believe that you are here to challenge yourself and share in a community of learners. We believe that you value your integrity more than a temporary spot on a digital list.
                  This website doesn't have advanced anti-cheat algorithms. It has something far more powerful: it has <span className='font-semibold'>faith in you.</span>. Faith that you understand the point wasn't just the grade, but the <span className='font-semibold'>journey.</span> That you know honest 75 is worth infinitely more than a dishonest 95.
                  Don't betray that faith. Don't betray yourself. Look inward, type the true number, and wear it with pride. <span className='font-semibold'>You Earned It.</span>
                </CardDescription>
              </CardHeader>
            </Card>

          </div>
          <div className="space-y-4">
          </div>

          {/* Grades Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AVAILABLE_SUBJECTS.map((subject) => {
              const savedGrade = savedGrades[subject];
              const editingGrade = editingGrades[subject];
              const isEditing = editingGrade !== undefined;

              return (
                <Card key={subject} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{subject}</span>
                      {savedGrade && !isEditing && (
                        <Badge variant="default" className="ml-2">
                          Saved
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Enter your final grade for {subject}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isEditing && savedGrade ? (
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-secondary rounded-lg">
                          <p className="text-2xl font-bold text-primary">
                            {savedGrade}%
                          </p>
                          <p className="text-sm text-primary mt-1">
                            Final Grade
                          </p>
                        </div>
                        <div className='flex justify-between'>
                          <Button 
                            variant="outline" 
                            className="w-32"
                            onClick={() => handleEditGrade(subject)}
                          >
                            Edit Grade
                          </Button>
                          <Button 
                            variant="destructive" 
                            className="w-32"
                            onClick={() => handleDeleteGrade(subject)}
                          >
                            Delete Grade
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={editingGrade || ''}
                            onChange={(e) => handleGradeChange(subject, e.target.value)}
                            placeholder="Enter grade (0-100)"
                            className="flex-1"
                          />
                          <Button 
                            onClick={() => handleSaveGrade(subject)}
                            disabled={isSaving || !editingGrade}
                            className="whitespace-nowrap"
                          >
                            {isSaving ? '...' : 'Save'}
                          </Button>
                        </div>
                        {savedGrade && (
                          <Button 
                            variant="ghost" 
                            className="w-full"
                            onClick={() => setEditingGrades(prev => {
                              const newState = { ...prev };
                              delete newState[subject];
                              return newState;
                            })}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {Object.keys(savedGrades).length === 0 && !isLoading && (
            <Card className="mt-8 text-center">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">No Grades Saved Yet</h3>
                <p className="text-foreground mb-4">
                  Start by entering your final grades for each subject above.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </>
  );
}