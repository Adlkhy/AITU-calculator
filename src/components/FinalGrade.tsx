import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { SeoMeta } from '@/lib/seo';

// --- MAIN DYNAMIC CALCULATOR COMPONENT ---
export default function FinalGradeCalculator() {

  const [att1, setAtt1] = useState('');
  const [att2, setAtt2] = useState('');

  const a1 = parseFloat(att1);
  const a2 = parseFloat(att2);
  const hasValues = !isNaN(a1) && !isNaN(a2);

  const base = hasValues ? 0.3 * a1 + 0.3 * a2 : 0;
  const requiredFor = (target: number) =>
    hasValues ? (target - base) / 0.4 : NaN;

  const r70 = requiredFor(70);
  const r90 = requiredFor(90);

  const renderRequired = (val: number) => {
    if (isNaN(val)) return '—';
    if (val <= 0) return '0.0%';
    return `${Math.min(val, 999).toFixed(1)}%`;
  };

  return (
    <>
      <SeoMeta
        title="Final Grade Calculator | Evalis"
        description="Quick view: first & second term scores and required final to reach targets."
        path="/final-calculator"
        keywords={[ 'final grade', 'required final', 'calculator' ]}
      />

      <div className="max-w-3xl mx-auto w-full space-y-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Final needed — quick view</h1>
            <p className="text-sm text-muted-foreground">Shows 1st & 2nd term scores and required final for 70% / 90% targets.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label: '1st Attestation (Reg Midterm)', value: att1, onChange: setAtt1 },
          { label: '2nd Attestation (Reg Endterm)', value: att2, onChange: setAtt2 },
        ].map(({ label, value, onChange }) => (
          <Card key={label}>
            <CardContent className="">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {label}
              </p>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  placeholder="0–100"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full bg-transparent text-2xl font-mono font-bold outline-none"
                />
                <span className="text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">weight: 30%</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="bg-secondary border-none">
          <CardContent className="">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Needed for 70%
            </p>
            <p className={`text-3xl font-mono font-bold ${r70 > 100 ? 'text-destructive' : ''}`}>
              {renderRequired(r70)}
            </p>
            {r70 > 100 && (
              <p className="text-xs text-destructive mt-1">Not achievable</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-secondary border-none">
          <CardContent className="">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Needed for 90%
            </p>
            <p className={`text-3xl font-mono font-bold ${r90 > 100 ? 'text-destructive' : ''}`}>
              {renderRequired(r90)}
            </p>
            {r90 > 100 && (
              <p className="text-xs text-destructive mt-1">Not achievable</p>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </>
  );
}