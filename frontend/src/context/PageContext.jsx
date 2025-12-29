import { createContext, useState } from "react";

export const PageContext = createContext();

export default function PageContextProvider({ children }) {
  const [lang, setLang] = useState("ENG");

  const contextValue = {
    lang,
    setLang,
  };

  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
}
