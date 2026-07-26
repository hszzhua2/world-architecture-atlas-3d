/**
 * Generates simplified GLB 3D models for 10 world landmarks using Three.js.
 * Uses callback-based export (not async/await) to avoid Promise/nextTick issues.
 */
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { writeFileSync, mkdirSync } from "node:fs";

// --- Polyfills for GLTFExporter in Node.js ---
class NodeBlob {
  constructor(parts, _opts) {
    const chunks = [];
    for (const part of parts) {
      if (part instanceof ArrayBuffer) chunks.push(Buffer.from(part));
      else if (ArrayBuffer.isView(part)) chunks.push(Buffer.from(part.buffer, part.byteOffset, part.byteLength));
      else if (typeof part === "string") chunks.push(Buffer.from(part, "utf-8"));
      else if (Buffer.isBuffer(part)) chunks.push(part);
      else chunks.push(Buffer.from(String(part)));
    }
    this._buf = Buffer.concat(chunks);
    this.size = this._buf.length;
    this.type = _opts?.type || "";
  }
}

class NodeFileReader {
  constructor() { this.onload = null; this.onloadend = null; this.result = null; }
  _done(result) {
    this.result = result;
    process.nextTick(() => {
      if (this.onload) this.onload({ target: { result } });
      if (this.onloadend) this.onloadend({ target: { result } });
    });
  }
  readAsArrayBuffer(blob) {
    const buf = blob._buf;
    this._done(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  }
  readAsDataURL(blob) {
    const b64 = blob._buf.toString("base64");
    this._done(`data:application/octet-stream;base64,${b64}`);
  }
}

globalThis.FileReader = NodeFileReader;
globalThis.Blob = NodeBlob;
globalThis.document = { createElementNS: () => ({}), createElement: () => ({}) };
globalThis.window = { URL: { createObjectURL: () => "" } };
globalThis.self = globalThis;

// --- Output directory ---
const OUT_DIR = "c:/Users/zhuangzefeng/Documents/世界建筑地图博物/GeoLibre/apps/geolibre-desktop/public/models";
mkdirSync(OUT_DIR, { recursive: true });

// --- Material helpers ---
function mat(color, metalness = 0.3, roughness = 0.7) {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness });
}
function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z); return m;
}
function cyl(rt, rb, h, seg, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material);
  m.position.set(x, y, z); return m;
}
function cone(r, h, seg, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), material);
  m.position.set(x, y, z); return m;
}

