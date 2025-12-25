// import React, { useState, useEffect } from 'react';
// import type { GradeItem } from '../hooks/types';
// import { X } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';


import React, { useState, useEffect } from 'react';
import type { SyllabusData } from '../hooks/types';
import { Card, CardTitle, CardContent, CardDescription, CardHeader} from './ui/card';
import { Input } from './ui/input';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface GradeCalculatorProps {
  data: SyllabusData;
}

export const GradeCalculator: React.FC<GradeCalculatorProps> = ({ data }) => {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [finalGrade, setFinalGrade] = useState<number>(0);

  useEffect(() => {
    let totalWeightedScore = 0;
    
    data.breakdown.forEach((category, catIdx) => {
      let categoryScore = 0;
      
      if (category.subItems && category.subItems.length > 0) {
        // If there are sub-items, we calculate the average or weighted average within the category
        // Many syllabi use "points" within a category. We'll assume the sub-item weights are their contribution to the category's max.
        const totalSubWeight = category.subItems.reduce((acc, sub) => acc + sub.weight, 0);
        let earnedSubWeight = 0;
        
        category.subItems.forEach((_, subIdx) => {
          const score = scores[`${catIdx}-${subIdx}`] || 0;
          const weight = category.subItems![subIdx].weight;
          // score is percentage (0-100)
          earnedSubWeight += (score / 100) * weight;
        });

        categoryScore = (earnedSubWeight / totalSubWeight) * 100;
      } else {
        // Direct category input if no sub-items
        categoryScore = scores[`${catIdx}-main`] || 0;
      }

      totalWeightedScore += (categoryScore / 100) * category.overallWeight;
    });

    setFinalGrade(totalWeightedScore);
  }, [scores, data]);

  const handleScoreChange = (key: string, value: string) => {
    const numValue = Math.min(100, Math.max(0, parseFloat(value) || 0));
    setScores(prev => ({ ...prev, [key]: numValue }));
  };

  const chartData = data.breakdown.map(cat => ({
    name: cat.name,
    value: cat.overallWeight
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Inputs Column */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center">
          Calculate Your Grade
        </h2>
        
        {data.courseName && (
          <Card className="border-2 border-accent">
            <CardContent>
            <CardTitle className="text-sm text-accent-foreground font-semibold uppercase tracking-wider">Course</CardTitle>
            <CardDescription className="text-lg font-bold text-primary">{data.courseName}</CardDescription>
            </CardContent>
          </Card>
        )}

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
        <div className="sticky pt-14 top-8 space-y-6">
          <Card className="shadow-md hover:shadow-lg text-center overflow-hidden relative">
            <CardHeader className="">
              <CardTitle className="text-lg font-bold">Your Estimated Final Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-black text-gray-900 mb-2">
                {finalGrade.toFixed(1)}%
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden mb-6">
                <div 
                  className="h-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, finalGrade)}%` }}
                ></div>
              </div>

              <p className="text-sm text-foreground italic">
                {data.totalWeightNote || "Calculated based on extracted syllabus weights."}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg">
            <CardContent>
            <CardTitle className="font-bold text-foreground mb-4">Weight Distribution</CardTitle>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {data.breakdown.map((cat, idx) => (
                <div key={idx} className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="flex-1 text-foreground">{cat.name}</span>
                  <span className="font-bold text-foreground">{cat.overallWeight}%</span>
                </div>
              ))}
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
