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
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '../hooks/useUser';
import { Loader2, Save, Trash, Pencil } from 'lucide-react';

interface GradeCalculatorProps {
  data: SyllabusData;
  initialScores?: Record<string, number>;
  initialId?: string | null; // Optional: if editing an existing record
}

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
        total: category.overallWeight
      };
    });
  }, [data.breakdown, scores]);

  // 2. Final Grade
  const finalGrade = useMemo(() => {
    return performanceData.reduce((acc, curr) => acc + curr.earned, 0);
  }, [performanceData]);

  // 3. Pie Chart Data
  const pieData = useMemo(() => {
    return data.breakdown.map((category) => ({
      name: category.name,
      value: category.overallWeight
    }));
  }, [data.breakdown]);

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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <>
    <Toaster position="top-center"/>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    className="flex gap-2 w-full sm:w-auto"
                    variant={'destructive'}
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
        <Card className="border-2 border-accent">
          <CardContent className="pt-6">
            <CardTitle className="text-sm text-accent-foreground font-semibold uppercase tracking-wider mb-2">
              Course Name
            </CardTitle>
            <div className="relative flex items-center">
               <Input 
                 value={courseName}
                 onChange={(e) => setCourseName(e.target.value)}
                 className="text-lg font-bold text-primary pr-10 border-transparent hover:border-input focus:border-input transition-colors"
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

          {/* NEW CHART: Earned vs Potential */}
          <Card className="shadow-md hover:shadow-lg">
             <CardContent className="pt-6">
             <CardTitle className="font-bold text-foreground mb-4 text-sm uppercase">Points Earned Breakdown</CardTitle>
             <div className="h-64 text-xs">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={performanceData} layout="vertical" margin={{ left: 10 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                   <XAxis type="number" domain={[0, 100]} hide />
                   <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10}} />
                   <RechartsTooltip 
                      cursor={{fill: 'transparent'}}
                      formatter={(value: number, name: string) => [`${value}%`, name === 'earned' ? 'Earned' : 'Potential Remaining']}
                   />
                   <Legend />
                   <Bar dataKey="earned" stackId="a" fill="var(--color-primary)" name="Earned" radius={[0, 0, 0, 0]} />
                   <Bar dataKey="missing" stackId="a" fill="var(--color-accent)" name="Possible" radius={[0, 4, 4, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
             </CardContent>
          </Card>

          {/* Weight Distribution Pie Chart */}
          <Card className="shadow-md hover:shadow-lg">
             <CardContent className="pt-6">
             <CardTitle className="font-bold text-foreground mb-4 text-sm uppercase">Course Structure</CardTitle>
             <div className="h-48">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={pieData}
                     cx="50%"
                     cy="50%"
                     innerRadius={40}
                     outerRadius={60}
                     paddingAngle={3}
                     dataKey="value"
                   >
                     {pieData.map((_, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <RechartsTooltip formatter={(value) => `${value}%`} />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-2 space-y-1">
               {pieData.map((cat, idx) => (
                 <div key={idx} className="flex items-center text-xs">
                   <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                   <span className="flex-1 text-foreground">{cat.name}</span>
                   <span className="font-bold text-foreground">{cat.value}%</span>
                 </div>
               ))}
             </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
};