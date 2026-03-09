import React, { useState, useEffect, useMemo } from 'react';
import type { SyllabusData } from '../hooks/types';
import { Card, CardTitle, CardContent, CardDescription, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast, Toaster } from 'sonner';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip
} from 'recharts';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '../hooks/useUser';
import { Loader2, Save, Trash, Pencil } from 'lucide-react';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ChartContainer, type ChartConfig } from './ui/chart';

interface GradeCalculatorProps {
  data: SyllabusData;
  initialScores?: Record<string, number>;
  initialId?: string | null; // Optional: if editing an existing record
}

const chartConfig = {
  att1: { label: "1st Attestation", color: "var(--chart-1)" },
  att2: { label: "2nd Attestation", color: "var(--chart-2)" },
  final: { label: "Final Exam", color: "var(--chart-3)" },
} satisfies ChartConfig;

export const GradeCalculator: React.FC<GradeCalculatorProps> = ({ 
  data, 
  initialScores,
  initialId = null 
}) => {
  const { user } = useUser();
  
  // State
  const [scores, setScores] = useState<Record<string, number>>(initialScores || {});
  const [courseName, setCourseName] = useState<string>(data.courseName || 'Unnamed Course');
  
  // Persistence State
  const [savedId, setSavedId] = useState<string | null>(initialId);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- CALCULATIONS ---
  
  // 1. Performance Data (Earned vs Potential)
  const performanceData = useMemo(() => {
    return data.breakdown.map((category, catIdx) => {
      let rawPercentage = 0;
      
      if (category.subItems && category.subItems.length > 0) {
        const totalSubWeight = category.subItems.reduce((acc, sub) => acc + sub.weight, 0);
        let earnedSubWeight = 0;
        category.subItems.forEach((_, subIdx) => {
          const score = scores[`${catIdx}-${subIdx}`] || 0;
          const weight = category.subItems![subIdx].weight;
          earnedSubWeight += (score / 100) * weight;
        });
        rawPercentage = totalSubWeight > 0 ? (earnedSubWeight / totalSubWeight) * 100 : 0;
      } else {
        rawPercentage = scores[`${catIdx}-main`] || 0;
      }

      const earnedPoints = (rawPercentage / 100) * category.overallWeight;
      const missingPoints = category.overallWeight - earnedPoints;

      return {
        name: category.name,
        earned: parseFloat(earnedPoints.toFixed(2)),
        missing: parseFloat(missingPoints.toFixed(2)),
        total: category.overallWeight,
        percentage: parseFloat(rawPercentage.toFixed(2))
      };
    });
  }, [data.breakdown, scores]);

  // 2. Final Grade
  const finalGrade = useMemo(() => {
    return performanceData.reduce((acc, curr) => acc + curr.earned, 0);
  }, [performanceData]);

  // Calculate required final exam grade to achieve 70% and 90% final grade
  const calculateNeededFinalGrade = (targetGrade: number): number | null => {
    // Find the final exam category
    const finalCategory = data.breakdown.find(cat => 
      cat.name.toLowerCase().includes('final')
    );
    
    if (!finalCategory) return null;
    
    // Calculate earned points excluding final exam
    const earnedExcludingFinal = performanceData
      .filter(item => !item.name.toLowerCase().includes('final'))
      .reduce((acc, curr) => acc + curr.earned, 0);
    
    // Formula: earnedExcludingFinal + (neededFinalScore / 100 * finalExamWeight) = targetGrade
    // neededFinalScore = (targetGrade - earnedExcludingFinal) / finalExamWeight * 100
    const neededFinalScore = (targetGrade - earnedExcludingFinal) / finalCategory.overallWeight * 100;

    // Clamp only the lower bound; >100 means mathematically impossible but still informative.
    if (neededFinalScore < 0) return 0;

    return Math.round(neededFinalScore * 100) / 100;
  };

  const neededFor70 = useMemo(() => calculateNeededFinalGrade(70), [performanceData, data.breakdown]);
  const neededFor90 = useMemo(() => calculateNeededFinalGrade(90), [performanceData, data.breakdown]);

  const panicLevelData = useMemo(() => {
    if (neededFor70 === null) {
      return {
        level: 'Unknown',
        emoji: '🤔',
        message: 'Final exam category was not found in this syllabus.',
        badgeClassName: 'bg-muted text-muted-foreground border-border',
      };
    }

    if (neededFor70 <= 50) {
      return {
        level: 'Chill',
        emoji: '😎',
        message: 'You could almost sleep through the exam.',
        badgeClassName: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      };
    }

    if (neededFor70 <= 60) {
      return {
        level: 'Focus',
        emoji: '📚',
        message: "Study a bit and you'll be fine.",
        badgeClassName: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
      };
    }

    if (neededFor70 <= 75) {
      return {
        level: 'Serious',
        emoji: '😬',
        message: 'Time to actually study.',
        badgeClassName: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      };
    }

    if (neededFor70 <= 90) {
      return {
        level: 'High Panic',
        emoji: '😰',
        message: 'Cancel your weekend plans.',
        badgeClassName: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
      };
    }

    return {
      level: 'Extreme Panic',
      emoji: '💀',
      message: 'You either become a genius tonight or pray.',
      badgeClassName: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    };
  }, [neededFor70]);

  // 3. Category Percentages for Attestations
  const att1 = useMemo(() => {
    const item = performanceData.find(d => 
      d.name.toLowerCase().includes('1st') || 
      d.name.toLowerCase().includes('first') || 
      d.name.toLowerCase().includes('attestation 1')
    );
    return item ? item.percentage : null;
  }, [performanceData]);

  const att2 = useMemo(() => {
    const item = performanceData.find(d => 
      d.name.toLowerCase().includes('2nd') || 
      d.name.toLowerCase().includes('second') || 
      d.name.toLowerCase().includes('attestation 2')
    );
    return item ? item.percentage : null;
  }, [performanceData]);

  const finalScore = useMemo(() => {
    const item = performanceData.find(d => 
      d.name.toLowerCase().includes('final')
    );
    return item ? item.percentage : null;
  }, [performanceData]);

  // 4. Attestation Pie Data
  const attestationPieData = useMemo(() => {
    const data = [];
    if (att1 !== null) data.push({ name: '1st Attestation', value: att1, color: 'var(--chart-1)' });
    if (att2 !== null) data.push({ name: '2nd Attestation', value: att2, color: 'var(--chart-2)' });
    if (finalScore !== null) data.push({ name: 'Final Exam', value: finalScore, color: 'var(--chart-3)' });
    return data;
  }, [att1, att2, finalScore]);

  // --- PERSISTENCE ---

  useEffect(() => {
    const fetchSavedCalculator = async () => {
      if (!user || !data.courseName || initialId) return;

      try {
        const { data: savedData, error } = await supabase
          .from('calculators')
          .select('id, scores_data, course_name')
          .eq('user_id', user.id)
          .eq('course_name', data.courseName)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching saved status:', error);
          return;
        }

        if (savedData) {
          setSavedId(savedData.id);
          setScores(savedData.scores_data);
          setCourseName(savedData.course_name);
        }
      } catch (err) {
        console.error("Unexpected error loading saved data:", err);
      }
    };

    fetchSavedCalculator();
  }, [user, data.courseName, initialId, data]);

  const handleScoreChange = (key: string, value: string) => {
    const numValue = Math.min(100, Math.max(0, parseFloat(value) || 0));
    setScores(prev => ({ ...prev, [key]: numValue }));
  };

  // --- SAVE FUNCTION ---
  const handleSaveCalculator = async () => {
    if (!user) {
      toast.error("Please log in to save your calculator!");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        user_id: user.id,
        course_name: courseName,
        syllabus_data: { ...data, courseName }, // Update internal data with new name
        scores_data: scores,
        final_grade: finalGrade
      };

      let result;
      
      if (savedId) {
        // Update existing
        result = await supabase
          .from('calculators')
          .update(payload)
          .eq('id', savedId)
          .select()
          .single();
      } else {
        // Insert new
        result = await supabase
          .from('calculators')
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) throw result.error;
      
      // Update state to saved status
      if (result.data) {
        setSavedId(result.data.id);
      }
      
      toast.success("Calculator saved to your profile!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error saving:", errorMessage);
      toast.error("Failed to save calculator.");
    } finally {
      setIsSaving(false);
    }
  };

  
  // --- DELETE FUNCTION ---
  const handleDeleteCalculator = async () => {
    if (!savedId) return; // Should not happen given UI logic
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('calculators')
        .delete()
        .eq('id', savedId); // Delete specific ID
      
      if (error) throw error;
      
      setSavedId(null); // Switch back to "Save" mode
      toast.success("Calculator deleted successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error deleting:", errorMessage);
      toast.error("Failed to delete calculator.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
    <Toaster position="top-center"/>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Inputs Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-foreground">Calculate Your Grade</h2>
          
          <div className="flex gap-2 w-full sm:w-auto">
            {/* CONDITIONAL BUTTON RENDERING */}
            {!savedId ? (
              <Button 
                onClick={handleSaveCalculator} 
                disabled={isSaving}
                variant={'default'}
                className="flex gap-2 w-full sm:w-auto"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? "Saving..." : "Save to Profile"}
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    disabled={isDeleting}
                    className="flex gap-2 w-full text-destructive hover:text-destructive-foreground border border-destructive! hover:bg-destructive! sm:w-auto"
                    variant={'ghost'}
                  >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                    {isDeleting ? "Deleting..." : "Delete Saved"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Saved Calculator</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this saved calculator? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteCalculator}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        
        {/* EDITABLE COURSE NAME CARD */}
        <Card className="">
          <CardContent className="">
            <CardTitle className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2">
              Course Name
            </CardTitle>
            <div className="relative flex items-center">
               <Input 
                 value={courseName}
                 name='Course Name'
                 onChange={(e) => setCourseName(e.target.value)}
                 className="sm:text-lg font-bold text-muted-foreground pr-10 border-transparent hover:border-input focus:border-input transition-colors"
               />
               <Pencil className="h-4 w-4 absolute right-3 text-muted-foreground pointer-events-none" />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        {data.breakdown.map((category, catIdx) => (
          <Card key={catIdx} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">{category.name}</CardTitle>
              <CardDescription className="text-sm text-foreground/80">Weight: {category.overallWeight}% of final grade</CardDescription>
            </CardHeader>
            {!category.subItems?.length && (
              <CardContent className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Score"
                  name="Assignment Score"
                  className="w-24 p-2 text-center font-bold"
                  value={scores[`${catIdx}-main`] || ''}
                  onChange={(e) => handleScoreChange(`${catIdx}-main`, e.target.value)}
                />
                <span className="text-foreground/80 font-medium">%</span>
              </CardContent>
            )}
            
            {category.subItems && category.subItems.length > 0 && (
              <CardContent className="space-y-2 border-t pt-4">
                {category.subItems.map((sub, subIdx) => (
                  <div key={subIdx} className="flex items-center justify-between group">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-medium text-foreground">{sub.name}</p>
                      {sub.description && <p className="text-xs text-foreground">{sub.description}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">({sub.weight} pts)</span>
                      <Input
                        type="number"
                        placeholder="0-100"
                        name="Assignment Weight"
                        className="w-20 p-1.5 text-center text-sm"
                        value={scores[`${catIdx}-${subIdx}`] || ''}
                        onChange={(e) => handleScoreChange(`${catIdx}-${subIdx}`, e.target.value)}
                      />
                      <span className="text-foreground">%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Summary Column */}
      <div className="lg:col-span-1">
        <div className="sticky pt-4 sm:pt-14 top-8 space-y-6">
          
          {/* Main Grade Card */}
          <Card className="shadow-md hover:shadow-lg text-center overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Your Estimated Final Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black text-foreground mb-2">
                {finalGrade.toFixed(1)}%
              </div>
              {/* Progress Bar */}
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden mb-6">
                <div 
                  className={`h-full transition-all duration-500 ${finalGrade >= 90 ? 'bg-green-500' : finalGrade >= 70 ? 'bg-blue-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, finalGrade)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* New Attestation Scores Display */}
          <Card className="shadow-md hover:shadow-lg">
            <CardContent className="px-2">
              <div className="flex justify-between items-center text-center">
                <div className="flex-1">
                  <p className="text-[12px] font-bold uppercase text-muted-foreground mb-1">1st Att.</p>
                  <p className="text-lg font-black text-primary">{att1 !== null ? `${att1}%` : '—'}</p>
                </div>
                <Separator orientation="vertical" className="h-10 mx-2" />
                <div className="flex-1">
                  <p className="text-[12px] font-bold uppercase text-muted-foreground mb-1">2nd Att.</p>
                  <p className="text-lg font-black text-primary">{att2 !== null ? `${att2}%` : '—'}</p>
                </div>
                <Separator orientation="vertical" className="h-10 mx-2" />
                <div className="flex-1">
                  <p className="text-[12px] font-bold uppercase text-muted-foreground mb-1">Final</p>
                  <p className="text-lg font-black text-primary">{finalScore !== null ? `${finalScore}%` : '—'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Needed final grade for 70% and 90% */}
          <Card className="shadow-md hover:shadow-lg">
            <CardContent className="px-2">
              <div className="flex justify-between items-center text-center">
                <div className="flex-1">
                  <p className="text-[12px] font-bold uppercase text-muted-foreground mb-1">Needed for 70%</p>
                  <p className="text-lg font-black text-primary">
                    {neededFor70 !== null ? `${neededFor70}%` : 'N/A'}
                  </p>
                </div>
                <Separator orientation="vertical" className="h-10 mx-2" />
                <div className="flex-1">
                  <p className="text-[12px] font-bold uppercase text-muted-foreground mb-1">Needed for 90%</p>
                  <p className="text-lg font-black text-primary">
                    {neededFor90 !== null ? `${neededFor90}%` : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Panic level */}
          <Card className="shadow-md gap-3 hover:shadow-lg">
            <CardHeader className="flex items-center justify-between gap-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wide">Panic Level</CardTitle>
              <Badge className={`text-xs font-bold px-3 py-1 border ${panicLevelData.badgeClassName}`}>
                {panicLevelData.level} {panicLevelData.emoji}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">{panicLevelData.message}</p>
            </CardContent>
          </Card>

          {/* Score Distribution Pie Chart - Redesigned to match Budget style */}
          <Card className="shadow-sm border-muted-foreground/20">
             <CardContent className="">
             <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Score Distribution</CardTitle>
             <div className="h-40">
               <ChartContainer config={chartConfig}>
                 <PieChart>
                   <Pie
                     data={attestationPieData}
                     cx="50%"
                     cy="50%"
                     innerRadius={35}
                     outerRadius={50}
                     paddingAngle={5}
                     dataKey="value"
                   >
                      {attestationPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                   </Pie>
                   <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border border-muted-foreground/20 p-2 rounded-lg shadow-xl text-[10px] font-bold uppercase tracking-widest">
                              <p style={{ color: payload[0].payload.color }}>{payload[0].name}: {payload[0].value}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                 </PieChart>
               </ChartContainer>
             </div>
             <div className="mt-4 space-y-2">
               {attestationPieData.length > 0 ? (
                 attestationPieData.map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between text-xs">
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="font-medium text-muted-foreground">{item.name}</span>
                     </div>
                     <span className="font-bold">{item.value}%</span>
                   </div>
                 ))
               ) : (
                 <p className="text-center text-xs text-muted-foreground mt-4 uppercase tracking-widest font-bold opacity-50">Enter scores to see distribution</p>
               )}
             </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
};