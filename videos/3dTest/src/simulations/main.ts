import * as THREE from 'three';

const threeScene = new THREE.Scene();

// Ground plane configuration to catch soft shadows transparently
const planeGeometry = new THREE.PlaneGeometry(200, 200);
const plane = new THREE.Mesh(
    planeGeometry,
    new THREE.ShadowMaterial({ opacity: 0.15 }),
);
plane.rotation.x = -Math.PI / 2;
plane.position.set(0, -10, 0);
plane.receiveShadow = true;
threeScene.add(plane);

const geometry = new THREE.BoxGeometry(8, 8, 8);

// Object 1: Left Cube -> Catppuccin Red
const cube1 = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
        color: 0x000000, emissive: 0xf38ba8, emissiveIntensity: 1.0, roughness: 1.0, metalness: 0.0,
    })
);
cube1.castShadow = true;
cube1.receiveShadow = true;
threeScene.add(cube1);

// Object 2: Center Cube -> Catppuccin Green
const cube2 = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
        color: 0x000000, emissive: 0xa6e3a1, emissiveIntensity: 1.0, roughness: 1.0, metalness: 0.0,
    })
);
cube2.castShadow = true;
cube2.receiveShadow = true;
threeScene.add(cube2);

// Object 3: Right Cube -> Catppuccin Blue
const cube3 = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
        color: 0x000000, emissive: 0x89b4fa, emissiveIntensity: 1.0, roughness: 1.0, metalness: 0.0,
    })
);
cube3.castShadow = true;
cube3.receiveShadow = true;
threeScene.add(cube3);

// Lights optimized for directional downward soft shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(-15, 40, 20);
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -25;
directionalLight.shadow.camera.right = 25;
directionalLight.shadow.camera.top = 25;
directionalLight.shadow.camera.bottom = -25;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.radius = 8.0;
directionalLight.shadow.bias = -0.0001;
threeScene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
threeScene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.set(0, 32, 42);
camera.lookAt(0, -5, 0);

const orbit = new THREE.Group();
orbit.add(camera);
threeScene.add(orbit);

export { threeScene, camera, orbit, geometry, cube1, cube2, cube3 };
