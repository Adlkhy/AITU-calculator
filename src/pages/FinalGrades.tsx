import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DotLoader } from '@/components/shadcn/gsap/dot-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar08 } from '@/components/Navbar2';
import { toast, Toaster } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash, Loader2, Search, Edit2, Save, X, Info, GraduationCap, Calculator } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  "Calculus 2",
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewTab, setViewTab] = useState('all');

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
      toast.error('Please enter a valid grade between 0 and 100');
      return;
    }

    setIsSaving(true);
    try {
      await saveGrade(subject, gradeValue);
    } catch (error) {
      console.error('Error saving grade:', error);
      toast.error('Error saving grade');
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
  
  setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('final_grades')
        .delete()
        .eq('user_id', user.id)
        .eq('subject', subject);

      if (error) throw error;
      
      // Update local state
      setSavedGrades(prev => {
        const newGrades = { ...prev };
        delete newGrades[subject];
        return newGrades;
      });
      toast.success(`${subject} grade deleted`);
    } catch (error) {
      console.error('Error deleting grade:', error);
      toast.error('Error deleting grade');
    } finally {
      setIsDeleting(false);
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

  const filteredSubjects = useMemo(() => {
    return AVAILABLE_SUBJECTS.filter(subject => {
      const matchesSearch = subject.toLowerCase().includes(searchQuery.toLowerCase());
      const isSaved = savedGrades[subject] !== undefined;
      
      if (viewTab === 'saved') return matchesSearch && isSaved;
      return matchesSearch;
    });
  }, [searchQuery, viewTab, savedGrades]);

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
  const averageGPA = calculateGPA();

  return (
    <>
      <Navbar08 />
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-background text-foreground pb-12">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header & Stats Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                Final Grades
              </h1>
              <p className="text-muted-foreground max-w-md">
                Manage your final marks and track your performance for the Fall 2025 semester.
              </p>
            </div>

            <div className="flex gap-4">
              <Card className="p-0 bg-primary/5 border-primary/10 min-w-[140px]">
                <CardContent className="p-4 pt-4 text-center">
                  <div className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1.5 mb-1">
                    <Calculator className="h-4 w-4" /> Average
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {averageGrade ? `${averageGrade}%` : '—'}
                  </div>
                </CardContent>
              </Card>
              <Card className="p-0 bg-primary/5 border-primary/10 min-w-[140px]">
                <CardContent className="p-4 pt-4 text-center">
                  <div className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1.5 mb-1">
                    <GraduationCap className="h-4 w-4" /> GPA
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {averageGPA ? averageGPA : '—'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Disclaimer / Trust Note */}
          <Card className="mb-8 p-0 py-2 border-none bg-accent/30 shadow-none">
            <CardContent className="p-4 flex gap-4 items-start">
              <div className="bg-primary/10 p-2 rounded-full mt-1 shrink-0">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm">Integrity & Trust</p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-balance">
                  This leaderboard is built on trust. An honest 75 is worth infinitely more than a dishonest 95. 
                  Wear your true performance with pride. <span className="font-medium text-foreground italic">You Earned It.</span>
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between bg-muted/30 p-4 rounded-xl border border-muted/50">
            <Tabs value={viewTab} onValueChange={setViewTab} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-2 sm:w-[240px] h-9">
                <TabsTrigger value="all" className="text-xs">All Subjects</TabsTrigger>
                <TabsTrigger value="saved" className="text-xs">My Grades</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                className="pl-9 bg-background h-9 text-sm border-muted-foreground/20 focus:border-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredSubjects.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-muted rounded-2xl">
              <Calculator className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">
                {searchQuery ? 'No subjects matching your search.' : 'No grades saved yet.'}
              </p>
              {viewTab === 'saved' && (
                <Button variant="link" size="sm" onClick={() => setViewTab('all')} className="mt-2">
                  Browse all subjects
                </Button>
              )}
            </div>
          )}

          {/* Grades Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSubjects.map((subject) => {
              const savedGrade = savedGrades[subject];
              const editingGrade = editingGrades[subject];
              const isEditing = editingGrade !== undefined;

              return (
                <Card key={subject} className="hover:shadow-md p-2 transition-all border-muted/20">
                  <CardHeader className="px-4 pt-4">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="truncate pr-2">{subject}</span>
                      {savedGrade && !isEditing && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] h-5">
                          Saved
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    {!isEditing && savedGrade ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-primary">{savedGrade}</span>
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditGrade(subject)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                disabled={isDeleting}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Grade</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete your {subject} grade?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className='bg-destructive' onClick={() => handleDeleteGrade(subject)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={editingGrade || ''}
                          onChange={(e) => handleGradeChange(subject, e.target.value)}
                          placeholder="Grade"
                          className="h-9 flex-1"
                        />
                        <Button 
                          size="sm"
                          onClick={() => handleSaveGrade(subject)}
                          disabled={isSaving || !editingGrade}
                        >
                          {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-4 w-4" />}
                        </Button>
                        {savedGrade && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-9 px-2"
                            onClick={() => setEditingGrades(prev => {
                              const newState = { ...prev };
                              delete newState[subject];
                              return newState;
                            })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      </div>
  </>
);
}

