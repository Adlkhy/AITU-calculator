import { useState, useEffect, useMemo } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { X, Plus, Wallet, TrendingUp, Landmark, ArrowUpRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { ChartTooltipContent } from '@/components/ui/chart';

// --- BUDGET TYPE DEFINITIONS ---
interface IncomeSource {
  id: string;
  name: string;
  amount: string;
  type: 'grant' | 'personal';
}

interface BudgetRule {
  name: string;
  needs: number;
  wants: number;
  savings: number;
  colors: {
    needs: string;
    wants: string;
    savings: string;
  };
}

const budgetConfig = {
  needs: { label: "Needs", color: "var(--chart-1)" },
  wants: { label: "Wants", color: "var(--chart-2)" },
  savings: { label: "Savings", color: "var(--chart-3)" },
} satisfies ChartConfig;

const incomeChartConfig = {
  amount: { label: "Amount", color: "var(--chart-1)" },
} satisfies ChartConfig;


// --- BUDGET COMPONENTS ---
const IncomeSourceInput = ({ 
  source, 
  onUpdate, 
  onRemove 
} : { 
  source: IncomeSource; 
  onUpdate: (id: string, field: string, value: string) => void; 
  onRemove: (id: string) => void;
}) => (
  <div className="group relative flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl border border-muted-foreground/10 bg-muted/5 hover:bg-muted/10 transition-all">
    <div className="w-full space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Source Name</label>
      <Input
        type="text"
        value={source.name}
        onChange={(e) => onUpdate(source.id, 'name', e.target.value)}
        placeholder="e.g., Monthly Grant"
        className="h-10 bg-background border-muted-foreground/20"
      />
    </div>
    
    <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
      <div className="sm:w-32 space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Amount (₸)</label>
        <Input
          type="number"
          value={source.amount}
          onChange={(e) => onUpdate(source.id, 'amount', e.target.value)}
          placeholder="0"
          min="0"
          step="0.01"
          className="h-10 bg-background border-muted-foreground/20 font-mono"
        />
      </div>
      <div className='flex justify-between items-center gap-2'>
        <div className='flex flex-col space-y-1'>
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Type</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 w-28 justify-between border-muted-foreground/20">
                {source.type === 'grant' ? <Landmark className="w-3 h-3 mr-2" /> : <User className="w-3 h-3 mr-2" />}
                {source.type === 'grant' ? 'Grant' : 'Personal'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onUpdate(source.id, 'type', 'grant')} className="gap-2">
                <Landmark className="w-4 h-4" /> Grant
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdate(source.id, 'type', 'personal')} className="gap-2">
                <User className="w-4 h-4" /> Personal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(source.id)}
          className="h-8 w-8 mt-5 text-destructive hover:text-destructive-foreground hover:bg-destructive! border! border-destructive! transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
);

