import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const cactusBoundingBoxes = []; // Array untuk menyimpan bounding boxes kaktus

const loadTrack = (scene) => {
    const loader = new GLTFLoader();
    loader.load('/models/baked-track.glb', function (gltf) {
        const track = gltf.scene;
        track.scale.set(2, 2, 2);
        track.position.set(-25, 0, 0);
        track.updateMatrixWorld(true); // Terapkan transformasi global
        scene.add(track);

        // Traverse semua objek di dalam GLB untuk menemukan kaktus
        track.traverse((child) => {
            console.log("Found object:", child.name); // Debug nama objek
            if (child.isMesh && child.name.toLowerCase().includes("cactus")) {
                // Buat bounding box untuk kaktus
                const box = new THREE.Box3().setFromObject(child);
                if (!box.isEmpty()) {
                    cactusBoundingBoxes.push(box);
                    console.log(`Bounding box for cactus created: `, box);
                } else {
                    console.error(`Bounding box for cactus is empty or undefined. Object:`, child);
                }
            }
        });
    }, undefined, function (err) {
        console.error("Error Loading Track : ", err);
    });
};

export { loadTrack, cactusBoundingBoxes };