// --- Landmark generators ---
function createEiffelTower() {
  const g = new THREE.Group();
  const bronze = mat(0x8B7355, 0.6, 0.4);
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const leg = cyl(2, 5, 55, 6, bronze);
    leg.position.set(Math.cos(angle) * 18, 27.5, Math.sin(angle) * 18);
    leg.lookAt(0, 55, 0); leg.rotateX(Math.PI / 2); g.add(leg);
  }
  g.add(box(40, 3, 40, bronze, 0, 57, 0));
  g.add(cyl(1.5, 3, 30, 6, bronze, 0, 73, 0));
  g.add(box(25, 2, 25, bronze, 0, 88, 0));
  g.add(cyl(1, 1.5, 20, 6, bronze, 0, 99, 0));
  g.add(cyl(0.3, 0.5, 15, 6, bronze, 0, 116, 0));
  g.add(cone(0.3, 5, 6, bronze, 0, 126, 0));
  return g;
}
function createBigBen() {
  const g = new THREE.Group();
  const stone = mat(0xB8B894, 0.1, 0.9);
  const gold = mat(0xD4AF37, 0.8, 0.3);
  const cw = mat(0xF5F5DC, 0.1, 0.9);
  g.add(box(12, 40, 12, stone, 0, 20, 0));
  g.add(box(10, 35, 10, stone, 0, 57.5, 0));
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const f = cyl(3, 3, 0.5, 16, cw);
    f.position.set(Math.cos(angle) * 5.1, 57.5, Math.sin(angle) * 5.1);
    f.lookAt(0, 57.5, 0); f.rotateY(Math.PI / 2); g.add(f);
  }
  g.add(box(9, 8, 9, stone, 0, 79, 0));
  g.add(cone(6, 5, 4, stone, 0, 85.5, 0));
  g.add(cyl(0.5, 4, 15, 4, stone, 0, 95.5, 0));
  g.add(cone(0.5, 8, 4, gold, 0, 107, 0));
  return g;
}
function createStatueOfLiberty() {
  const g = new THREE.Group();
  const copper = mat(0x4A9E7D, 0.4, 0.6);
  const stone = mat(0x9E9E8C, 0.1, 0.9);
  const gold = mat(0xD4AF37, 0.9, 0.2);
  const baseShape = new THREE.Shape();
  const pts = 11;
  for (let i = 0; i <= pts * 2; i++) {
    const a = (i / (pts * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? 14 : 9;
    if (i === 0) baseShape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else baseShape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const base = new THREE.Mesh(new THREE.ExtrudeGeometry(baseShape, { depth: 13, bevelEnabled: false }), stone);
  base.rotation.x = -Math.PI / 2; base.position.set(0, 6.5, 0); g.add(base);
  g.add(box(16, 27, 16, stone, 0, 26.5, 0));
  g.add(box(8, 5, 8, stone, 0, 42.5, 0));
  g.add(cyl(3, 5, 25, 8, copper, 0, 57.5, 0));
  g.add(cyl(1.5, 2, 4, 8, copper, 0, 72, 0));
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    g.add(cone(0.3, 4, 4, gold, Math.cos(a) * 2, 76, Math.sin(a) * 2));
  }
  const arm = cyl(0.6, 0.8, 14, 6, copper);
  arm.position.set(4, 75, 0); arm.rotation.z = -0.5; g.add(arm);
  g.add(cyl(0.3, 0.5, 3, 6, gold, 7, 83, 0));
  g.add(cone(0.8, 4, 8, gold, 7, 86.5, 0));
  return g;
}
function createGreatPyramid() {
  const g = new THREE.Group();
  const sand = mat(0xC2A878, 0.1, 0.95);
  const pyr = new THREE.Mesh(new THREE.ConeGeometry(115, 140, 4), sand);
  pyr.position.set(0, 70, 0); pyr.rotation.y = Math.PI / 4; g.add(pyr);
  const sat = new THREE.Mesh(new THREE.ConeGeometry(25, 30, 4), sand);
  sat.position.set(60, 15, 60); sat.rotation.y = Math.PI / 4; g.add(sat);
  return g;
}
function createTokyoTower() {
  const g = new THREE.Group();
  const red = mat(0xE0162B, 0.3, 0.5);
  const white = mat(0xF0F0F0, 0.2, 0.7);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const leg = cyl(2.5, 6, 70, 6, red);
    leg.position.set(Math.cos(a) * 17, 35, Math.sin(a) * 17);
    leg.lookAt(0, 70, 0); leg.rotateX(Math.PI / 2); g.add(leg);
  }
  g.add(box(28, 4, 28, white, 0, 72, 0));
  g.add(cyl(1.5, 3, 40, 6, red, 0, 94, 0));
  g.add(box(14, 3, 14, white, 0, 116, 0));
  g.add(cyl(0.5, 1, 50, 6, white, 0, 143, 0));
  g.add(cone(0.3, 8, 6, red, 0, 172, 0));
  return g;
}
function createEmpireStateBuilding() {
  const g = new THREE.Group();
  const ls = mat(0xCAC8B8, 0.1, 0.9);
  const gray = mat(0x8C8C8C, 0.2, 0.7);
  g.add(box(60, 30, 60, ls, 0, 15, 0));
  g.add(box(50, 50, 50, ls, 0, 55, 0));
  g.add(box(40, 50, 40, ls, 0, 105, 0));
  g.add(box(28, 40, 28, ls, 0, 150, 0));
  g.add(box(15, 20, 15, gray, 0, 180, 0));
  g.add(cyl(1, 3, 30, 6, gray, 0, 205, 0));
  g.add(cone(1, 15, 6, gray, 0, 227.5, 0));
  return g;
}
function createSydneyOperaHouse() {
  const g = new THREE.Group();
  const cream = mat(0xF0E8D8, 0.1, 0.8);
  const water = mat(0x2F6A8F, 0.3, 0.5);
  g.add(box(100, 8, 60, water, 0, 4, 0));
  const sails = [
    { x: -30, z: 10, s: 1.2, r: -0.1 }, { x: -12, z: 15, s: 1.5, r: -0.05 },
    { x: 8, z: 15, s: 1.5, r: 0.05 }, { x: 26, z: 10, s: 1.2, r: 0.1 },
  ];
  for (const s of sails) {
    const sail = new THREE.Mesh(new THREE.SphereGeometry(18 * s.s, 16, 8, 0, Math.PI, 0, Math.PI / 2), cream);
    sail.position.set(s.x, 8, s.z); sail.rotation.y = s.r; sail.scale.set(1, 1.5, 0.6); g.add(sail);
  }
  for (let i = 0; i < 3; i++) {
    const sail = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 8, 0, Math.PI, 0, Math.PI / 2), cream);
    sail.position.set(-15 + i * 15, 8, -5); sail.scale.set(1, 1, 0.5); g.add(sail);
  }
  return g;
}
function createBurjKhalifa() {
  const g = new THREE.Group();
  const silver = mat(0xC0C8D0, 0.7, 0.3);
  const blue = mat(0x4A7BA8, 0.6, 0.3);
  g.add(box(50, 20, 50, silver, 0, 10, 0));
  let h = 20, r = 22, sh = 30;
  for (let i = 0; i < 9; i++) {
    for (let w = 0; w < 3; w++) {
      const a = (w / 3) * Math.PI * 2 + (i * 0.15);
      const wm = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.4, r * 0.45, sh, 4), i % 2 === 0 ? silver : blue);
      wm.position.set(Math.cos(a) * r * 0.5, h + sh / 2, Math.sin(a) * r * 0.5);
      wm.rotation.y = a; g.add(wm);
    }
    g.add(cyl(r * 0.3, r * 0.35, sh, 6, silver, 0, h + sh / 2, 0));
    h += sh; r *= 0.85; sh = Math.max(15, sh - 1);
  }
  g.add(cyl(1, 3, 60, 6, silver, 0, h + 30, 0));
  g.add(cone(1, 20, 6, silver, 0, h + 70, 0));
  return g;
}
function createTajMahal() {
  const g = new THREE.Group();
  const white = mat(0xF8F4E8, 0.1, 0.85);
  const gold = mat(0xD4AF37, 0.7, 0.3);
  g.add(box(80, 10, 80, white, 0, 5, 0));
  g.add(box(45, 25, 45, white, 0, 22.5, 0));
  const dome = new THREE.Mesh(new THREE.SphereGeometry(15, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.5), white);
  dome.position.set(0, 35, 0); dome.scale.set(1, 1.3, 1); g.add(dome);
  g.add(cyl(0.5, 1, 6, 6, gold, 0, 56, 0));
  g.add(cone(1.5, 5, 6, gold, 0, 61.5, 0));
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const x = Math.cos(a) * 35, z = Math.sin(a) * 35;
    g.add(cyl(2, 2.5, 40, 8, white, x, 25, z));
    g.add(cone(2.5, 6, 8, white, x, 48, z));
    g.add(cone(0.8, 3, 6, gold, x, 52.5, z));
  }
  return g;
}
function createForbiddenCity() {
  const g = new THREE.Group();
  const wall = mat(0x8B2500, 0.1, 0.85);
  const roof = mat(0xD4A000, 0.3, 0.5);
  const stone = mat(0x9E9E8C, 0.1, 0.9);
  g.add(box(70, 6, 40, stone, 0, 3, 0));
  g.add(box(50, 18, 28, wall, 0, 15, 0));
  const rl = box(55, 3, 16, roof, 0, 25, -8); rl.rotation.x = 0.35; g.add(rl);
  const rr = box(55, 3, 16, roof, 0, 25, 8); rr.rotation.x = -0.35; g.add(rr);
  g.add(box(52, 2, 4, roof, 0, 28, 0));
  for (let i = -2; i <= 2; i++) g.add(cyl(0.6, 0.6, 18, 8, wall, i * 10, 15, 14));
  g.add(box(3, 15, 25, wall, -25, 14, 0));
  g.add(box(3, 15, 25, wall, 25, 14, 0));
  return g;
}

