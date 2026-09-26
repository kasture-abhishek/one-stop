import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Check } from "lucide-react";
import { useLocation } from "@/context/locationContext";
import { DEMO_CITIES } from "@/data/seedData";
import { LocationMap } from "@/components/location/LocationMap";

export const LocationModal: React.FC = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, cityName, coords, selectCity, selectCoords, detectLocation, isDetecting } = useLocation();

  return (
    <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="w-5 h-5 text-orange-600" />
            Choose Your Location
          </DialogTitle>
          <DialogDescription>
            Select a nearby hub to discover local home kitchens and tiffin services.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <LocationMap
            center={coords}
            onLocationChange={(nextCoords) => selectCoords(nextCoords)}
            title="Choose a service area"
            description="Drag the pin to locate kitchens, tiffin, and stays around your exact area."
          />

          {/* GPS Button */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-start gap-3 py-6 border-orange-200 bg-orange-50/50 hover:bg-orange-100/50 text-orange-900"
            onClick={detectLocation}
            disabled={isDetecting}
          >
            <div className="p-2 rounded-full bg-orange-600 text-white">
              <Navigation className={`w-4 h-4 ${isDetecting ? "animate-spin" : ""}`} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">
                {isDetecting ? "Detecting GPS Position..." : "Use Current GPS Location"}
              </div>
              <div className="text-xs text-orange-700">Find kitchens nearest to you automatically</div>
            </div>
          </Button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-muted"></div>
            <span className="flex-shrink mx-3 text-xs uppercase font-medium text-muted-foreground">
              Or Select Demo Hub
            </span>
            <div className="flex-grow border-t border-muted"></div>
          </div>

          {/* Predefined Indian hubs */}
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
            {DEMO_CITIES.map((city) => {
              const isSelected = cityName === city.name;
              return (
                <button
                  key={city.name}
                  onClick={() => selectCity(city)}
                  className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "border-orange-500 bg-orange-50/80 font-medium text-orange-950 shadow-sm"
                      : "border-border hover:border-orange-200 hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-4 h-4 ${isSelected ? "text-orange-600" : "text-muted-foreground"}`} />
                    <div>
                      <div className="text-sm font-medium">{city.name}</div>
                      <div className="text-xs text-muted-foreground">{city.city}, {city.state}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-orange-600" />}
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
