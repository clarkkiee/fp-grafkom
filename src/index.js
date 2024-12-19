import * as THREE from 'three';
import camera from './camera';
import renderer from './renderer';
import { ambientLight, directionalLight } from './lighting';
import loadTrack from './track';
import { loadCar, controlCar, updateCarPosition } from './car';

const scene = new THREE.Scene();

scene.add(ambientLight);
scene.add(directionalLight);

loadTrack(scene);
loadCar(scene);

window.addEventListener('keydown', (event) => {
  controlCar(event.key, true);
});
window.addEventListener('keyup', (event) => {
  controlCar(event.key, false);
});

function animate() {
  requestAnimationFrame(animate);
  updateCarPosition(camera);
  renderer.render(scene, camera);
}

animate();