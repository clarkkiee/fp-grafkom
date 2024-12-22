import * as THREE from "three";
import camera from "./camera";
import renderer from "./renderer";
import { ambientLight, directionalLight } from "./lighting";
import { loadTrack } from "./track";
import { loadCar, controlCar, updateCarPosition } from "./car";
import loadStadion from "./stadion";
import loadTrackAcc from "./track_acc";
import { loadTrees, treeBoundingBoxes } from "./tree";
import loadChampions from "./champion";

const scene = new THREE.Scene();

const treePositions = [
  { x: -15, y: 0, z: 0 },
  { x: -25, y: 0, z: 10 },
  { x: 5, y: 0, z: -10 },
  { x: 15, y: 0, z: 25 },
];
scene.add(ambientLight);
scene.add(directionalLight);

loadStadion(scene);
loadTrack(scene);
loadCar(scene);
loadTrees(scene, treePositions);
loadTrackAcc(scene);
loadChampions(scene);

window.addEventListener("keydown", (event) => {
  controlCar(event.key, true);
});
window.addEventListener("keyup", (event) => {
  controlCar(event.key, false);
});

function animate() {
  requestAnimationFrame(animate);
  updateCarPosition(camera, treeBoundingBoxes);
  renderer.render(scene, camera);
}

animate();
