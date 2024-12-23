import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

let trackAccBoundingBox; // Bounding box untuk track_acc

const loadTrackAcc = (scene) => {
  const loader = new GLTFLoader();
  loader.load(
    "/models/U.glb",
    function (gltf) {
      const track_acc = gltf.scene;
      track_acc.scale.set(1, 1, 1);
      track_acc.position.set(15, -2, 2);
      scene.add(track_acc);

      // Buat bounding box setelah model dimuat
      trackAccBoundingBox = new THREE.Box3().setFromObject(track_acc);
    },
    undefined,
    function (err) {
      console.error("Error Loading Track : ", err);
    }
  );
};

export { loadTrackAcc, trackAccBoundingBox };
