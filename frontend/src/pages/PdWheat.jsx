import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Map from "./Map";
import {
  FaCloudUploadAlt,
  FaImage,
  FaTemperatureHigh,
  FaTint,
  FaCloudRain,
} from "react-icons/fa";
import { GiChemicalDrop } from "react-icons/gi";
import { PageContext } from "../context/PageContext";
import { MdDeleteForever } from "react-icons/md";

const PdWheat = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // State for Map Location and Environment Data
  const [position, setPosition] = useState(null);
  const [envData, setEnvData] = useState(null);

  const { lang } = useContext(PageContext);
  const navigate = useNavigate();

  // --- MOCK DATA FETCHING (Adjusted for Wheat - cooler/drier) ---
  useEffect(() => {
    if (position) {
      setEnvData({
        temp: "18°C", // Wheat is often a winter crop
        humidity: "60%",
        rainfall: "35 mm",
        ph: "6.2",
      });
    }
  }, [position]);

  const content = {
    ENG: {
      title: "Wheat Disease Detection",
      uploadTitle: "Upload Wheat Leaf Image",
      clickToUpload: "Click to upload",
      fileType: "SVG, PNG, JPG or GIF (MAX. 5MB)",
      previewTitle: "Image Preview",
      clear: "Clear",
      noImage: "No image selected",
      analyzeBtn: "Analyze Image",
      mapTitle: "Select Farm Location",
      envTitle: "Environmental Analysis",
      lblTemp: "Temperature",
      lblHum: "Humidity",
      lblRain: "Rainfall",
      lblPh: "Soil pH",
      locSelected: "Location Selected:",
    },
    BENG: {
      title: "গম গাছের রোগ নির্ণয়",
      uploadTitle: "গম পাতার ছবি আপলোড করুন",
      clickToUpload: "আপলোড করতে ক্লিক করুন",
      fileType: "SVG, PNG, JPG অথবা GIF (সর্বোচ্চ ৫ MB)",
      previewTitle: "ছবির প্রিভিউ",
      clear: "মুছুন",
      noImage: "কোন ছবি নির্বাচন করা হয়নি",
      analyzeBtn: "ছবি বিশ্লেষণ করুন",
      mapTitle: "খামারের অবস্থান নির্বাচন করুন",
      envTitle: "পরিবেশগত বিশ্লেষণ",
      lblTemp: "তাপমাত্রা",
      lblHum: "আর্দ্রতা",
      lblRain: "বৃষ্টিপাত",
      lblPh: "মাটির pH",
      locSelected: "নির্বাচিত অবস্থান:",
    },
    HINDI: {
      title: "गेहूं रोग की पहचान",
      uploadTitle: "गेहूं की पत्ती की छवि अपलोड करें",
      clickToUpload: "अपलोड करने के लिए क्लिक करें",
      fileType: "SVG, PNG, JPG या GIF (अधिकतम 5MB)",
      previewTitle: "छवि पूर्वावलोकन",
      clear: "हटाएं",
      noImage: "कोई छवि चुनी नहीं गई",
      analyzeBtn: "छवि का विश्लेषण करें",
      mapTitle: "खेत का स्थान चुनें",
      envTitle: "पर्यावरण विश्लेषण",
      lblTemp: "तापमान",
      lblHum: "नमी",
      lblRain: "वर्षा",
      lblPh: "मिट्टी का पीएच",
      locSelected: "चयनित स्थान:",
    },
  };

  const text = content[lang] || content.ENG;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAnalyzeClick = () => {
    if (previewUrl) {
      navigate("/result", { state: { image: previewUrl } });
    }
  };

  // Helper component for Info Cards
  const InfoCard = ({ icon, label, value, color }) => (
    <div
      className="bg-white p-6 rounded-xl shadow-md border-l-4 hover:shadow-xl transition-all duration-300 flex items-center gap-4 group"
      style={{ borderColor: color }}
    >
      <div
        className={`p-4 rounded-full bg-opacity-10 group-hover:scale-110 transition-transform`}
        style={{ backgroundColor: color }}
      >
        {React.cloneElement(icon, { size: 28, style: { color: color } })}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-semibold">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-amber-600/40 flex flex-col pb-12">
      {/* UPLOAD SECTION */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
          {text.title}
        </h1>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row h-[50vh]">
          {/* LEFT SIDE: Input */}
          <div className="w-full md:w-1/2 p-8 bg-green-50 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-green-100">
            <h2 className="text-xl font-semibold text-green-800 mb-6">
              {text.uploadTitle}
            </h2>

            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-green-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaCloudUploadAlt className="w-12 h-12 mb-4 text-green-500" />
                <p className="mb-2 text-sm text-gray-500 font-semibold">
                  {text.clickToUpload}
                </p>
                <p className="text-xs text-gray-500">{text.fileType}</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* RIGHT SIDE: Preview */}
          <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center items-center relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 absolute top-6">
              {text.previewTitle}
            </h2>

            {previewUrl ? (
              <div className="relative w-full h-full flex items-center justify-center pb-12 pt-16">
                <img
                  src={previewUrl}
                  alt="Selected Crop"
                  className="max-h-full max-w-full rounded-lg shadow-md object-contain"
                />

                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-200 transition-colors shadow-sm"
                >
                  <span className="flex items-center gap-1">
                    <MdDeleteForever size={18} />
                    {text.clear}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-300">
                <FaImage className="w-24 h-24 mb-4" />
                <p className="text-lg">{text.noImage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        {selectedImage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleAnalyzeClick}
              className="bg-green-700 text-white px-10 py-3 rounded-full text-lg font-bold hover:bg-green-800 shadow-lg hover:scale-105 transition-all"
            >
              {text.analyzeBtn}
            </button>
          </div>
        )}
      </div>

      <hr className="my-8 border-gray-300" />

      {/* MAP COMPONENT */}
      <div className="w-full px-4">
        <h2 className="text-4xl font-bold text-center text-green-800 mb-6">
          {text.mapTitle}
        </h2>
        <Map position={position} setPosition={setPosition} />
      </div>

      {/* ENVIRONMENTAL INFO */}
      {position && envData && (
        <div className="container mx-auto px-4 mt-12 animate-fade-in-up pb-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {text.envTitle}
            </h2>
            <p className="text-green-800 font-mono mt-2 bg-white/50 inline-block px-4 py-1 rounded-full">
              {text.locSelected} {position.lat.toFixed(4)},{" "}
              {position.lng.toFixed(4)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <InfoCard
              icon={<FaTemperatureHigh />}
              label={text.lblTemp}
              value={envData.temp}
              color="#ef4444"
            />
            <InfoCard
              icon={<FaTint />}
              label={text.lblHum}
              value={envData.humidity}
              color="#3b82f6"
            />
            <InfoCard
              icon={<FaCloudRain />}
              label={text.lblRain}
              value={envData.rainfall}
              color="#6366f1"
            />
            <InfoCard
              icon={<GiChemicalDrop />}
              label={text.lblPh}
              value={envData.ph}
              color="#10b981"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PdWheat;