// --- Export (callback-based, not Promise) ---
const generators = [
  { name: "eiffel-tower", fn: createEiffelTower },
  { name: "big-ben", fn: createBigBen },
  { name: "statue-of-liberty", fn: createStatueOfLiberty },
  { name: "great-pyramid", fn: createGreatPyramid },
  { name: "tokyo-tower", fn: createTokyoTower },
  { name: "empire-state", fn: createEmpireStateBuilding },
  { name: "sydney-opera", fn: createSydneyOperaHouse },
  { name: "burj-khalifa", fn: createBurjKhalifa },
  { name: "taj-mahal", fn: createTajMahal },
  { name: "forbidden-city", fn: createForbiddenCity },
];

console.log("Generating 10 world landmark GLB models...\n");

let index = 0;
let successCount = 0;

function exportNext() {
  if (index >= generators.length) {
    console.log(`\nDone! ${successCount}/${generators.length} models saved to public/models/`);
    process.exit(0);
    return;
  }

  const { name, fn } = generators[index];
  index++;

  const scene = new THREE.Scene();
  scene.add(fn());

  const exporter = new GLTFExporter();
  console.log(`  Exporting ${name}...`);

  exporter.parse(
    scene,
    (result) => {
      if (result instanceof ArrayBuffer) {
        writeFileSync(`${OUT_DIR}/${name}.glb`, Buffer.from(result));
        console.log(`  done: ${name}.glb (${(result.byteLength / 1024).toFixed(1)} KB)`);
        successCount++;
      } else {
        console.error(`  FAIL ${name}: unexpected JSON result`);
      }
      setTimeout(exportNext, 10);
    },
    (error) => {
      console.error(`  FAIL ${name}:`, error.message || error);
      setTimeout(exportNext, 10);
    },
    { binary: true }
  );
}

exportNext();

setTimeout(() => {
  console.error("Timeout reached, exiting.");
  process.exit(1);
}, 60000);
