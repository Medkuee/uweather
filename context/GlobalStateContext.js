import { createContext, useContext, useEffect, useState } from "react";

const GlobalStateContext = createContext();

export function GlobalStateProvider({ children }) {
  const [globalState, setGlobalState] = useState({
    temperature: "C°",
    distance: "F°",
  });

  const toggleTemperatureUnit = () => {
    setGlobalState((prev) => ({
      ...prev,
      temperature: prev.temperature === "C°" ? "F°" : "C°",
    }));
  };

  const toggleDistanceUnit = () => {
    setGlobalState((prev) => ({
      ...prev,
      distance: prev.distance === "km" ? "mi" : "km",
    }));
  };

  useEffect(() => {
    const savedUnits = localStorage.getItem("units");
    if (savedUnits) {
      setGlobalState(JSON.parse(savedUnits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("units", JSON.stringify(globalState));
  }, [globalState]);

  return (
    <GlobalStateContext.Provider
      value={{ globalState, toggleTemperatureUnit, toggleDistanceUnit }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export const useGlobalState = () => useContext(GlobalStateContext);
