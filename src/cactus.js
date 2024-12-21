import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loadCactus = (scene, positions) => {
    const loader = new GLTFLoader();
    loader.load('/models/cactus.glb', function (gltf) {
        positions.forEach(position => {
            const cactus = gltf.scene.clone(); // Clone kaktus untuk setiap posisi
            cactus.scale.set(0.01, 0.01, 0.01); // Atur skala kaktus
            cactus.position.set(position.x, position.y, position.z); // Atur posisi kaktus
            scene.add(cactus); // Tambahkan kaktus ke scene
        });
    }, undefined, function (err) {
        console.error("Error Loading Cactus: ", err);
    });
};

export default loadCactus;
