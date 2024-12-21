import * as THREE from "three";

const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(30, 10, 20);
camera.lookAt(0, 0, 0);

export default camera;
