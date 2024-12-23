import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { treeBoundingBoxes } from "./tree"; // Impor bounding box pohon
import { cactusBoundingBoxes } from "./track"; // Impor bounding boxes untuk kaktus
import { trackAccBoundingBox } from "./track_acc"; // Impor bounding box untuk track_acc

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

const lapTimeDisplay = document.getElementById("lap-time-display"); // Ambil elemen HTML untuk waktu lap
let timerStarted = false; // Status apakah timer sudah dimulai
let lapStartTime = 0; // Waktu awal lap
let lapTime = 0; // Total waktu lap
let hasPassedTrackAcc = false; // Apakah mobil sudah melewati track_acc

const loadCar = (scene) => {
  const loader = new GLTFLoader();
  loader.load(
    "/models/f1.glb",
    function (gltf) {
      car = gltf.scene;
      car.scale.set(0.8, 0.8, 0.8);
      car.position.set(21, 0, -3);
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

  // Perbarui timer jika berjalan
  if (timerStarted) {
    const currentTime = performance.now();
    const elapsedTime = (currentTime - lapStartTime) / 1000; // Waktu dalam detik
    lapTimeDisplay.textContent = `Lap Time: ${elapsedTime.toFixed(2)} s`;
  }

  // Hitung posisi baru mobil
  const newX = car.position.x + Math.sin(rotation) * velocity.z;
  const newZ = car.position.z + Math.cos(rotation) * velocity.z;

  // Update posisi sementara mobil
  car.position.set(newX, car.position.y, newZ);

  // Perbarui bounding box mobil
  const carBoundingBox = new THREE.Box3().setFromObject(car);
  console.log("Car bounding box:", carBoundingBox); // Debug bounding box mobil

  // Deteksi garis finish
  if (trackAccBoundingBox && carBoundingBox.intersectsBox(trackAccBoundingBox)) {
    if (!timerStarted && !hasPassedTrackAcc) {
      // Mulai timer pertama kali
      timerStarted = true;
      lapStartTime = performance.now();
      console.log("Timer started!");
    } else if (!hasPassedTrackAcc) {
      // Catat waktu lap tanpa meng-reset timer
      const currentTime = performance.now();
      lapTime = currentTime - lapStartTime;
      console.log(`Lap completed in ${(lapTime / 1000).toFixed(2)} seconds`);

      // Perbarui teks pada layar dengan waktu lap terakhir
      lapTimeDisplay.textContent = `Lap Time: ${(lapTime / 1000).toFixed(2)} s`;

      timerStarted = false;
    }
    hasPassedTrackAcc = true;
  } else {
    hasPassedTrackAcc = false;
  }

  // Deteksi tabrakan dengan pohon
  let collisionDetected = false;

  for (let treeBox of treeBoundingBoxes) {
    if (carBoundingBox.intersectsBox(treeBox)) {
      collisionDetected = true;
      console.log("Collision with tree detected!");
      break;
    }
  }

  // Deteksi tabrakan dengan kaktus
  for (let cactusBox of cactusBoundingBoxes) {
    if (cactusBox && carBoundingBox.intersectsBox(cactusBox)) {
      collisionDetected = true;
      console.log("Collision with cactus detected!");
      break;
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
    const offset = 7;
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

  // Reset posisi mobil
  car.position.set(21, 0, -3); // Posisi awal mobil
  car.rotation.set(0, 0, 0); // Rotasi awal mobil
  velocity = { x: 0, z: 0 }; // Kecepatan awal
  rotation = 0; // Rotasi awal

  // Reset timer
  timerStarted = false; // Timer dihentikan
  lapTime = 0; // Reset waktu lap
  lapStartTime = 0; // Reset waktu awal lap
  lapTimeDisplay.textContent = "Lap Time: 0.00 s"; // Tampilkan kembali teks awal untuk timer
  console.log("Car and timer reset to initial state");
};


if (!isAccelerating && !isReversing) {
  velocity.x *= friction;
  velocity.z *= friction;
}

export { loadCar, controlCar, updateCarPosition };
