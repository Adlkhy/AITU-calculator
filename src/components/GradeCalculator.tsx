import React, { useState, useEffect } from 'react';
import type { GradeItem } from '../hooks/types';
import { X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface GradeCalculatorProps {
  initialItems: GradeItem[];
}

export const GradeCalculator: React.FC<GradeCalculatorProps> = ({ initialItems }) => {
  const [items, setItems] = useState<GradeItem[]>(initialItems);

  // Sync state if initialItems change (e.g., after parsing)
  useEffect(() => {
    if (initialItems.length > 0) {
      setItems(initialItems);
    }
  }, [initialItems]);

  const handleUpdate = (id: string, field: keyof GradeItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: `manual-${Date.now()}`, category: 'New Assignment', weight: 0 }
    ]);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  // Calculations
  const totalWeight = items.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
  
  // Calculate current grade based on weights that have scores entered
  const earnedWeight = items.reduce((sum, item) => {
    if (item.score !== undefined && item.score !== null && String(item.score) !== '') {
      return sum + ((Number(item.score) / 100) * Number(item.weight));
    }
    return sum;
  }, 0);

  const weightConsidered = items.reduce((sum, item) => {
    if (item.score !== undefined && item.score !== null && String(item.score) !== '') {
      return sum + Number(item.weight);
    }
    return sum;
  }, 0);

  const currentPercentage = weightConsidered > 0 
    ? (earnedWeight / weightConsidered) * 100 
    : 100;

  // Chart Data Preparation
  const chartData = items.map(item => ({
    name: item.category,
    Score: Number(item.score) || 0,
    Weight: Number(item.weight) || 0,
  }));

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* Left Column: List of Assessments */}
      <div className="flex flex-col space-y-6">
        <div className="bg-card rounded-xl shadow-sm border border-foreground overflow-hidden">
          <div className="px-4 py-4 border-b border-foreground flex justify-between items-center">
            <h3 className="text-base sm:text-xl font-semibold text-foreground">Grade Breakdown</h3>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${totalWeight === 100 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              Total Weight: {totalWeight}%
            </span>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-card p-4 rounded-lg border border-foreground">
                  <div className="flex-grow w-full sm:w-auto">
                    <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1">Category</label>
                    <Input
                      type="text"
                      value={item.category}
                      onChange={(e) => handleUpdate(item.id, 'category', e.target.value)}
                      className="w-full px-3 py-2 bg-input border border-foreground text-foreground font-medium"
                    />
                  </div>
                  
                  <div className="w-full sm:w-24">
                    <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1">Weight %</label>
                    <Input
                      type="number"
                      value={item.weight}
                      onChange={(e) => handleUpdate(item.id, 'weight', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-input border border-foreground text-foreground"
                    />
                  </div>

                  <div className="w-full sm:w-24">
                    <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1">My Score</label>
                    <Input
                      type="number"
                      placeholder="-"
                      value={item.score ?? ''}
                      onChange={(e) => handleUpdate(item.id, 'score', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-input border border-foreground text-foreground"
                    />
                  </div>
                  
                  <Button 
                    onClick={() => handleDelete(item.id)}
                    className="px-2 py-1 text-destructive-foreground hidden sm:block"
                    title="Remove item"
                    size="sm"
                    type="button"
                    variant="destructive"
                  >
                    <X size={16} />
                  </Button>

                  <Button 
                    onClick={() => handleDelete(item.id)}
                    className="w-full px-3 py-2 text-destructive-foreground sm:hidden"
                    title="Remove item"
                    size="sm"
                    type="button"
                    variant="destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <Button
              onClick={handleAddItem}
              variant="outline"
              size="sm"
              className="mt-6 w-full border-dashed border-foreground rounded-lg text-foreground font-medium bg-muted hover:bg-accent transition-all flex items-center justify-center gap-2"
            >
              + Add Assigment
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column: Results & Visualization */}
      <div className="space-y-6 sticky top-6 h-fit">
        {/* Grade Summary Card */}
        <div className="bg-card rounded-xl shadow-lg p-4 text-foreground border border-foreground overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-brand-200 text-sm font-semibold uppercase tracking-wider mb-1">Current Grade</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight">{currentPercentage.toFixed(1)}%</span>
              <span className="text-brand-300 font-medium">
                {currentPercentage >= 90 ? 'A' : 
                 currentPercentage >= 80 ? 'B' : 
                 currentPercentage >= 70 ? 'C' : 
                 currentPercentage >= 60 ? 'D' : 'F'}
              </span>
            </div>
            
            <div className="mt-6 space-y-2">
               <div className="flex justify-between text-sm text-brand-200">
                 <span>Points Earned</span>
                 <span>{earnedWeight.toFixed(1)} / {weightConsidered}</span>
               </div>
               <div className="w-full bg-brand-800 rounded-full h-2">
                 <div 
                    className="bg-brand-400 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${currentPercentage}%` }}
                 ></div>
               </div>
            </div>
          </div>
          
          {/* Decorative background circle */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-800 rounded-full opacity-50 blur-2xl"></div>
        </div>

        {/* Chart Card */}
        <div className="bg-card rounded-xl shadow-sm border border-foreground p-6">
          <h3 className="font-semibold text-foreground mb-6">Performance Visualizer</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                <YAxis domain={[0, 100]} tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="Score" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.Score >= 90 ? '#16a34a' : entry.Score < 60 ? '#dc2626' : '#0ea5e9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GradeCalculator;
