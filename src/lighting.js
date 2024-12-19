import * as THREE from "three"

const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 3)
const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.set(20, 50, 30)

export { ambientLight, directionalLight }