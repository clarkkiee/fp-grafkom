import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loadStadion = (scene) => {
    const loader = new GLTFLoader();
    loader.load(
        "/models/stadion.glb",
        function (gltf) {
            const stadion = gltf.scene;
            stadion.scale.set(0.04, 0.03, 0.04);
            stadion.position.set(-20, -2, -24);
            scene.add(stadion);
        },
        undefined,
        function (err) {
            console.error("Error Loading Track : ", err);
        }
    );
};

export default loadStadion;
