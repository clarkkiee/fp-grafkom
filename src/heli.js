import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loadHeli = (scene) => {
  const loader = new GLTFLoader();
  loader.load(
    "/models/heli.glb",
    function (gltf) {
      const heli = gltf.scene;
      heli.scale.set(1, 1, 1);
      heli.position.set(-20, -20, 20);
      scene.add(heli);
    },
    undefined,
    function (err) {
      console.error("Error Loading Track : ", err);
    }
  );
};

export default loadHeli;
