import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { PageContext } from "../context/PageContext";
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaRobot } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { GiChemicalDrop } from "react-icons/gi";
import { FaTemperatureHigh, FaTint, FaCloudRain } from "react-icons/fa";
const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { lang } = useContext(PageContext);
  // console.log(state);
  const { file, crop, lat, lng, image } = state || {};
  // console.log(navigate);

  // --- test DATA ---
const [result, setResult] = useState({
  loading: true,
  score: 0,
  final_prediction: "",
  image_prediction: {
    confidence: "",
    prediction: "",
  },
  weather_prediction: null, // ✅ correct
});


  useEffect(() => {
    if (!state?.image) {
      navigate("/");
      return;
    }




    // API call for prediction

   const fetchPrediction = async () => {
  setResult(prev => ({ ...prev, loading: true }));

  const formData = new FormData();
  formData.append("file", file);

  if (lat && lng) {
    formData.append("lat", lat);
    formData.append("lon", lng);
  }
  // console.log(formData);
  for (let [key, value] of formData.entries()) {
  console.log(key, value);
}

  console.log(lat+" "+lng);
  const res = await fetch(
    `http://127.0.0.1:5000/predict/goal3/${crop}`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  console.log(data);
  if (data.error) {
    alert(data.error);
    navigate("/");
    return;
  }

  // ✅ calculate score
  const conf = parseInt(data.image_prediction?.confidence || 0);
  let pred_score = 1;
  if (conf >= 35 && conf < 75) pred_score = 2;
  if (conf >= 75) pred_score = 3;

  // ✅ UPDATE STATE (NO setTimeout)
  setResult({
    loading: false,
    score: pred_score,
    final_prediction: data.final_prediction,

    image_prediction: {
      prediction: data.image_prediction.prediction,
      confidence: conf,
    },

    weather_prediction: data.weather_prediction
      ? {
        // both
          humidity: data.weather_prediction.inputs.humidity ?? "",
          temperature: data.weather_prediction.inputs.temperature ?? "",
          prediction:data.weather_prediction.prediction ?? "",

          // for wheat rice 
          rainfall_mm: data.weather_prediction.inputs.rainfall_mm ?? "",
          ph: data.weather_prediction.inputs.soil_ph ?? "",
          wind_speed: data.weather_prediction.inputs.wind_speed ?? "",
          // for potato 
            pressure: data.weather_prediction.inputs.pressure ?? "",
            visibility: data.weather_prediction.inputs.visibility ?? "",
            wind_bearing: data.weather_prediction.inputs.wind_bearing ?? ""
        }
      : null,
  });
};




fetchPrediction();
console.log(result);

    // const timer = setTimeout(() => {
    //   setResult({
    //     loading: false,
    //     score: 3, // <---  levels
    //     description:
    //       "Based on the visual analysis, the model has detected symptoms consistent with Leaf Blast disease. The lesion patterns strongly match our database. However, please verify with a local expert if symptoms persist.",
    //   });
    // }, 1500);

    // return () => clearTimeout(timer);
  }, [state, navigate]);

  // --- LANGUAGE CONTENT ---
  const content = {
    ENG: {
      title: "Analysis Result",
      analyzing: "Analyzing Image...",
      back: "Back to Upload",
      confidenceHeader: "AI Prediction Quality",
      levels: ["Low Confidence", "Average Confidence", "High Confidence"],
      descTitle: "Diagnosis Report",
    },
    BENG: {
      title: "বিশ্লেষণের ফলাফল",
      analyzing: "ছবি বিশ্লেষণ করা হচ্ছে...",
      back: "ফিরে যান",
      confidenceHeader: "AI পূর্বাভাসের গুণমান", 
      levels: ["কম নির্ভরযোগ্য", "মাঝারি নির্ভরযোগ্য", "উচ্চ নির্ভরযোগ্য"],
      descTitle: "রোগ নির্ণয়ের রিপোর্ট",
    },
    HINDI: {
      title: "विश्लेषण परिणाम",
      analyzing: "छवि का विश्लेषण...",
      back: "वापस जाएं",
      confidenceHeader: "AI भविष्यवाणी की गुणवत्ता", 
      levels: ["कम आत्मविश्वास", "औसत आत्मविश्वास", "उच्च आत्मविश्वास"],
      descTitle: "निदान रिपोर्ट",
    },
  };

  const WEATHER_FIELDS = [
  { key: "prediction", label: "Prediction From Weather", icon: <GiChemicalDrop />, color: "#10b981" },
  { key: "temperature", label: "Temperature (°C)", icon: <FaTemperatureHigh />, color: "#ef4444" },
  { key: "humidity", label: "Humidity (%)", icon: <FaTint />, color: "#3b82f6" },
  { key: "rainfall_mm", label: "Rainfall (mm)", icon: <FaCloudRain />, color: "#6366f1" },
  { key: "wind_speed", label: "Wind Speed (m/s)", icon: <GiChemicalDrop />, color: "#10b981" },
  { key: "ph", label: "Soil pH", icon: <GiChemicalDrop />, color: "#16a34a" },
  { key: "pressure", label: "Pressure (hPa)", icon: <GiChemicalDrop />, color: "#0ea5e9" },
  { key: "visibility", label: "Visibility (km)", icon: <GiChemicalDrop />, color: "#8b5cf6" },
  { key: "wind_bearing", label: "Wind Direction (°)", icon: <GiChemicalDrop />, color: "#f97316" },
];

  const text = content[lang] || content.ENG;
const InfoCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 hover:shadow-xl transition-all duration-300 flex items-center gap-4 group" style={{ borderColor: color }}>
      <div className={`p-4 rounded-full bg-opacity-10 group-hover:scale-110 transition-transform`} style={{ backgroundColor: color }}>
        {React.cloneElement(icon, { size: 28, style: { color: color } })}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-semibold">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  // ---  STATUS BAR ---
  const renderStatusBar = () => {
    const { score } = result;
    const baseClass = "h-4 rounded-full transition-all duration-500 flex-1";
    
    return (
      <div className="flex flex-col gap-2 w-full mt-4">
        {/* Labels */}
        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
          <span className={score === 1 ? "text-red-600 scale-110" : ""}>{text.levels[0]}</span>
          <span className={score === 2 ? "text-yellow-600 scale-110" : ""}>{text.levels[1]}</span>
          <span className={score === 3 ? "text-green-700 scale-110" : ""}>{text.levels[2]}</span>
        </div>

        {/* The Bar */}
        <div className="flex gap-2 bg-gray-200 p-1 rounded-full h-8 items-center shadow-inner">
          {/*  1 */}
          <div className={`${baseClass} ${score === 1 ? "bg-red-500 shadow-lg scale-105 ring-2 ring-red-300" : "bg-red-200 opacity-40"}`}></div>
          
          {/* 2*/}
          <div className={`${baseClass} ${score === 2 ? "bg-yellow-400 shadow-lg scale-105 ring-2 ring-yellow-300" : "bg-yellow-200 opacity-40"}`}></div>
          
          {/* 3*/}
          <div className={`${baseClass} ${score === 3 ? "bg-green-500 shadow-lg scale-105 ring-2 ring-green-300" : "bg-green-200 opacity-40"}`}></div>
        </div>
      </div>
    );
  };

  if (result.loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 animate-pulse">{text.analyzing}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        
        {/* Back Button */}
        <Link to={`/predict-disease/${state.crop}`} className="inline-flex items-center text-gray-600 hover:text-green-700 font-semibold mb-6 transition-colors">
          <FaArrowLeft className="mr-2" /> {text.back}
        </Link>

        <h1 className="text-4xl font-bold text-green-900 mb-8 text-center">{text.title}</h1>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* --- LEFT --- */}
          <div className="w-full md:w-1/2 bg-gray-100 p-6 flex justify-center items-center">
             <div className="relative group">
                <img 
                  src={state.image} 
                  alt="Analyzed Crop" 
                  className="rounded-lg shadow-md max-h-[400px] object-contain border-4 border-white"
                />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  Uploaded Image
                </div>
             </div>
          </div>

          {/* --- RIGHT --- */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            
            {/* H */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2 text-gray-400">
                <FaRobot />
                <h2 className="text-sm font-bold uppercase tracking-widest">
                  {text.confidenceHeader}
                </h2>
              </div>
              
              {/* ICON */}
              <div className="flex items-center gap-3 mb-4">
                {result.score === 1 && <FaTimesCircle className="text-red-500 text-5xl" />}
                {result.score === 2 && <FaExclamationTriangle className="text-yellow-500 text-5xl" />}
                {result.score === 3 && <FaCheckCircle className="text-green-500 text-5xl" />}
                
                <span className={`text-3xl font-extrabold ${
                  result.score === 1 ? "text-red-600" : 
                  result.score === 2 ? "text-yellow-600" : "text-green-600"
                }`}>
                   {text.levels[result.score - 1]}
                </span>
              </div>

              {/* The 3-Level Bar */}
              {renderStatusBar()}
            </div>

            <hr className="border-gray-200 mb-6" />

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{text.descTitle}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {result.final_prediction}
              </p>
            </div>

          </div>

        
        </div>

          {/* show weather info if lat lng available */}
          

           {/* ENVIRONMENTAL INFO */}
      {result.weather_prediction && lat && lng &&(
        <div className="container mx-auto px-4 mt-12 animate-fade-in-up pb-10">
           <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Weather Details Of Location</h2>
              <p className="text-green-800 font-mono mt-2 bg-white/50 inline-block px-4 py-1 rounded-full">
                {text.locSelected} {lat.toFixed(4)}, {lng.toFixed(4)}
              </p>
           </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {WEATHER_FIELDS.map(({ key, label, icon, color }) =>
        result.weather_prediction[key] !== "" ? (
          <InfoCard
            key={key}
            icon={icon}
            label={label}
            value={result.weather_prediction[key]}
            color={color}
          />
        ) : null
      )}
    </div>
        </div>
        // <>hi</>
      )}



      </div>
    </div>
  );
};

export default Result;