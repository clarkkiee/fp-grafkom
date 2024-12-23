import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { treeBoundingBoxes } from "./tree"; 
import { cactusBoundingBoxes } from "./track"; 
import { trackAccBoundingBox } from "./track_acc"; 

let car;
let velocity = { x: 0, z: 0 };
let rotation = 0;
const acceleration = 0.005;
let maxSpeed = 0.1; // Kecepatan maksimum default
const turboSpeed = 0.2; // Kecepatan maksimum saat Turbo Mode aktif
const friction = 0.97;
const rotationSpeed = 0.02;
let isAccelerating = false;
let isReversing = false;
let isTurningLeft = false;
let isTurningRight = false;
let isTurboMode = false;
let isThirdPersonView = false;
const carBoundingBox = new THREE.Box3();

const lapTimeDisplay = document.getElementById("lap-time-display"); 
const lapHistoryDisplay = document.getElementById("lap-history-display"); 
let timerStarted = false;
let lapStartTime = 0; 
let lapTimes = []; 
let hasPassedTrackAcc = false;

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
    case "Shift": // Aktifkan atau nonaktifkan Turbo Mode
      isTurboMode = isKeyDown;
      maxSpeed = isTurboMode ? turboSpeed : 0.1; // Atur kecepatan maksimum
      console.log(`Turbo Mode: ${isTurboMode ? "ON" : "OFF"}`);
      break;
    case "k":
      if (isKeyDown) {
        isThirdPersonView = !isThirdPersonView;
      }
      break;
    case "r":
      if (isKeyDown) {
        resetCarPosition(); // Reset posisi mobil dan timer
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
    lapTimeDisplay.textContent = `Current Lap Time: ${elapsedTime.toFixed(2)} s`;
  }

  // Hitung posisi baru mobil
  const newX = car.position.x + Math.sin(rotation) * velocity.z;
  const newZ = car.position.z + Math.cos(rotation) * velocity.z;

  // Update posisi sementara mobil
  car.position.set(newX, car.position.y, newZ);

  // Perbarui bounding box mobil
  const carBoundingBox = new THREE.Box3().setFromObject(car);

  if (trackAccBoundingBox && carBoundingBox.intersectsBox(trackAccBoundingBox)) {
    if (!timerStarted && !hasPassedTrackAcc) {
      // Mulai timer pertama kali
      timerStarted = true;
      lapStartTime = performance.now();
      console.log("Timer started!");
    } else if (!hasPassedTrackAcc) {
      // Catat waktu lap
      const currentTime = performance.now();
      const lapTime = (currentTime - lapStartTime) / 1000; // Hitung waktu lap
      lapTimes.push(lapTime); // Simpan waktu lap ke dalam array
      console.log(`Lap completed in ${lapTime.toFixed(2)} seconds`);
  
      // Tampilkan semua waktu lap di layar
      const lapHistoryDisplay = document.getElementById("lap-history-display");
      lapHistoryDisplay.style.display = "block"; // Tampilkan riwayat lap
      lapHistoryDisplay.innerHTML = lapTimes
        .map((time, index) => `Lap ${index + 1}: ${time.toFixed(2)} s`)
        .join("<br>");
  
      // Reset timer untuk lap berikutnya
      lapStartTime = performance.now();
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

  // Reset timer dan riwayat lap
  timerStarted = false;
  lapStartTime = 0;
  lapTimes = [];
  lapTimeDisplay.textContent = "Lap Time: 0.00 s";
  lapHistoryDisplay.innerHTML = ""; // Kosongkan riwayat lap
  console.log("Car and timer reset to initial state");
};

if (!isAccelerating && !isReversing) {
  velocity.x *= friction;
  velocity.z *= friction;
}

export { loadCar, controlCar, updateCarPosition };
