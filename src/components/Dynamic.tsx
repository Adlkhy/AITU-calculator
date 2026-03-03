import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip
} from 'recharts';
import { ChartContainer, type ChartConfig } from './ui/chart';

// --- TYPE DEFINITIONS ---
interface GradeItem {
  id: string;
  name: string;
  score: string; // percentage (0-100)
  weight: string; // weight of this item within its category
}

interface Category {
  id: string;
  name: string;
  items: GradeItem[];
  totalWeight: number; // total weight of this category in final grade (e.g., 30 for 30%)
}
// --- REUSABLE COMPONENTS ---

const GradeCategory = ({
  category,
  onUpdateCategory,
  onRemoveCategory
}: {
  category: Category;
  onUpdateCategory: (id: string, updatedCategory: Category) => void;
  onRemoveCategory: (id: string) => void;
}) => {
  const addItem = () => {
    const newItem: GradeItem = {
      id: crypto.randomUUID(),
      name: `Assignment ${category.items.length + 1}`,
      score: '',
      weight: '',
    };
    onUpdateCategory(category.id, {
      ...category,
      items: [...category.items, newItem]
    });
  };

  const updateItem = (id: string, field: string, value: string) => {
    onUpdateCategory(category.id, {
      ...category,
      items: category.items.map(it =>
        it.id === id ? { ...it, [field]: value } : it
      )
    });
  };

  const removeItem = (id: string) => {
    onUpdateCategory(category.id, {
      ...category,
      items: category.items.filter(it => it.id !== id)
    });
  };

  const updateCategoryWeight = (weight: number) => {
    onUpdateCategory(category.id, {
      ...category,
      totalWeight: weight
    });
  };

  // Calculate category score
  const calculateCategoryScore = () => {
    const p = (val: string) => parseFloat(val) || 0;
    let totalWeightedScore = 0;
    let totalCategoryWeight = 0;

    category.items.forEach(item => {
      const score = p(item.score);
      const weight = p(item.weight);
      if (weight > 0) {
        totalWeightedScore += (score / 100) * weight;
        totalCategoryWeight += weight;
      }
    });

    return totalCategoryWeight > 0 ? (totalWeightedScore / totalCategoryWeight) * 100 : 0;
  };

  const categoryScore = calculateCategoryScore();

  return (
    <Card className="mb-6 gap-0 py-4 overflow-hidden border-muted-foreground/20 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="px-4 pb-1!">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1 w-full">
            <Input
              type="text"
              name="categoryName"
              placeholder="Category Name (e.g. Midterm)"
              value={category.name}
              onChange={(e) => onUpdateCategory(category.id, {
                ...category,
                name: e.target.value
              })}
              className="text-sm sm:text-lg font-bold font-mono px-3"
            />
          </div>
          <div className="flex items-center gap-3 bg-background/50 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                name="categoryWeight"
                value={category.totalWeight}
                onChange={(e) => updateCategoryWeight(Number(e.target.value))}
                min="0"
                max="100"
                className="w-16 text-center font-bold font-mono"
              />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">% Weight</span>
            </div>
            <div className="hidden sm:block border-l border-muted-foreground h-6" />
            <div className="text-right flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block">Score:</span>
              <span className="font-bold font-mono text-lg text-primary">{categoryScore.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        {/* RESPONSIVE DESIGN: Cards on Mobile, Table on Desktop */}
        
        {/* MOBILE VIEW (< md) */}
        <div className="flex flex-col gap-0 md:hidden">
          {category.items.map((item, index) => (
            <div
              key={item.id}
              className="relative p-4 rounded-none border border-muted-foreground/10 bg-muted/5 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-muted-foreground">Item {index + 1}</h4>
                <Button
                  onClick={() => removeItem(item.id)}
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                >
                  <Trash2 className="w-4 h-4"/>
                </Button>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Item Name</label>
                <Input
                  value={item.name}
                  placeholder="Assignment name"
                  name='Assignment name'
                  className="h-10 bg-background border-muted-foreground/20 font-mono transition-colors focus-visible:ring-1"
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Score %</label>
                  <Input
                    type="number"
                    value={item.score}
                    placeholder="0"
                    name='Assignment score'
                    className="h-10 bg-background border-muted-foreground/20 text-center font-medium font-mono"
                    onChange={(e) => updateItem(item.id, 'score', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Weight</label>
                  <Input
                    type="number"
                    value={item.weight}
                    name='Assignment weight'
                    placeholder="1"
                    className="h-10 bg-background border-muted-foreground/20 text-center font-medium font-mono"
                    onChange={(e) => updateItem(item.id, 'weight', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW (>= md) */}
        <div className="hidden md:block overflow-hidden rounded-none border border-muted-foreground/10">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[50px] text-center font-bold text-xs uppercase tracking-wider">#</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Item Name</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-center w-[120px]">Score %</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-center w-[120px]">Weight</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-background">
              {category.items.map((item, index) => (
                <TableRow key={item.id} className="group">
                  <TableCell className="text-center text-sm font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.name}
                      placeholder="Assignment name"
                      className="border-transparent bg-transparent hover:border-border focus:border-border shadow-none font-mono"
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.score}
                      placeholder="0"
                      className="border-transparent bg-transparent hover:border-border focus:border-border text-center font-medium font-mono shadow-none"
                      onChange={(e) => updateItem(item.id, 'score', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.weight}
                      placeholder="1"
                      className="border-transparent bg-transparent hover:border-border focus:border-border text-center font-medium font-mono shadow-none"
                      onChange={(e) => updateItem(item.id, 'weight', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      onClick={() => removeItem(item.id)}
                      variant="ghost"
                      size="icon"
                      type="button"
                      className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90! hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4"/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col px-4 sm:flex-row justify-between items-center gap-4 pt-4">
          <Button
            size='sm'
            onClick={addItem}
            variant='outline'
            type="button"
            className="w-full sm:w-auto font-medium"
          >
            + Add Assignment
          </Button>
          
          <Button
            size='sm'
            variant='ghost'
            type="button"
            onClick={() => onRemoveCategory(category.id)}
            className="w-full sm:w-auto text-destructive hover:text-destructive-foreground hover:bg-destructive! font-medium"
          >
            Delete Category
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// GPA conversion functions (similar to GPA.tsx)
const percentToGpa = (p: number) => {
  if (p >= 95) return 4.0;
  if (p >= 90) return 3.67;
  if (p >= 85) return 3.33;
  if (p >= 80) return 3.0;
  if (p >= 75) return 2.67;
  if (p >= 70) return 2.33;
  if (p >= 65) return 2.0;
  if (p >= 60) return 1.67;
  if (p >= 55) return 1.33;
  if (p >= 50) return 1.0;
  if (p >= 25) return 0;
  return 0;
};

const gpaToLetter = (g: number) => {
  if (g >= 4.0) return "A";
  if (g >= 3.67) return "A-";
  if (g >= 3.33) return "B+";
  if (g >= 3.0) return "B";
  if (g >= 2.67) return "B-";
  if (g >= 2.33) return "C+";
  if (g >= 2.0) return "C";
  if (g >= 1.67) return "C-";
  if (g >= 1.33) return "D+";
  if (g >= 1.0) return "D";
  if (g > 0) return "FX";
  return "F";
};

const letterColor = (letter: string) => {
  switch (letter) {
    case "A":
    case "A-":
      return "text-green-500 font-bold";
    case "B+":
    case "B":
    case "B-":
      return "text-lime-700 font-bold";
    case "C+":
    case "C":
    case "C-":
      return "text-yellow-500 font-bold";
    case "D+":
    case "D":
      return "text-orange-500 font-bold";
    case "FX":
    case "F":
      return "text-red-500 font-bold";
    default:
      return "";
  }
};

// --- MAIN DYNAMIC CALCULATOR COMPONENT ---
export default function DynamicGradeCalculator() {
  // --- STATE FOR CATEGORIES ---
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: '1st Term',
      items: [
        { id: '1-1', name: 'Assignment', score: '', weight: '4' },
        { id: '1-2', name: 'Assignment2', score: '', weight: '4' },
        { id: '1-4', name: 'Mid Term Exam', score: '', weight: '8' }
      ],
      totalWeight: 30
    },
    {
      id: '2',
      name: '2nd Term',
      items: [
        { id: '2-1', name: 'Assignment', score: '', weight: '4' },
        { id: '2-2', name: 'Assignment2', score: '', weight: '4' },
        { id: '2-4', name: 'End Term Exam', score: '', weight: '8' }
      ],
      totalWeight: 30
    },
    {
      id: '3',
      name: 'Final Exam',
      items: [
        { id: '3-1', name: 'Final Exam Quiz', score: '', weight: '40' }
      ],
      totalWeight: 40
    }
  ]);

  // --- STATE FOR CALCULATED RESULTS ---
  const [categoryScores, setCategoryScores] = useState<{ [key: string]: number }>({});
  const [finalGrade, setFinalGrade] = useState(0);

  // --- CALCULATION LOGIC ---
  useEffect(() => {
    const p = (val: string) => parseFloat(val) || 0;

    // Calculate score for each category
    const newCategoryScores: { [key: string]: number } = {};

    categories.forEach(category => {
      let totalWeightedScore = 0;
      let totalCategoryWeight = 0;

      category.items.forEach(item => {
        const score = p(item.score);
        const weight = p(item.weight);
        if (weight > 0) {
          totalWeightedScore += (score / 100) * weight;
          totalCategoryWeight += weight;
        }
      });

      // Calculate category score as percentage
      const categoryScore = totalCategoryWeight > 0 ?
        (totalWeightedScore / totalCategoryWeight) * 100 : 0;

      newCategoryScores[category.id] = categoryScore;
    });

    setCategoryScores(newCategoryScores);

    // Calculate final grade
    let totalFinalGrade = 0;
    categories.forEach(category => {
      const categoryScore = newCategoryScores[category.id] || 0;
      totalFinalGrade += categoryScore * (category.totalWeight / 100);
    });

    setFinalGrade(totalFinalGrade);

  }, [categories]);

  const addCategory = () => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: `New Category ${categories.length + 1}`,
      items: [{
        id: crypto.randomUUID(),
        name: 'Assignment 1',
        score: '',
        weight: '100'
      }],
      totalWeight: 0
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, updatedCategory: Category) => {
    setCategories(categories.map(cat =>
      cat.id === id ? updatedCategory : cat
    ));
  };

  const removeCategory = (id: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  // Calculate total weight percentage
  const totalWeightPercentage = categories.reduce(
    (sum, category) => sum + category.totalWeight, 0
  );

  const finalGpa = percentToGpa(finalGrade);

  // Calculate required final exam grade to achieve 70%
  const calculateRequiredFinalGrade = () => {
    // Find the final exam category (last category is usually final exam)
    const finalExamCategory = categories[categories.length - 1];
    if (!finalExamCategory) return -1;

    const finalExamWeight = finalExamCategory.totalWeight;
    
    // Current score from all other categories
    let currentScore = 0;
    let currentWeight = 0;

    categories.forEach((category, idx) => {
      if (idx !== categories.length - 1) {
        const categoryScore = categoryScores[category.id] || 0;
        const weight = category.totalWeight;
        currentScore += categoryScore * (weight / 100);
        currentWeight += weight;
      }
    });

    // Required formula: currentScore + (requiredGrade * (finalExamWeight / 100)) >= 70
    // requiredGrade >= (70 - currentScore) / (finalExamWeight / 100)
    const requiredGrade = (70 - currentScore) / (finalExamWeight / 100);

    // Return the required grade, but cap it at 0-100
    return Math.max(0, Math.min(100, requiredGrade));
  };

  const requiredFinalGrade = calculateRequiredFinalGrade();

  const chartConfig = categories.reduce((acc, cat, idx) => {
    acc[cat.id] = {
      label: cat.name || `Category ${idx + 1}`,
      color: `var(--chart-${(idx % 5) + 1})`
    };
    return acc;
  }, {} as ChartConfig);

  const attestationPieData = categories.map((cat, idx) => ({
    name: cat.name || `Category ${idx + 1}`,
    value: categoryScores[cat.id] || 0,
    color: `var(--chart-${(idx % 5) + 1})`
  }));

  return (
    <div className="px-4 md:px-8 max-w-5xl mx-auto w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Custom Calculator
          </h1>
          <p className="text-muted-foreground font-medium">
            Customize your grading structure and track your progress.
          </p>
        </div>

        <Button
          onClick={addCategory}
          variant="default"
          size="lg"
          className="text-primary-foreground font-bold px-6"
        >
          + Add New Category
        </Button>
      </div>

      {/* CATEGORIES LIST */}
      <div className="space-y-2">
        <div className="space-y-6">
          {categories.map(category => (
            <GradeCategory
              key={category.id}
              category={category}
              onUpdateCategory={updateCategory}
              onRemoveCategory={removeCategory}
            />
          ))}
        </div>
      </div>

      {/* FOOTER STATS */}
      <Card className="p-0 shadow-sm border-muted-foreground/20">
        <CardContent className="p-6">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 text-center md:text-left">
            Score Distribution
          </CardTitle>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-1/2 aspect-square max-h-[220px]">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-full"
              >
                <PieChart>
                  <Pie
                    data={attestationPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
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
                            <p style={{ color: payload[0].payload.color }}>
                              {payload[0].name}: {Number(payload[0].value ?? 0).toFixed(1)}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ChartContainer>
            </div>
            
            <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
              {attestationPieData.length > 0 ? (
                attestationPieData.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/5 border border-muted-foreground/5 hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full shadow-sm" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <span className="font-semibold text-sm text-muted-foreground uppercase font-mono tracking-tight">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-base tabular-nums font-mono" style={{ color: item.color }}>
                      {item.value.toFixed(1)}%
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-muted-foreground mt-4 uppercase tracking-widest font-bold opacity-50 col-span-full">
                  Enter scores to see distribution
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative">
          <CardContent className="">
            <p className="text-xs font-bold uppercase tracking-widest">Final Grade</p>
            <div className="text-3xl font-mono font-bold">
              {finalGrade.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent border-none overflow-hidden relative">
          <CardContent className="">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Needed Final</p>
            <div className={`text-3xl font-bold font-mono ${requiredFinalGrade > 100 ? 'text-destructive' : 'text-foreground'}`}>
              {requiredFinalGrade < 0 ? '—' : `${requiredFinalGrade.toFixed(1)}%`}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative">
          <CardContent className="">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Final GPA</p>
            <div className="text-3xl font-bold font-mono flex items-baseline gap-2">
              {finalGpa.toFixed(2)}
              <span className={`text-xl ${letterColor(gpaToLetter(finalGpa))}`}>
                {gpaToLetter(finalGpa)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className={`overflow-hidden relative ${totalWeightPercentage !== 100 ? 'ring-2 ring-destructive/50' : ''}`}>
          <CardContent className="">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Weight</p>
            <div className="flex items-center justify-between">
              <div className={`text-3xl font-bold font-mono ${totalWeightPercentage !== 100 ? 'text-destructive' : 'text-foreground'}`}>
                {totalWeightPercentage}%
              </div>
              {totalWeightPercentage !== 100 && (
                <div className="text-[10px] font-bold bg-destructive/10 text-destructive px-2 py-1 rounded uppercase tracking-tighter">
                  Target 100%
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}