const BudgetRuleDisplay = ({ 
  rule, 
  totalIncome,
  isActive,
  onSelect
} : { 
  rule: BudgetRule; 
  totalIncome: number;
  isActive: boolean;
  onSelect: () => void;
}) => {
  const needsAmount = (totalIncome * rule.needs) / 100;
  const wantsAmount = (totalIncome * rule.wants) / 100;
  const savingsAmount = (totalIncome * rule.savings) / 100;

  const chartData = [
    { name: 'Needs', value: rule.needs, amount: needsAmount, color: 'var(--chart-1)' },
    { name: 'Wants', value: rule.wants, amount: wantsAmount, color: 'var(--chart-2)' },
    { name: 'Savings', value: rule.savings, amount: savingsAmount, color: 'var(--chart-3)' },
  ];

  return (
    <Card 
      className={`relative overflow-hidden transition-all cursor-pointer hover:shadow-md ${isActive ? 'ring-2 ring-primary border-transparent' : 'border-muted-foreground/20'}`}
      onClick={onSelect}
    >
      {isActive && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary text-primary-foreground text-[10px] uppercase tracking-tighter">Active</Badge>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-black tracking-tight">{rule.name} Strategy</CardTitle>
        <CardDescription className="text-xs">Standard allocation for students</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="h-32 w-full">
          <ChartContainer config={budgetConfig}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={50}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-muted-foreground/20 p-2 rounded-lg shadow-xl text-[10px] font-bold uppercase tracking-widest">
                        <p style={{ color: payload[0].payload.color }}>{payload[0].name}: {payload[0].value}%</p>
                        <p className="text-muted-foreground">{payload[0].payload.amount.toFixed(0)}₸</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ChartContainer>
        </div>

        <div className="space-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-bold">{item.amount.toLocaleString()}₸</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function BudgetPlanner() {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(() => {
    const saved = localStorage.getItem('student_income_sources');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Monthly Grant', amount: '', type: 'grant' }
    ];
  });

  const [activeRuleIndex, setActiveRuleIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem('student_income_sources', JSON.stringify(incomeSources));
  }, [incomeSources]);

  const totalIncome = useMemo(() => {
    return incomeSources.reduce((sum, source) => sum + (parseFloat(source.amount) || 0), 0);
  }, [incomeSources]);

  const budgetRules: BudgetRule[] = [
    { name: '50/30/20', needs: 50, wants: 30, savings: 20, colors: { needs: '--chart-1', wants: '--chart-2', savings: '--chart-3' } },
    { name: '60/20/20', needs: 60, wants: 20, savings: 20, colors: { needs: '--chart-1', wants: '--chart-2', savings: '--chart-3' } },
    { name: '70/20/10', needs: 70, wants: 20, savings: 10, colors: { needs: '--chart-1', wants: '--chart-2', savings: '--chart-3' } }
  ];

  const activeRule = budgetRules[activeRuleIndex];

  const incomeChartData = useMemo(() => {
    return incomeSources
      .filter(s => parseFloat(s.amount) > 0)
      .map(s => ({
        name: s.name.length > 10 ? s.name.substring(0, 10) + '...' : s.name,
        amount: parseFloat(s.amount) || 0,
        fill: s.type === 'grant' ? 'var(--chart-1)' : 'var(--chart-2)'
      }));
  }, [incomeSources]);

  const addIncomeSource = () => {
    setIncomeSources([...incomeSources, {
      id: crypto.randomUUID(),
      name: `Source ${incomeSources.length + 1}`,
      amount: '',
      type: 'personal'
    }]);
  };

  const updateIncomeSource = (id: string, field: string, value: string) => {
    setIncomeSources(incomeSources.map(source => 
      source.id === id ? { ...source, [field]: value } : source
    ));
  };

  const removeIncomeSource = (id: string) => {
    if (incomeSources.length > 1) {
      setIncomeSources(incomeSources.filter(source => source.id !== id));
    }
  };

  return (
    <div className="px-4 md:px-8 max-w-6xl mx-auto w-full space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Budget <span className="text-primary">Planner</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage your grants and personal income with smart rules.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-2xl border border-muted-foreground/10">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Monthly</p>
            <p className="text-2xl font-black text-primary">{totalIncome.toLocaleString()}₸</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: INPUTS */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-muted-foreground/20 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-xl font-black tracking-tight">Income Sources</CardTitle>
                <CardDescription>Add your grants, jobs, or allowances</CardDescription>
              </div>
              <Button onClick={addIncomeSource} size="sm" className="h-8 gap-1">
                <Plus className="w-4 h-4" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {incomeSources.map(source => (
                <IncomeSourceInput
                  key={source.id}
                  source={source}
                  onUpdate={updateIncomeSource}
                  onRemove={removeIncomeSource}
                />
              ))}
            </CardContent>
          </Card>

          {/* INCOME CHART */}
          {incomeChartData.length > 0 && (
            <Card className="border-muted-foreground/20 shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Income Distribution</CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <ChartContainer className='' config={incomeChartConfig}>
                  <BarChart data={incomeChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--muted-foreground)" opacity={0.1} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis hide />
                    <RechartsTooltip 
                      cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar 
                      dataKey="amount" 
                      radius={[6, 6, 0, 0]} 
                      barSize={40}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN: RULES & SUMMARY */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Budgeting Strategies</h3>
            <div className="grid grid-cols-1 gap-4">
              {budgetRules.map((rule, idx) => (
                <BudgetRuleDisplay
                  key={rule.name}
                  rule={rule}
                  totalIncome={totalIncome}
                  isActive={activeRuleIndex === idx}
                  onSelect={() => setActiveRuleIndex(idx)}
                />
              ))}
            </div>
          </div>

          {/* FINAL SUMMARY CARD */}
          <Card className="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20 overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <CardHeader>
              <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Monthly Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Target Savings</p>
                <p className="text-3xl font-black">
                  {((totalIncome * activeRule.savings) / 100).toLocaleString()}₸
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-medium opacity-80">
                <ArrowUpRight className="w-4 h-4" />
                <span>Based on {activeRule.name} strategy</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
