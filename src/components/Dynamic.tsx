import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';

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
    <Card className="mb-6 overflow-hidden border-muted-foreground/20 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="border-b border-muted-foreground/10">
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
              className="text-lg font-bold px-3"
            />
          </div>
          <div className="flex items-center gap-3 bg-background/50 p-2 rounded-lg border border-muted-foreground/20 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                name="categoryWeight"
                value={category.totalWeight}
                onChange={(e) => updateCategoryWeight(Number(e.target.value))}
                min="0"
                max="100"
                className="w-16 h-8 text-center font-bold"
              />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">% Weight</span>
            </div>
            <div className="h-4 w-px bg-muted-foreground/20 hidden md:block" />
            <div className="text-right">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block">Score</span>
              <span className="font-bold text-primary">{categoryScore.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* DESKTOP TABLE */}
        <div className="hidden sm:block overflow-x-auto mb-4">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-muted-foreground/10">
                <th className="pb-3 font-medium">Assignment/Item Name</th>
                <th className="pb-3 font-medium text-center w-32">Score (%)</th>
                <th className="pb-3 font-medium text-center w-24">Weight</th>
                <th className="pb-3 font-medium text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-foreground/5">
              {category.items.map(item => (
                <tr key={item.id} className="group hover:bg-muted/20 transition-colors">
                  <td className="py-3 pr-4">
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Item name"
                      name='Assignment name'
                      className=" border-muted-foreground/20"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <Input
                      type="number"
                      value={item.score}
                      onChange={(e) => updateItem(item.id, 'score', e.target.value)}
                      placeholder="0"
                      name='Assignment score'
                      min="0"
                      max="100"
                      className="text-center border-muted-foreground/20"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <Input
                      type="number"
                      value={item.weight}
                      onChange={(e) => updateItem(item.id, 'weight', e.target.value)}
                      placeholder="1"
                      name='Assignment weight'
                      min="0"
                      step="0.1"
                      className="text-center border-muted-foreground/20"
                    />
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      onClick={() => removeItem(item.id)}
                      variant="destructive"
                      size="icon"
                      type="button"
                      className="h-8 w-8 text-destructive-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="sm:hidden flex flex-col gap-4 mb-4">
          {category.items.map(item => (
            <div
              key={item.id}
              className="relative p-4 rounded-xl border border-muted-foreground/10 bg-muted/10 space-y-3"
            >
              <Button
                onClick={() => removeItem(item.id)}
                variant="ghost"
                size="icon"
                type="button"
                className="absolute top-2 right-2 h-8 w-8 text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4"/>
              </Button>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Item Name</label>
                <Input
                  value={item.name}
                  placeholder="Assignment name"
                  name='Assignment name'
                  className="h-10 bg-background border-muted-foreground/20"
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Score %</label>
                  <Input
                    type="number"
                    value={item.score}
                    placeholder="0"
                    name='Assignment score'
                    className="h-10 bg-background border-muted-foreground/20 text-center"
                    onChange={(e) => updateItem(item.id, 'score', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Weight</label>
                  <Input
                    type="number"
                    value={item.weight}
                    name='Assignment weight'
                    placeholder="1"
                    className="h-10 bg-background border-muted-foreground/20 text-center"
                    onChange={(e) => updateItem(item.id, 'weight', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <Button
            size='sm'
            onClick={addItem}
            variant='secondary'
            type="button"
            className="w-full sm:w-auto font-medium"
          >
            + Add Assignment
          </Button>
          
          <Button
            size='sm'
            variant='destructive'
            type="button"
            onClick={() => onRemoveCategory(category.id)}
            className="w-full sm:w-auto text-destructive-foreground hover:text-destructive hover:bg-destructive/10"
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
      name: 'Mid Term',
      items: [
        { id: '1-1', name: 'Assignment', score: '', weight: '4' },
        { id: '1-2', name: 'Assignment2', score: '', weight: '4' },
        { id: '1-4', name: 'Mid Term Exam', score: '', weight: '8' }
      ],
      totalWeight: 30
    },
    {
      id: '2',
      name: 'End Term',
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

  return (
    <div className="px-4 py-6 md:px-8 md:py-10 max-w-5xl mx-auto w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Grade <span className="text-primary">Calculator</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Customize your grading structure and track your progress.
          </p>
        </div>

        <Button
          onClick={addCategory}
          variant="default"
          size="lg"
          type="button"
          className="shadow-lg shadow-primary/20 font-bold px-6"
        >
          + Add New Category
        </Button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/10 overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <CardContent className="p-6">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Final Grade</p>
            <div className="text-4xl font-black">
              {finalGrade.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted-foreground/20 shadow-sm overflow-hidden relative">
          <CardContent className="p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Final GPA</p>
            <div className="text-4xl font-black flex items-baseline gap-2">
              {finalGpa.toFixed(2)}
              <span className={`text-xl ${letterColor(gpaToLetter(finalGpa))}`}>
                {gpaToLetter(finalGpa)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-muted-foreground/20 shadow-sm overflow-hidden relative ${totalWeightPercentage !== 100 ? 'ring-2 ring-destructive/50' : ''}`}>
          <CardContent className="p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Weight</p>
            <div className="flex items-center justify-between">
              <div className={`text-4xl font-black ${totalWeightPercentage !== 100 ? 'text-destructive' : 'text-foreground'}`}>
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

      {/* CATEGORIES LIST */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-2 mb-4">
          <div className="h-px flex-1 bg-muted-foreground/10" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Grading Structure</span>
          <div className="h-px flex-1 bg-muted-foreground/10" />
        </div>
        
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
      {categories.length > 0 && (
        <div className="pt-8 border-t border-muted-foreground/10">
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Category Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map(category => (
              <div key={category.id} className="p-3 rounded-xl border border-muted-foreground/10 bg-muted/5">
                <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground truncate mb-1">{category.name || 'Untitled'}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold">{categoryScores[category.id]?.toFixed(1) || '0.0'}%</span>
                  <span className="text-[10px] text-muted-foreground">({category.totalWeight}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}