import React, { useContext } from "react";
import { Link } from "react-router-dom";
import homeBgImg from "../assets/homebg.jpg";
import { PageContext } from "../context/PageContext";

// Importing specific icons for the crops
import { GiGrain, GiPotato, GiWheat } from "react-icons/gi";

const PredictDisease = () => {
  const { lang } = useContext(PageContext);

  const content = {
    ENG: {
      pageTitle: "Select Crop for Diagnosis",
      riceTitle: "Rice",
      riceDesc: "Detect diseases in Rice plants.",
      potatoTitle: "Potato",
      potatoDesc: "Analyze Potato leaves for defects.",
      wheatTitle: "Wheat",
      wheatDesc: "Identify health issues in Wheat.",
    },
    BENG: {
      pageTitle: "রোগ নির্ণয়ের জন্য ফসল নির্বাচন করুন",
      riceTitle: "ধান",
      riceDesc: "ধান গাছের রোগ নির্ণয় করুন।",
      potatoTitle: "আলু",
      potatoDesc: "আলু পাতার ত্রুটি বিশ্লেষণ করুন।",
      wheatTitle: "গম",
      wheatDesc: "গম গাছের স্বাস্থ্য সমস্যা চিহ্নিত করুন।",
    },
    HINDI: {
      pageTitle: "निदान के लिए फसल चुनें",
      riceTitle: "धान",
      riceDesc: "धान के पौधों में रोगों का पता लगाएं।",
      potatoTitle: "आलू",
      potatoDesc: "आलू की पत्तियों में दोषों का विश्लेषण करें।",
      wheatTitle: "गेहूं",
      wheatDesc: "गेहूं में स्वास्थ्य समस्याओं की पहचान करें।",
    },
  };

  const text = content[lang] || content.ENG;

  const boxClasses = `
    flex flex-col justify-center items-center 
    w-full md:w-80 h-52 
    bg-white/90 backdrop-blur-md 
    rounded-2xl shadow-xl border-2 border-transparent 
    hover:border-green-500 hover:shadow-2xl hover:-translate-y-1 
    transition-all duration-300 ease-in-out 
    p-6 cursor-pointer group
  `;

  const titleClasses = `
    text-2xl font-bold text-green-800 mb-2 group-hover:text-green-600 transition-colors
  `;

  return (
    <div className="relative h-[85vh] w-full flex flex-col justify-center items-center overflow-hidden">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 scale-110"
        style={{
          backgroundImage: `url(${homeBgImg})`,
          filter: "blur(8px)",
        }}
      />

      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 flex flex-col items-center w-full px-4">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-12 drop-shadow-lg text-center">
          {text.pageTitle}
        </h1>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full place-items-center">
          {/* --- Box 1: Rice --- */}
          <Link to="/predict-disease/Rice" className={boxClasses}>
            <div className="bg-amber-200 p-4 rounded-full inline-flex items-center justify-center">
              <GiGrain className="text-green-800 text-4xl animate-bounce" />
            </div>
            <h2 className={titleClasses}>{text.riceTitle}</h2>
            <p className="text-gray-700 text-center font-medium">
              {text.riceDesc}
            </p>
          </Link>

          {/* --- Box 2: Potato --- */}
          <Link to="/predict-disease/Potato" className={boxClasses}>
            <div className="bg-amber-200 p-4 rounded-full inline-flex items-center justify-center">
              <GiPotato className="text-green-800 text-4xl animate-bounce" />
            </div>
            <h2 className={titleClasses}>{text.potatoTitle}</h2>
            <p className="text-gray-700 text-center font-medium">
              {text.potatoDesc}
            </p>
          </Link>

          {/* --- Box 3: Wheat --- */}
          <Link to="/predict-disease/Wheat" className={boxClasses}>
            <div className="bg-amber-200 p-4 rounded-full inline-flex items-center justify-center">
              <GiWheat className="text-green-800 text-4xl animate-bounce" />
            </div>
            <h2 className={titleClasses}>{text.wheatTitle}</h2>
            <p className="text-gray-700 text-center font-medium">
              {text.wheatDesc}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PredictDisease;
