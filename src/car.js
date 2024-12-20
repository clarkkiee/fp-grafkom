// car.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let car;
let velocity = { x: 0, z: 0 };
let rotation = 0;
const acceleration = 0.005;
const maxSpeed = 0.05;
const friction = 0.97;
const rotationSpeed = 0.02;
let isAccelerating = false;
let isReversing = false;
let isTurningLeft = false;
let isTurningRight = false;
let isThirdPersonView = false;

const loadCar = (scene) => {
  const loader = new GLTFLoader();
  loader.load('/models/car.glb', function (gltf) {
    car = gltf.scene;
    car.scale.set(0.5, 0.5, 0.5);
    car.position.set(21, 0, 0);
    scene.add(car);
  }, undefined, function (error) {
    console.error('Error loading car model:', error);
  });
};

const controlCar = (keyCode, isKeyDown) => {
  if (!car) return;

  switch (keyCode) {
    case 'w':
      isAccelerating = isKeyDown;
      break;
    case 's':
      isReversing = isKeyDown;
      break;
    case 'a':
      isTurningLeft = isKeyDown;
      break;
    case 'd':
      isTurningRight = isKeyDown;
      break;
    case 'k':
      if (isKeyDown) {
        isThirdPersonView = !isThirdPersonView;
      }
      break;
    default:
      break;
  }
};

const updateCarPosition = (camera) => {
  if (!car) return;

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

  car.rotation.y = rotation;

  car.position.x += Math.sin(rotation) * velocity.z;
  car.position.z += Math.cos(rotation) * velocity.z;

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

  if (!isAccelerating && !isReversing) {
    velocity.x *= friction;
    velocity.z *= friction;
  }
};

export { loadCar, controlCar, updateCarPosition };
