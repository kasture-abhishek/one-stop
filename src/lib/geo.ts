export type Coords = { latitude: number; longitude: number };

export type DemoCity = {
  id: string;
  name: string;
  area: string;
  latitude: number;
  longitude: number;
};

/** Demo locations used for the SIH walkthrough and as a manual fallback. */
export const DEMO_CITIES: DemoCity[] = [
  { id: "pune", name: "Pune", area: "Kothrud", latitude: 18.5074, longitude: 73.8077 },
  { id: "mumbai", name: "Mumbai", area: "Andheri East", latitude: 19.1136, longitude: 72.8697 },
  { id: "nagpur", name: "Nagpur", area: "Dharampeth", latitude: 21.1307, longitude: 79.0665 },
  { id: "bengaluru", name: "Bengaluru", area: "Koramangala", latitude: 12.9352, longitude: 77.6245 },
  { id: "delhi", name: "New Delhi", area: "Hauz Khas", latitude: 28.5494, longitude: 77.2001 },
];

export const DEFAULT_CITY = DEMO_CITIES[0]!;

const toRad = (value: number) => (value * Math.PI) / 180;

/**
 * Haversine distance in km. Simple by design — swap for PostGIS later
 * without touching callers.
 */
export function distanceKm(a: Coords, b: Coords): number {
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number | null | undefined): string {
  if (km === null || km === undefined || Number.isNaN(km)) return "Nearby";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
