import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loadTrees = (scene, positions) => {
    const loader = new GLTFLoader();
    loader.load('/models/Tree1.glb', function (gltf) {
        positions.forEach(position => {
            const tree = gltf.scene.clone(); // Clone pohon untuk setiap posisi
            tree.scale.set(0.5, 0.5, 0.5);
            tree.position.set(position.x, position.y, position.z);
            scene.add(tree);
        });
    }, undefined, function (err) {
        console.error("Error Loading Track: ", err);
    });
};

export default loadTrees;
