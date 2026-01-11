import { useState } from "react";
import { Navbar08 } from "../components/Navbar2";
import Footer from "../components/Footer";
import Programming from "../components/Programming";
import English from "../components/English";
import Sociology from "../components/Sociology";
import DiscreteMath from "../components/DiscreateMath";
import Psychology from "../components/Psychology";
import ICT from "../components/ICT";
import Dynamic from "../components/Dynamic";
import Budget from "../components/Budget";
import Attendance from "../components/Attendance";
import GPA from "../components/GPA";

export default function MainCalculator() {
  const subjects = [
    "Dynamic",
    "Attendance",
    "GPA",
    "Budget",
    "Programming",
    "Sociology",
    "Discrete Math",
    "Psychology",
    "English",
    "ICT",
  ];
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);

  const renderCalculator = () => {
    switch (selectedSubject) {
      case "Dynamic":
        return <Dynamic />;
      case "Attendance":
        return <Attendance />;
      case "Budget":
        return <Budget />;
      case "GPA":
        return <GPA />;
      case "Programming":
        return <Programming />;
      case "Sociology":
        return <Sociology />;
      case "Discrete Math":
        return <DiscreteMath />;
      case "Psychology":
        return <Psychology />;
      case "English":
        return <English />;
      case "ICT":
        return <ICT />;
      default:
        return <p>Please select a subject</p>;
    }
  };

  return (
    <>
      <Navbar08
        subjects={subjects}
        selectedSubject={selectedSubject}
        onSelectSubject={setSelectedSubject}
      />
      <div className="text-foreground min-h-screen font-sans">
        <div className="max-w-5xl mx-auto min-h-screen p-4 sm:p-8">
          <main className="">{renderCalculator()}</main>
        </div>
        <Footer />
      </div>
    </>
  );
}
