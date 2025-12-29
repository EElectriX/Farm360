import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Map from "./Map";
import { PageContext } from "../context/PageContext";
import { FaMapMarkedAlt } from "react-icons/fa";

const EarlyRiskCheck = () => {
  const [position, setPosition] = useState(null);
  const { lang } = useContext(PageContext);
  const navigate = useNavigate();

  const content = {
    ENG: {
      title: "Early Disease Risk Detection",
      subtitle:
        "Select your farm location. We will analyze local soil data and climate patterns to predict potential disease risks.",
      analyzeBtn: "Analyze Soil Risk",
      selectPrompt: "Please select a location on the map first.",
      mapTitle: "Farm Location Selector",
    },
    BENG: {
      title: "আগাম রোগ নির্ণয়",
      subtitle:
        "আপনার খামারের অবস্থান নির্বাচন করুন। আমরা স্থানীয় মাটি এবং আবহাওয়ার তথ্যের ভিত্তিতে সম্ভাব্য রোগের ঝুঁকি বিশ্লেষণ করব।",
      analyzeBtn: "মাটির ঝুঁকি বিশ্লেষণ করুন",
      selectPrompt: "অনুগ্রহ করে প্রথমে মানচিত্রে একটি অবস্থান নির্বাচন করুন।",
      mapTitle: "খামারের অবস্থান নির্বাচক",
    },
    HINDI: {
      title: "प्रारंभिक रोग जोखिम जांच",
      subtitle:
        "अपने खेत का स्थान चुनें। हम संभावित रोग जोखिमों का अनुमान लगाने के लिए स्थानीय मिट्टी और जलवायु डेटा का विश्लेषण करेंगे।",
      analyzeBtn: "जोखिम का विश्लेषण करें",
      selectPrompt: "कृपया पहले मानचित्र पर एक स्थान चुनें।",
      mapTitle: "खेत स्थान चयनकर्ता",
    },
  };

  const text = content[lang] || content.ENG;

  const handleAnalyzeClick = () => {
    if (position) {
      navigate("/result-early", { state: { position: position } });
    } else {
      alert(text.selectPrompt);
    }
  };

  return (
    <div className="w-full min-h-screen bg-green-50/50 flex flex-col items-center py-10">
      <div className="container mx-auto px-4 text-center max-w-4xl mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4 text-green-700">
          <FaMapMarkedAlt size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-green-900 mb-4">
          {text.title}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">{text.subtitle}</p>
      </div>

      <div className="w-full max-w-6xl px-4 h-[60vh] mb-8">
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
          {/* ..... */}
          <Map position={position} setPosition={setPosition} />
        </div>
        <p className="text-center text-sm text-gray-500 mt-2 font-mono">
          {position
            ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`
            : text.mapTitle}
        </p>
      </div>

      <div className="fixed bottom-8 z-50">
        <button
          onClick={handleAnalyzeClick}
          disabled={!position}
          className={`
            px-12 py-4 rounded-full text-xl font-bold shadow-xl transition-all transform 
            ${
              position
                ? "bg-linear-to-r from-green-600 to-green-800 text-white hover:scale-105 hover:shadow-2xl cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {text.analyzeBtn}
        </button>
      </div>
    </div>
  );
};

export default EarlyRiskCheck;
