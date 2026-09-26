import React, { useMemo, useRef, useState } from "react";
import { ChefHat, Home, MapPin, Navigation, Truck } from "lucide-react";
import type { Coords } from "@/lib/geo";

export type LocationMapMarker = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  kind?: "kitchen" | "stay" | "logistics";
  detail?: string;
};

type LocationMapProps = {
  center: Coords;
  onLocationChange: (coords: Coords) => void;
  markers?: LocationMapMarker[];
  title?: string;
  description?: string;
  className?: string;
};

const VIEWPORT_LATITUDE = 0.035;
const VIEWPORT_LONGITUDE = 0.045;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const markerIcon = (kind: LocationMapMarker["kind"]) => {
  if (kind === "stay") return <Home className="h-3.5 w-3.5" />;
  if (kind === "logistics") return <Truck className="h-3.5 w-3.5" />;
  return <ChefHat className="h-3.5 w-3.5" />;
};

export const LocationMap: React.FC<LocationMapProps> = ({
  center,
  onLocationChange,
  markers = [],
  title = "Drop a pin",
  description = "Drag the pin or tap anywhere on the map to update the search area.",
  className = "",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const project = (latitude: number, longitude: number) => ({
    left: clamp(50 + ((longitude - center.longitude) / VIEWPORT_LONGITUDE) * 50, 5, 95),
    top: clamp(50 - ((latitude - center.latitude) / VIEWPORT_LATITUDE) * 50, 8, 92),
  });

  const visibleMarkers = useMemo(
    () => markers.map((marker) => ({ ...marker, position: project(marker.latitude, marker.longitude) })),
    [markers, center.latitude, center.longitude],
  );

  const updateFromPointer = (clientX: number, clientY: number) => {
    const bounds = mapRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = clamp((clientX - bounds.left) / bounds.width, 0.05, 0.95);
    const y = clamp((clientY - bounds.top) / bounds.height, 0.08, 0.92);
    onLocationChange({
      latitude: center.latitude + (0.5 - y) * VIEWPORT_LATITUDE,
      longitude: center.longitude + (x - 0.5) * VIEWPORT_LONGITUDE,
    });
  };

  return (
    <section className={`overflow-hidden rounded-2xl border bg-card shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-4 border-b px-4 py-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <MapPin className="h-4 w-4 text-orange-600" /> {title}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-emerald-700">
          <Navigation className="h-3 w-3" /> Live area
        </div>
      </div>

      <div
        ref={mapRef}
        className="relative h-64 touch-none overflow-hidden bg-[#dce8e1] sm:h-80"
        onPointerDown={(event) => {
          if (event.target !== event.currentTarget) return;
          setDragging(true);
          updateFromPointer(event.clientX, event.clientY);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (dragging) updateFromPointer(event.clientX, event.clientY);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(28deg,transparent_47%,rgba(255,255,255,0.85)_48%,rgba(255,255,255,0.85)_51%,transparent_52%),linear-gradient(118deg,transparent_45%,rgba(255,255,255,0.7)_46%,rgba(255,255,255,0.7)_48%,transparent_49%)] [background-size:150px_120px,190px_160px]" />
        <div className="absolute left-[12%] top-[18%] h-24 w-40 rotate-12 rounded-[45%] bg-[#c6dbc9]/80" />
        <div className="absolute bottom-[8%] right-[8%] h-28 w-48 -rotate-6 rounded-[45%] bg-[#c6dbc9]/70" />

        {visibleMarkers.map((marker) => (
          <button
            key={marker.id}
            type="button"
            className={`absolute z-10 -translate-x-1/2 -translate-y-full rounded-full border-2 border-white p-2 text-white shadow-lg transition-transform hover:scale-110 ${
              marker.kind === "stay" ? "bg-purple-600" : marker.kind === "logistics" ? "bg-blue-600" : "bg-orange-600"
            }`}
            style={{ left: `${marker.position.left}%`, top: `${marker.position.top}%` }}
            onClick={(event) => {
              event.stopPropagation();
              setActiveMarker(activeMarker === marker.id ? null : marker.id);
            }}
            aria-label={marker.label}
          >
            {markerIcon(marker.kind)}
            {activeMarker === marker.id && (
              <span className="absolute bottom-full left-1/2 mb-2 w-44 -translate-x-1/2 rounded-lg bg-white p-2 text-left text-[11px] text-slate-800 shadow-xl">
                <span className="block font-bold">{marker.label}</span>
                {marker.detail && <span className="mt-0.5 block text-slate-500">{marker.detail}</span>}
              </span>
            )}
          </button>
        ))}

        <button
          type="button"
          className={`absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-full rounded-full border-4 border-white bg-slate-900 p-2 text-white shadow-xl ${dragging ? "scale-110" : ""}`}
          onPointerDown={(event) => {
            event.stopPropagation();
            setDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (dragging) updateFromPointer(event.clientX, event.clientY);
          }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          aria-label="Drag location pin"
        >
          <MapPin className="h-5 w-5 fill-orange-500 text-orange-500" />
        </button>

        <div className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">
          {center.latitude.toFixed(4)}, {center.longitude.toFixed(4)}
        </div>
        <div className="absolute bottom-3 right-3 rounded-md bg-white/90 px-2 py-1 text-[10px] text-slate-600 shadow-sm">
          {markers.length} nearby
        </div>
      </div>
    </section>
  );
};