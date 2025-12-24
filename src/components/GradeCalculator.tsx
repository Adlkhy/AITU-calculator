// import React, { useState, useEffect } from 'react';
// import type { GradeItem } from '../hooks/types';
// import { X } from 'lucide-react';
// import { Input } from './ui/input';
// import { Button } from './ui/button';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';


import React, { useState, useEffect } from 'react';
import type { SyllabusData } from '../hooks/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface GradeCalculatorProps {
  data: SyllabusData;
}

export const GradeCalculator: React.FC<GradeCalculatorProps> = ({ data }) => {
  // Store scores for each sub-item
  // Key: "CategoryIndex-SubItemIndex" -> value (0-100)
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
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <i className="fas fa-calculator mr-3 text-blue-600"></i>
          Calculate Your Grade
        </h2>
        
        {data.courseName && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <span className="text-sm text-blue-600 font-semibold uppercase tracking-wider">Course</span>
            <p className="text-lg font-bold text-blue-900">{data.courseName}</p>
          </div>
        )}

        {data.breakdown.map((category, catIdx) => (
          <div key={catIdx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
                <span className="text-sm text-gray-500">Weight: {category.overallWeight}% of final grade</span>
              </div>
              {!category.subItems?.length && (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Score"
                    className="w-24 p-2 border border-gray-200 rounded-lg text-center font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    value={scores[`${catIdx}-main`] || ''}
                    onChange={(e) => handleScoreChange(`${catIdx}-main`, e.target.value)}
                  />
                  <span className="text-gray-400 font-medium">%</span>
                </div>
              )}
            </div>

            {category.subItems && category.subItems.length > 0 && (
              <div className="space-y-3 mt-4 border-t pt-4">
                {category.subItems.map((sub, subIdx) => (
                  <div key={subIdx} className="flex items-center justify-between group">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-medium text-gray-700">{sub.name}</p>
                      {sub.description && <p className="text-xs text-gray-400">{sub.description}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">({sub.weight} pts)</span>
                      <input
                        type="number"
                        placeholder="%"
                        className="w-20 p-1.5 border border-gray-100 rounded bg-gray-50 text-center text-sm focus:bg-white focus:border-blue-300 outline-none"
                        value={scores[`${catIdx}-${subIdx}`] || ''}
                        onChange={(e) => handleScoreChange(`${catIdx}-${subIdx}`, e.target.value)}
                      />
                      <span className="text-gray-300">%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Column */}
      <div className="lg:col-span-1">
        <div className="sticky top-8 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <h3 className="text-gray-500 font-medium uppercase text-xs tracking-widest mb-2">Estimated Final Grade</h3>
            <div className="text-6xl font-black text-gray-900 mb-2">
              {finalGrade.toFixed(1)}%
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${Math.min(100, finalGrade)}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-400 italic">
              {data.totalWeightNote || "Calculated based on extracted syllabus weights."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4">Weight Distribution</h4>
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
                  <span className="flex-1 text-gray-600">{cat.name}</span>
                  <span className="font-bold text-gray-800">{cat.overallWeight}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
