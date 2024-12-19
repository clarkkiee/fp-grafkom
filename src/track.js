import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loadTrack = (scene) => {
    const loader = new GLTFLoader()
    loader.load('/models/track.glb', function (gltf) {
        const track = gltf.scene
        track.scale.set(2, 2, 2)
        track.position.set(-25, 0, 0)
        scene.add(track)
    }, undefined, function(err) {
        console.error("Error Loading Track : ", err)
    })
} 

export default loadTrack