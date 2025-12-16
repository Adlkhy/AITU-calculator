// import necessary libraries and icons
import { Card, CardTitle, CardContent } from "./ui/card";
export default function Footer() {
  return (
    <footer className="text-foreground relative w-full p-4 sm:p-8 font-sans">
      <Card className="mb-4 sm:mb-8 p-4 border border-foreground/50">
        <CardContent className="px-0">
        <CardTitle className="text-foreground text-sm sm:text-base mb-1">ФОРМУЛА РАСЧЁТА ИТОГОВОЙ ОЦЕНКИ:</CardTitle>
        <ul className="list-disc list-inside text-foreground text-sm sm:text-base space-y-1 mb-3">
          <li>Тотал = (регмид * 0,3) + (регэнд * 0,3) + (файнал * 0,4 )</li>
          <li>Регтерм = (регмид + регэнд) / 2</li>
        </ul>
        <CardTitle className="text-foreground text-sm sm:text-base mb-1">УСЛОВИЯ ДОПУСКА / КРИТЕРИЙ:</CardTitle>
        <ul className="list-disc list-inside text-sm sm:text-base text-foreground space-y-1 mb-3">
          <li>Тотал больше 90 — повышенная стипендия (60к)</li>
          <li>Тотал меньше 70 — минус стипендия</li>
          <li>Тотал меньше 50 — летник</li>
          <li>Регтерм меньше 50 — летник</li>
          <li>РегМид меньше 25 — летник</li>
          <li>РегЭнд меньше 25 — летник</li>
        </ul>
        <CardTitle className="text-foreground text-sm sm:text-base mb-1">При обнаружении списывания — <span className="text-primary">ОТЧИСЛЕНИЕ.</span></CardTitle>
        </CardContent>
      </Card>
      <p className="text-center text-foreground text-sm mt-4">
        &copy; 2025. All rights <span className="cursor-pointer" onClick={() => window.location.href = '/term-of-service'}>reserved.</span> Made by <a href="https://t.me/Adlkhy" target="_blank" rel="noopener noreferrer" className="text-primary">Adilkhan.</a>
      </p>
    </footer>
  );
}
