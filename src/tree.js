import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three"; // Tambahkan impor THREE

let treeBoundingBoxes = []; // Array untuk menyimpan bounding box pohon

const loadTrees = (scene, positions) => {
  const loader = new GLTFLoader();
  loader.load(
    "/models/Tree1.glb",
    function (gltf) {
      positions.forEach((position) => {
        const tree = gltf.scene.clone(); // Clone pohon untuk setiap posisi
        tree.scale.set(0.5, 0.5, 0.5);
        tree.position.set(position.x, position.y, position.z);
        scene.add(tree);

        // Buat bounding box untuk pohon
        const treeBoundingBox = new THREE.Box3().setFromObject(tree);
        treeBoundingBoxes.push(treeBoundingBox);
      });
    },
    undefined,
    function (err) {
      console.error("Error Loading Tree: ", err);
    }
  );
};

export { loadTrees, treeBoundingBoxes };
