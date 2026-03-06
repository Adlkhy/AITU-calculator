import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "./ui/input";

const totalWeeks = 10;
const hoursPerClass = 2;

const ProgressBar = ({ percent }: { percent: number }) => {
  let color = "";
  if (percent < 70) color = "bg-red-400";
  else if (percent < 90) color = "bg-yellow-400";
  else color = "bg-green-400";

  return (
    <div className="w-full bg-accent h-6 rounded-md overflow-hidden">
      <div
        className={`${color} h-full`}
        style={{ width: `${percent}%`, transition: "width 0.3s" }}
      />
    </div>
  );
};

export default function AttendanceTracker() {
  const [classesPerWeek, setClassesPerWeek] = useState("2");
  const [missedClasses, setMissedClasses] = useState("0");
  const [attendancePercent, setAttendancePercent] = useState(100);
  const [totalHours, setTotalHours] = useState(2 * hoursPerClass * totalWeeks);
  const [missedHours, setMissedHours] = useState(0);

  useEffect(() => {
    const classesPerWeekNum = parseFloat(classesPerWeek) || 0;
    const missedClassesNum = parseFloat(missedClasses) || 0;

    const total = classesPerWeekNum * hoursPerClass * totalWeeks;
    const missed = missedClassesNum * hoursPerClass;
    const percent = total > 0 ? ((total - missed) / total) * 100 : 0;

    setTotalHours(total);
    setMissedHours(missed);
    setAttendancePercent(Math.max(0, percent));
  }, [classesPerWeek, missedClasses]);

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-6 space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Attendance Tracker
          </h1>
          <p className="text-muted-foreground font-medium">
            Calculate and monitor your attendance percentage easily.
          </p>
        </div>
      <Card className="p-6">
        <CardContent className="px-0">
          <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 mb-6">
            <div className="flex flex-col sm:flex-1">
              <label className="text-foreground font-semibold mb-1">
                Pairs per week:
              </label>
              <Input
                type="number"
                min={0}
                max={50}
                value={classesPerWeek}
                onChange={(e) => setClassesPerWeek(e.target.value)}
                className="w-full md:text-lg! bg-input font-mono text-accent-foreground pr-2 border border-foreground/20 rounded-md"
              />
            </div>

            <div className="flex flex-col sm:flex-1 mt-2 sm:mt-0">
              <label className="text-foreground font-semibold mb-1">
                Missed pairs:
              </label>
              <Input
                type="number"
                min={0}
                max={50}
                value={missedClasses}
                onChange={(e) => setMissedClasses(e.target.value)}
                className="w-full md:text-lg! bg-input font-mono text-accent-foreground pr-2 border border-foreground/20 rounded-md"
              />
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-lg text-foreground">Attendance:</p>
            <p className="text-4xl font-bold font-mono text-primary">
              {attendancePercent.toFixed(1)}%
            </p>
          </div>

          <ProgressBar percent={attendancePercent} />

          <CardDescription className="mt-4 text-sm grid grid-cols-1 sm:grid-cols-2 sm:gap-1 text-foreground text-left">
            <p>Total course hours: {totalHours}h</p>
            <p>Missed hours: {missedHours}h</p>
            <p>1 pair = {hoursPerClass} hours</p>
            <p>Total weeks: {totalWeeks}</p>
          </CardDescription>
          <div className="mt-2 text-sm text-foreground text-right">
            <p>Credits to <a href="https://t.me/Ferum_m" className="text-primary" target="_blank" rel="noopener noreferrer">Ferumm</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}