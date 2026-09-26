import React, { createContext, useContext, useEffect, useState } from "react";
import type { Coords } from "@/lib/geo";
import { DEMO_CITIES } from "@/data/seedData";
import { locationService } from "@/services/locationService";
import { toast } from "sonner";

export type LocationContextType = {
  coords: Coords;
  cityName: string;
  isDetecting: boolean;
  detectLocation: () => Promise<void>;
  selectCity: (city: (typeof DEMO_CITIES)[0]) => void;
  selectCoords: (coords: Coords, label?: string) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
};

const DEFAULT_CITY = DEMO_CITIES[0] ?? { name: "Pune - Kothrud", lat: 18.5074, lng: 73.8077, city: "Pune", state: "Maharashtra" };

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coords, setCoords] = useState<Coords>({ latitude: DEFAULT_CITY.lat, longitude: DEFAULT_CITY.lng });
  const [cityName, setCityName] = useState<string>(DEFAULT_CITY.name);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("onestop_location");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lat && parsed.lng && parsed.cityName) {
          setCoords({ latitude: parsed.lat, longitude: parsed.lng });
          setCityName(parsed.cityName);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const detectLocation = async () => {
    setIsDetecting(true);
    try {
      const detected = await locationService.detectBrowserLocation();
      setCoords(detected);
      setCityName("Your Current Location");
      localStorage.setItem("onestop_location", JSON.stringify({ lat: detected.latitude, lng: detected.longitude, cityName: "Current GPS Location" }));
      toast.success("Location updated to your GPS position!");
      setIsLocationModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Could not detect GPS location. Switched to Pune.");
    } finally {
      setIsDetecting(false);
    }
  };

  const selectCity = (city: (typeof DEMO_CITIES)[0]) => {
    selectCoords({ latitude: city.lat, longitude: city.lng }, city.name);
    setIsLocationModalOpen(false);
  };

  const selectCoords = (nextCoords: Coords, label = "Pinned location") => {
    setCoords(nextCoords);
    setCityName(label);
    localStorage.setItem("onestop_location", JSON.stringify({ lat: nextCoords.latitude, lng: nextCoords.longitude, cityName: label }));
    toast.success(`Location set to ${label}`);
  };

  return (
    <LocationContext.Provider
      value={{
        coords,
        cityName,
        isDetecting,
        detectLocation,
        selectCity,
        selectCoords,
        isLocationModalOpen,
        setIsLocationModalOpen,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
};
