/**
 * A MapLibre GL JS custom layer that renders 3D landmark models using Three.js.
 *
 * This bypasses deck.gl's loaders.gl URL-loading pipeline (which was receiving
 * the Vite SPA fallback HTML instead of the GLB binary) by using Three.js's
 * GLTFLoader directly. Models are positioned at their real-world geographic
 * coordinates via `MercatorCoordinate.fromLngLat` and rendered in the map's
 * shared WebGL context.
 */
import type { Map, CustomLayerInterface, CustomRenderMethodInput } from "maplibre-gl";
import { MercatorCoordinate } from "maplibre-gl";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface LandmarkModelDef {
  name: string;
  lng: number;
  lat: number;
  modelFile: string;
  sizeScale: number;
}

/**
 * Creates a single MapLibre custom layer that renders all landmark GLB models.
 *
 * The layer shares the map's WebGL context, positions each model at its
 * geographic coordinates using Mercator world space, and repaints whenever a
 * model finishes loading.
 *
 * @param landmarks - Array of landmark definitions (name, coords, model file).
 * @param baseUrl - Origin for resolving `/models/<file>.glb` URLs.
 * @returns A MapLibre `CustomLayerInterface` ready for `map.addLayer()`.
 */
export function createLandmarkThreeJSLayer(
  landmarks: LandmarkModelDef[],
  baseUrl: string,
): CustomLayerInterface {
  const camera = new THREE.Camera();
  const scene = new THREE.Scene();
  const loader = new GLTFLoader();

  // --- Lighting ----------------------------------------------------------
  // Ambient provides base illumination; a directional light gives shading so
  // the models have visible depth and form from any camera angle.
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const sun = new THREE.DirectionalLight(0xffffff, 0.6);
  sun.position.set(0, -70, 100).normalize();
  scene.add(sun);

  let renderer: THREE.WebGLRenderer | null = null;
  let map: Map | null = null;
  const loadedGroups: THREE.Group[] = [];
  let loadedCount = 0;

  // --- Load and position each model -------------------------------------
  for (const landmark of landmarks) {
    const url = `${baseUrl}/models/${landmark.modelFile}.glb`;
    console.log(`[Landmarks-3D] Loading model: ${landmark.name} from ${url}`);

    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;

        // Convert geographic coordinates to Mercator world space.
        const mc = MercatorCoordinate.fromLngLat(
          [landmark.lng, landmark.lat],
          0,
        );

        // Scale: convert model units (meters) to Mercator world units.
        const s = landmark.sizeScale * mc.meterInMercatorCoordinateUnits();

        // Build the composite transform: translate → rotate (Y-up to Z-up) → scale.
        const translation = new THREE.Matrix4().makeTranslation(mc.x, mc.y, mc.z);
        const rotationX = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(1, 0, 0),
          Math.PI / 2,
        );
        const scaleM = new THREE.Matrix4().makeScale(s, s, s);

        model.matrixAutoUpdate = false;
        model.matrix = new THREE.Matrix4()
          .premultiply(translation)
          .multiply(rotationX)
          .multiply(scaleM);

        scene.add(model);
        loadedGroups.push(model);
        loadedCount++;
        console.log(
          `[Landmarks-3D] Model loaded: ${landmark.name} (${loadedCount}/${landmarks.length})`,
        );

        // Repaint so the newly-loaded model appears on the next frame.
        map?.triggerRepaint();
      },
      undefined,
      (error) => {
        console.error(`[Landmarks-3D] Failed to load ${landmark.name}:`, error);
      },
    );
  }

  // --- Custom layer interface -------------------------------------------
  return {
    id: "landmarks-3d",
    type: "custom",
    renderingMode: "3d",

    onAdd(m: Map, gl: WebGLRenderingContext | WebGL2RenderingContext) {
      map = m;
      renderer = new THREE.WebGLRenderer({
        canvas: m.getCanvas(),
        context: gl,
        antialias: true,
      });
      // Don't clear — MapLibre already drew the base map into this context.
      renderer.autoClear = false;
      console.log("[Landmarks-3D] Custom layer added to map");
    },

    render(_gl: WebGLRenderingContext | WebGL2RenderingContext, options: CustomRenderMethodInput) {
      if (!renderer || !map) return;
      // Use the full model-view-projection matrix so Three.js's camera (at the
      // origin) renders models at the correct screen position. MapLibre's MVP
      // already encodes the camera position/orientation, so we bypass Three.js's
      // own view matrix by setting projectionMatrix directly.
      camera.projectionMatrix = new THREE.Matrix4().fromArray(options.modelViewProjectionMatrix);
      // Reset WebGL state so Three.js rendering doesn't corrupt MapLibre's.
      renderer.resetState();
      renderer.render(scene, camera);
      // Keep repainting so the models stay in sync during pan/zoom/rotate.
      map.triggerRepaint();
    },

    onRemove() {
      for (const model of loadedGroups) {
        scene.remove(model);
      }
      loadedGroups.length = 0;
      renderer?.dispose();
      renderer = null;
      map = null;
      console.log("[Landmarks-3D] Custom layer removed");
    },
  };
}
