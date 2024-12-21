import * as THREE from "three";
import camera from "./camera";
import renderer from "./renderer";
import { ambientLight, directionalLight } from "./lighting";
import loadTrack from "./track";
import { loadCar, controlCar, updateCarPosition } from "./car";
import loadStadion from "./stadion";
import loadTrees from "./tree";
import loadCactus from "./cactus.js";

const scene = new THREE.Scene();

const treePositions = [
  { x: -25, y: 0, z: 0 },
  { x: -25, y: 0, z: 1 },
  { x: 5, y: 0, z: -10 },
  { x: 15, y: 0, z: 20 },
];
const cactusPositions = [
  { x: -20, y: 0, z: 5 },
  { x: -5, y: 0, z: -15 },
  { x: -1, y: 0, z: 10 },
  { x: -5, y: 0, z: -20 },
];

scene.add(ambientLight);
scene.add(directionalLight);

loadStadion(scene);
loadTrack(scene);
loadCar(scene);
loadTrees(scene, treePositions);  // Corrected here
loadCactus(scene, cactusPositions);  // Corrected here

window.addEventListener("keydown", (event) => {
  controlCar(event.key, true);
});
window.addEventListener("keyup", (event) => {
  controlCar(event.key, false);
});

function animate() {
  requestAnimationFrame(animate);
  updateCarPosition(camera);
  renderer.render(scene, camera);
}

animate();
