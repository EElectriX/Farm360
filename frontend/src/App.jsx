import { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

// Components
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";


// Pages
import PredictDisease from "./pages/PredictDisease";
import PdRice from "./pages/PdRice";
import Result from "./pages/Result";
import PdPotato from "./pages/PdPotato";
import PdWheat from "./pages/PdWheat";
import EarlyRiskCheck from "./pages/EarlyRiskCheck";
import ResultEarly from "./pages/ResultEarly";
import CropRecommendation from "./pages/CropRecommendation";
import Loader from "./components/Loader";
import Prediction_Goal_3 from "./pages/Prediction_Goal_3";
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }


  return (
    <>
      <div className="min-h-screen flex flex-col"> 
        <NavBar />
        
        {/* Main content wrapper */}
        <div className="grow">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/predict-disease" element={<PredictDisease />}></Route>
            {/* <Route path="/predict-disease/rice" element={<PdRice />}></Route>
            <Route path="/predict-disease/potato" element={<PdPotato />}></Route>
            <Route path="/predict-disease/wheat" element={<PdWheat/>}></Route> */}
            <Route path="/early-disease-prediction" element={<EarlyRiskCheck/>}></Route>
            <Route path="/result-early" element={<ResultEarly />} />
            <Route path="/crop-recommendation" element={<CropRecommendation />} />
            <Route path="/result" element={<Result/>}></Route>
            <Route path="/predict-disease/:crop" element={<Prediction_Goal_3/>}></Route>
          </Routes>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default App;