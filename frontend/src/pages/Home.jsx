import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import homeBgImg from "../assets/homebg.jpg";
import { GiZigzagLeaf, GiPlantRoots } from "react-icons/gi";
import { PageContext } from "../context/PageContext";
import { useUser } from "@clerk/clerk-react";

const Home = () => {
  const { lang } = useContext(PageContext);

  const { user, isSignedIn } = useUser();

  const content = {
    ENG: {
      cropTitle: "Crop Recommendation",
      cropDesc: "Get analysis based on your soil and climate data.",
      earlyTitle: "Early Risk Check",
      earlyDesc: "Predict disease risks early using soil parameters.",
      predictTitle: "Predict Disease",
      predictDesc: "Upload images to identify potential crop diseases.",
    },
    BENG: {
      cropTitle: "ফসলের সুপারিশ",
      cropDesc: "আপনার মাটি এবং আবহাওয়ার তথ্যের ভিত্তিতে বিশ্লেষণ পান।",
      earlyTitle: "আগাম সতর্কতা",
      earlyDesc: "মাটির তথ্যের ভিত্তিতে রোগের আগাম ঝুঁকি নির্ণয় করুন।",
      predictTitle: "রোগ নির্ণয়",
      predictDesc: "সম্ভাব্য ফসলের রোগ শনাক্ত করতে ছবি আপলোড করুন।",
    },
    HINDI: {
      cropTitle: "फसल सुझाव",
      cropDesc: "अपनी मिट्टी और जलवायु डेटा के आधार पर विश्लेषण प्राप्त करें।",
      earlyTitle: "प्रारंभिक जोखिम जांच",
      earlyDesc: "मिट्टी के मापदंडों का उपयोग करके रोगों का पूर्व अनुमान लगाएं।",
      predictTitle: "रोग की पहचान",
      predictDesc: "संभावित फसल रोगों की पहचान करने के लिए चित्र अपलोड करें।",
    },
  };

  const text = content[lang] || content.ENG;

  const getWelcomeMessage = () => {
    if (lang === "ENG") {
      return isSignedIn && user?.firstName
        ? `Welcome ${user.firstName} to Agri-Assist`
        : "Welcome to Agri-Assist";
    } else if (lang === "HINDI") {
      return isSignedIn && user?.firstName
        ? `एग्री-असिस्ट में आपका स्वागत है, ${user.firstName}`
        : "एग्री-असिस्ट में आपका स्वागत है";
    } else {
      // Default to Bengali for 'BENG'
      return isSignedIn && user?.firstName
        ? `এগ্রি-অ্যাসিস্ট-এ স্বাগতম, ${user.firstName}`
        : "এগ্রি-অ্যাসিস্ট-এ আপনাকে স্বাগতম";
    }
  };

  const boxClasses = `
    flex flex-col justify-center items-center 
    w-full h-52 
    bg-white/90 backdrop-blur-md 
    rounded-2xl shadow-xl border-2 border-transparent 
    hover:border-green-500 hover:shadow-2xl hover:-translate-y-1 
    transition-all duration-300 ease-in-out 
    p-6 cursor-pointer group
  `;

  const titleClasses = `
    text-2xl font-bold text-green-800 mb-2 group-hover:text-green-600 transition-colors text-center
  `;

  return (
    <div className="relative h-[85vh] w-full flex flex-col justify-center items-center overflow-hidden">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 scale-110 transition-transform duration-1000"
        style={{
          backgroundImage: `url(${homeBgImg})`,
          filter: "blur(8px)",
        }}
      />

      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 flex flex-col items-center w-full px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-12 drop-shadow-lg text-center">
          {getWelcomeMessage()}
        </h1>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full place-items-center">
          
          {/* --- Box 1: Crop Recommendation --- */}
          <Link to="/crop-recommendation" className={boxClasses}>
            <div className="bg-amber-200 p-4 rounded-full inline-flex items-center justify-center mb-3">
              <FaLeaf className="text-green-800 text-4xl animate-bounce" />
            </div>
            <h2 className={titleClasses}>{text.cropTitle}</h2>
            <p className="text-gray-700 text-center font-medium text-sm">
              {text.cropDesc}
            </p>
          </Link>

          {/* --- Box 2: Early Disease Prediction (Soil) --- */}
          <Link to="/early-disease-prediction" className={boxClasses}>
            <div className="bg-amber-200 p-4 rounded-full inline-flex items-center justify-center mb-3">
              <GiPlantRoots className="text-green-800 text-4xl animate-bounce" />
            </div>
            <h2 className={titleClasses}>{text.earlyTitle}</h2>
            <p className="text-gray-700 text-center font-medium text-sm">
              {text.earlyDesc}
            </p>
          </Link>

          {/* --- Box 3: Predict Disease (Image) --- */}
          <Link to="/predict-disease" className={boxClasses}>
            <div className="bg-amber-200 p-4 rounded-full inline-flex items-center justify-center mb-3">
              <GiZigzagLeaf className="text-green-800 text-4xl animate-bounce" />
            </div>
            <h2 className={titleClasses}>{text.predictTitle}</h2>
            <p className="text-gray-700 text-center font-medium text-sm">
              {text.predictDesc}
            </p>
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default Home;