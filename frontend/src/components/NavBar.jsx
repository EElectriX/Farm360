import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { SiOverleaf } from "react-icons/si";
import { PageContext } from "../context/PageContext";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const NavBar = () => {
  const { lang, setLang } = useContext(PageContext);

  const navContent = {
    ENG: {
      brand: "Agri-Assist",
      home: "Home",
      feature: "Feature",
      login: "Log In",
    },
    BENG: {
      brand: "এগ্রি-অ্যাসিস্ট",
      home: "হোম",
      feature: "ফিচার",
      login: "লগ ইন",
    },
    HINDI: {
      brand: "एग्री-असिस्ट",
      home: "होम",
      feature: "फीचर",
      login: "लॉग इन",
    },
  };

  const text = navContent[lang] || navContent.ENG;

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-yellow-300 shadow-md text-lg">
      {/* Left */}
      <div className="text-4xl font-bold text-green-800 cursor-pointer flex">
        <Link to="/" className="flex">
          <SiOverleaf />
          <span className="ml-2">{text.brand}</span>
        </Link>
      </div>

      {/* Right  */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-yellow-800 hover:text-yellow-600 transition-colors font-bold"
        >
          {text.home}
        </Link>

        <Link
          to="/feature"
          className="text-yellow-800 hover:text-yellow-600 transition-colors font-bold"
        >
          {text.feature}
        </Link>

        {/* Dropdown */}
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="px-3 py-1 border border-yellow-400 rounded-md text-sm bg-yellow-100 text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 font-semibold cursor-pointer"
        >
          <option value="ENG" className="font-semibold">
            ENG
          </option>
          <option value="BENG" className="font-semibold">
            BENG
          </option>
          <option value="HINDI" className="font-semibold">
            HINDI
          </option>
        </select>

        {/* Clerk  */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-green-700 text-white px-4 py-1.5 rounded-full font-bold hover:bg-green-800 transition-all shadow-sm text-base">
              {text.login}
            </button>
          </SignInButton>
        </SignedOut>

        {/* logged in */}
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-16 h-16",
                avatarImage: "w-16 h-16",
              },
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
};

export default NavBar;