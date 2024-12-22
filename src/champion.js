import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loadChampions = (scene) => {
  const loader = new GLTFLoader();
  loader.load(
    "/models/championsfix.glb",
    function (gltf) {
      const champions = gltf.scene;
      champions.scale.set(1, 1, 1);
      champions.position.set(15, 2, 0);
      scene.add(champions);
    },
    undefined,
    function (err) {
      console.error("Error Loading Track : ", err);
    }
  );
};

export default loadChampions;
