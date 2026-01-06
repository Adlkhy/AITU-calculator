import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';

export type SubjectRow = {
  id: number;
  name: string;
  percent: number | "";
  credits: number | "";
};

export default function GpaCalculator() {
  const [rows, setRows] = useState<SubjectRow[]>([
    { id: 1, name: "Subject 1", percent: "", credits: 5 },
    { id: 2, name: "Subject 2", percent: "", credits: 5 },
    { id: 3, name: "Subject 3", percent: "", credits: 5 },
  ]);
  const [nextId, setNextId] = useState(4);
  const [useLinear, setUseLinear] = useState(false);

  const updateRow = (id: number, patch: Partial<SubjectRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const addRow = useCallback(() => {
    setRows((prev) => [
      ...prev,
      { id: nextId, name: `Subject ${nextId}`, percent: "", credits: 5 },
    ]);
    setNextId((id) => id + 1);
  }, [nextId]);

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const reset = () => {
    setRows([{ id: 1, name: "Subject 1", percent: "", credits: 5 }]);
    setNextId(2);
    setUseLinear(false);
  };

  const percentToGpa = (p: number) => {
    if (useLinear) return Math.max(0, Math.min(4, (p / 100) * 4));
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

  const totalCredits = rows.reduce(
    (s, r) => s + (typeof r.credits === "number" ? r.credits : 0),
    0
  );

  const weightedPercentSum = rows.reduce(
    (s, r) =>
      s +
      (typeof r.percent === "number" ? r.percent : 0) *
        (typeof r.credits === "number" ? r.credits : 0),
    0
  );

  const weightedGpaSum = rows.reduce((s, r) => {
    const p = typeof r.percent === "number" ? r.percent : 0;
    const c = typeof r.credits === "number" ? r.credits : 0;
    return s + percentToGpa(p) * c;
  }, 0);

  const weightedPercent =
    totalCredits > 0 ? weightedPercentSum / totalCredits : 0;

  const weightedGpa = totalCredits > 0 ? weightedGpaSum / totalCredits : 0;

  useEffect(() => {
    if (rows.length === 0) addRow();
  }, [addRow, rows.length]);

  return (
    <div className="px-4 pt-4 md:px-8 md:pt-8 max-w-5xl mx-auto w-full">
      <div className="mb-6 space-y-1 ">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            GPA Calculator
          </h1>
          <p className="text-muted-foreground font-medium">
            Calculate your GPA easily by entering your subjects, percentages, and credits.
          </p>
        </div>
      <Card className="p-4 md:p-6">
        <CardContent className="px-0">

          {/* BUTTONS */}
          <CardDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <Button
              onClick={addRow}
              variant="default"
              size="sm"
              type="button"
              disabled={rows.length >= 10}
              className="px-4 py-2 bg-primary text-secondary font-medium w-full sm:w-auto"
            >
              + Add subject
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              size="sm"
              type="button"
              disabled={rows.length === 0}
              className="px-4 py-2 text-foreground w-full sm:w-auto"
            >
              Reset
            </Button>
          </CardDescription>

          {/* DESKTOP TABLE */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full table-auto border-collapse text-sm md:text-base">
              <thead className="">
                <tr className="text-left text-foreground/80">
                  <th className="py-2">#</th>
                  <th className="py-2">Subject name</th>
                  <th className="py-2">Percent (%)</th>
                  <th className="py-2">Credits</th>
                  <th className="py-2">GPA</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="">
                {rows.map((r, idx) => {
                  const g = percentToGpa(Number(r.percent) || 0);
                  return (
                    <tr key={r.id} className="border-t border-foreground/10">
                      <td className="py-2 pr-4">{idx + 1}</td>
                      <td className="py-2">
                        <Input
                          value={r.name}
                          className="w-40 p-2 border border-foreground/20 bg-input"
                          onChange={(e) =>
                            updateRow(r.id, { name: e.target.value })
                          }
                        />
                      </td>
                      <td className="py-2">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={r.percent}
                          placeholder="67"
                          className="w-24 p-2 border border-foreground/20 bg-input"
                          onChange={(e) =>
                            updateRow(r.id, {
                              percent:
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td className="py-2">
                        <Input
                          type="number"
                          min={0}
                          value={r.credits}
                          className="w-20 p-2 border border-foreground/20 bg-input"
                          onChange={(e) =>
                            updateRow(r.id, {
                              credits:
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td className="py-2">{g.toFixed(2)}</td>
                      <td className="py-2">
                        <Button
                          onClick={() => removeRow(r.id)}
                          variant="destructive"
                          size="sm"
                          disabled={rows.length === 1}
                          type="button"
                          className="px-2 py-1 text-destructive-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="sm:hidden flex flex-col gap-4">
            {rows.map((r, idx) => {
              const g = percentToGpa(Number(r.percent) || 0);
              return (
                <div
                  key={r.id}
                  className="border border-foreground/20 p-4 rounded-lg bg-card"
                >
                  <div className="text-sm text-foreground/70 mb-2">
                    Subject #{idx + 1}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Input
                      value={r.name}
                      placeholder="Subject..."
                      className="w-full p-2 border border-foreground/20 bg-input"
                      onChange={(e) => updateRow(r.id, { name: e.target.value })}
                    />

                    <Input
                      type="number"
                      value={r.percent}
                      placeholder="Percent... 67%"
                      className="w-full p-2 border border-foreground/20 bg-input"
                      onChange={(e) =>
                        updateRow(r.id, {
                          percent:
                            e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                    />

                    <Input
                      type="number"
                      value={r.credits}
                      placeholder="Credits"
                      className="w-full p-2 border border-foreground/20 bg-input"
                      onChange={(e) =>
                        updateRow(r.id, {
                          credits:
                            e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                    />

                    <div className="text-lg font-bold text-primary">
                      GPA: {g.toFixed(2)}
                    </div>

                    <Button
                      onClick={() => removeRow(r.id)}
                      variant="destructive"
                      size="sm"
                      disabled={rows.length === 1}
                      type="button"
                      className="w-full px-3 py-2 text-secondary"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* STATS */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="p-3 rounded-md shadow-none hover:shadow-lg transition-shadow">
              <CardContent className="px-0">
                <CardTitle className="text-sm font-normal text-foreground/70">Total credits</CardTitle>
                <CardDescription className="text-2xl text-foreground font-bold">{totalCredits}</CardDescription>
              </CardContent>
            </Card>

            <Card className="p-3 rounded-md shadow-none hover:shadow-lg transition-shadow">
              <CardContent className="px-0">
                <CardTitle className="text-sm font-normal text-foreground/70">Total percent</CardTitle>
                <CardDescription className="text-2xl text-primary font-bold">{weightedPercent.toFixed(1)}%</CardDescription>
              </CardContent>
            </Card>

            <Card className="p-3 rounded-md shadow-none hover:shadow-lg transition-shadow">
              <CardContent className="px-0">
                <CardTitle className="text-sm font-normal text-foreground/70">Total GPA</CardTitle>
                <CardDescription className="text-2xl font-bold text-primary">
                  {weightedGpa.toFixed(2)}{" "}
                  <span className={letterColor(gpaToLetter(weightedGpa))}>
                    {gpaToLetter(weightedGpa)}
                  </span>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          <div className="mt-2 text-sm text-foreground text-right">
            <p>
              Credits to{" "}
              <a
                href="https://t.me/Ferum_m"
                className="text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ferumm
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
