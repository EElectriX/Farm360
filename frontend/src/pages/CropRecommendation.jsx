import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { PageContext } from "../context/PageContext";
import { FaTractor, FaArrowLeft } from "react-icons/fa";
import { GiSprout } from "react-icons/gi";

const CropRecommendation = () => {
  const { lang } = useContext(PageContext);

  const content = {
    ENG: {
      title: "Crop Recommendation",
      status: "Coming Soon",
      message: "We are currently working on to build this AI feature.",
      backBtn: "Back to Home",
    },
    BENG: {
      title: "ফসলের সুপারিশ",
      status: "শীঘ্রই আসছে",
      message: "আমরা বর্তমানে এই এআই ফিচারটি তৈরি করছি। ",
      backBtn: "হোমে ফিরে যান",
    },
    HINDI: {
      title: "फसल सुझाव",
      status: "जल्द आ रहा है",
      message: "हम वर्तमान में इस एआई सुविधा को बनाने के लिए कड़ी मेहनत कर रहे हैं। ",
      backBtn: "होम पर वापस जाएं",
    },
  };

  const text = content[lang] || content.ENG;

  return (
    <div className="min-h-[85vh] w-full flex flex-col justify-center items-center bg-green-50 px-4">
      
      {/* -- */}
      <div className="relative mb-8">
        <div className="absolute -top-4 -right-4 animate-bounce">
          <GiSprout className="text-green-500 text-4xl" />
        </div>
        <div className="bg-white p-8 rounded-full shadow-xl border-4 border-green-100">
          <FaTractor className="text-green-700 text-6xl md:text-8xl" />
        </div>
      </div>

      {/* Text */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-green-900 mb-2 text-center">
        {text.status}
      </h1>
      
      <h2 className="text-xl md:text-2xl font-semibold text-green-700 mb-6 text-center">
        {text.title}
      </h2>

      <p className="text-gray-600 text-center max-w-lg text-lg mb-10 leading-relaxed">
        {text.message}
      </p>


      <Link 
        to="/" 
        className="flex items-center gap-2 bg-green-700 text-white px-8 py-3 rounded-full font-bold hover:bg-green-800 transition-transform hover:scale-105 shadow-lg"
      >
        <FaArrowLeft />
        {text.backBtn}
      </Link>

    </div>
  );
};

export default CropRecommendation;