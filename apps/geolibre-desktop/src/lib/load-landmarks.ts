import type { MapController } from "@geolibre/map";
import { ensureMercatorProjection } from "@geolibre/plugins";
import { createLandmarkThreeJSLayer } from "./threejs-landmark-layer";

/**
 * World landmark definitions: name, real-world coordinates, and the GLB model
 * file served from public/models/. Models are authored in meters (Y-up);
 * `sizeScale` multiplies the authored size (3 ≈ roughly true-world scale for
 * these simplified meshes).
 */
export interface LandmarkDef {
  name: string;
  lng: number;
  lat: number;
  modelFile: string;
  /** Multiplier applied to the model's authored size (1 = authored units). */
  sizeScale: number;
}

export const WORLD_LANDMARKS: LandmarkDef[] = [
  { name: "Eiffel Tower", lng: 2.2945, lat: 48.8584, modelFile: "eiffel-tower", sizeScale: 3 },
  { name: "Big Ben", lng: -0.1246, lat: 51.5007, modelFile: "big-ben", sizeScale: 3 },
  { name: "Statue of Liberty", lng: -74.0445, lat: 40.6892, modelFile: "statue-of-liberty", sizeScale: 3 },
  { name: "Great Pyramid of Giza", lng: 31.1342, lat: 29.9792, modelFile: "great-pyramid", sizeScale: 3 },
  { name: "Tokyo Tower", lng: 139.7454, lat: 35.6586, modelFile: "tokyo-tower", sizeScale: 3 },
  { name: "Empire State Building", lng: -73.9857, lat: 40.7484, modelFile: "empire-state", sizeScale: 3 },
  { name: "Sydney Opera House", lng: 151.2153, lat: -33.8568, modelFile: "sydney-opera", sizeScale: 3 },
  { name: "Burj Khalifa", lng: 55.2744, lat: 25.1972, modelFile: "burj-khalifa", sizeScale: 3 },
  { name: "Taj Mahal", lng: 78.0421, lat: 27.1751, modelFile: "taj-mahal", sizeScale: 3 },
  { name: "Forbidden City", lng: 116.3972, lat: 39.9163, modelFile: "forbidden-city", sizeScale: 3 },
];

const LANDMARK_LAYER_ID = "landmarks-3d";

/**
 * Load all world landmark 3D models onto the map. This function:
 * 1. Switches the map to Mercator (flat) projection — required for proper
 *    3D model alignment.
 * 2. Creates a single MapLibre custom layer backed by Three.js that loads all
 *    GLB models and positions them at their real-world coordinates.
 * 3. Sets the map pitch to 60° for a 3D perspective view.
 * 4. Flies to the first landmark (Eiffel Tower, Paris).
 *
 * Uses Three.js's GLTFLoader directly (bypassing deck.gl's loaders.gl pipeline)
 * because the latter was receiving the Vite SPA fallback HTML instead of the
 * GLB binary data.
 *
 * @param mapController - The app's MapController (may be null during init).
 * @param baseUrl - The base URL for serving model files (defaults to origin).
 * @returns The number of landmark models being loaded.
 */
export function loadWorldLandmarks(
  mapController: MapController | null,
  baseUrl: string = typeof window !== "undefined" ? window.location.origin : "",
): number {
  console.log("[Landmarks] loadWorldLandmarks called", {
    hasMapController: !!mapController,
    baseUrl,
  });

  const map = mapController?.getMap();
  if (!map) {
    console.warn("[Landmarks] No map instance available — cannot add 3D models");
    return 0;
  }

  // Switch to Mercator (flat) projection — 3D custom layers only align
  // correctly in a flat viewport, not on a globe.
  console.log("[Landmarks] Switching to Mercator projection");
  ensureMercatorProjection(map);
  console.log(
    "[Landmarks] Projection after switch:",
    map.getProjection?.()?.type ?? "unknown",
  );

  // Remove any existing landmark layer so re-clicking the button refreshes
  // the models instead of stacking duplicates.
  if (map.getLayer(LANDMARK_LAYER_ID)) {
    console.log("[Landmarks] Removing existing landmark layer");
    map.removeLayer(LANDMARK_LAYER_ID);
  }

  // Create and add the Three.js custom layer with all landmark models.
  const layer = createLandmarkThreeJSLayer(WORLD_LANDMARKS, baseUrl);
  map.addLayer(layer);
  console.log(`[Landmarks] Added custom 3D layer with ${WORLD_LANDMARKS.length} models`);

  // Set up a 3D perspective view and fly to the first landmark.
  try {
    map.setPitch(60);
    console.log("[Landmarks] Pitch set to 60");
  } catch {
    console.warn("[Landmarks] Failed to set pitch");
  }

  const first = WORLD_LANDMARKS[0];
  try {
    console.log(`[Landmarks] Flying to ${first.name} at [${first.lng}, ${first.lat}]`);
    map.flyTo({
      center: [first.lng, first.lat],
      zoom: 15,
      pitch: 60,
      bearing: 0,
      duration: 4000,
    });
  } catch {
    console.warn("[Landmarks] flyTo failed");
  }

  return WORLD_LANDMARKS.length;
}
