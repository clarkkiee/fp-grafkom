import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { treeBoundingBoxes } from "./tree"; // Impor bounding box pohon
import { cactusBoundingBoxes } from "./track"; // Impor bounding boxes untuk kaktus

let car;
let velocity = { x: 0, z: 0 };
let rotation = 0;
const acceleration = 0.005;
const maxSpeed = 0.1;
const friction = 0.97;
const rotationSpeed = 0.02;
let isAccelerating = false;
let isReversing = false;
let isTurningLeft = false;
let isTurningRight = false;
let isThirdPersonView = false;
const carBoundingBox = new THREE.Box3();

const loadCar = (scene) => {
  const loader = new GLTFLoader();
  loader.load(
    "/models/f1.glb",
    function (gltf) {
      car = gltf.scene;
      car.scale.set(0.8, 0.8, 0.8);
      car.position.set(21, 0, 0);
      scene.add(car);
      carBoundingBox.setFromObject(car);
    },
    undefined,
    function (error) {
      console.error("Error loading car model:", error);
    }
  );
};

const controlCar = (keyCode, isKeyDown) => {
  if (!car) return;

  switch (keyCode) {
    case "w":
      isAccelerating = isKeyDown;
      break;
    case "s":
      isReversing = isKeyDown;
      break;
    case "a":
      isTurningLeft = isKeyDown;
      break;
    case "d":
      isTurningRight = isKeyDown;
      break;
    case "k":
      if (isKeyDown) {
        isThirdPersonView = !isThirdPersonView;
      }
      break;
    case "r":
      if (isKeyDown) {
        resetCarPosition(); // Panggil fungsi reset
      }
      break;
    default:
      break;
  }
};

const updateCarPosition = (camera) => {
  if (!car) return;

  // Simpan posisi lama untuk rollback jika terjadi tabrakan
  const oldX = car.position.x;
  const oldZ = car.position.z;

  // Perbarui kecepatan mobil
  if (isAccelerating) {
    velocity.z = Math.min(velocity.z + acceleration, maxSpeed);
  } else if (isReversing) {
    velocity.z = Math.max(velocity.z - acceleration, -maxSpeed / 2);
  }

  if (isTurningLeft) {
    rotation += rotationSpeed;
  }
  if (isTurningRight) {
    rotation -= rotationSpeed;
  }

  // Hitung posisi baru mobil
  const newX = car.position.x + Math.sin(rotation) * velocity.z;
  const newZ = car.position.z + Math.cos(rotation) * velocity.z;

  // Update posisi sementara mobil
  car.position.set(newX, car.position.y, newZ);

  // Perbarui bounding box mobil
  const carBoundingBox = new THREE.Box3().setFromObject(car);
  console.log("Car bounding box:", carBoundingBox); // Debug bounding box mobil

  // Deteksi tabrakan
  let collisionDetected = false;

  // Cek tabrakan dengan pohon
  for (let treeBox of treeBoundingBoxes) {
    if (carBoundingBox.intersectsBox(treeBox)) {
      collisionDetected = true;
      console.log("Collision with tree detected!");
      break;
    }
  }

  // Cek tabrakan dengan kaktus
  if (cactusBoundingBoxes.length === 0) {
    console.error("No cactus bounding boxes found!");
  } else {
    for (let cactusBox of cactusBoundingBoxes) {
      if (cactusBox && carBoundingBox.intersectsBox(cactusBox)) {
        collisionDetected = true;
        console.log("Collision with cactus detected!");
        break;
      }
    }
  }

  // Jika ada tabrakan, rollback posisi
  if (collisionDetected) {
    car.position.set(oldX, car.position.y, oldZ);
    velocity.z = 0; // Hentikan kecepatan mobil
  }

  // Perbarui rotasi mobil
  car.rotation.y = rotation;

  // Perbarui kamera (third-person atau default)
  if (isThirdPersonView && camera) {
    const offset = 5;
    camera.position.set(
      car.position.x - Math.sin(rotation) * offset,
      car.position.y + 5,
      car.position.z - Math.cos(rotation) * offset
    );
    camera.lookAt(car.position.x, car.position.y, car.position.z);
  } else if (camera) {
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);
  }
};



const resetCarPosition = () => {
  if (!car) return;

  car.position.set(21, 0, 0); // Posisi awal mobil
  car.rotation.set(0, 0, 0); // Rotasi awal mobil
  velocity = { x: 0, z: 0 }; // Kecepatan awal
  rotation = 0; // Rotasi awal
};

if (!isAccelerating && !isReversing) {
  velocity.x *= friction;
  velocity.z *= friction;
}

export { loadCar, controlCar, updateCarPosition };
