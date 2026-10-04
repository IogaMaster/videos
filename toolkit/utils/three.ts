import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const loader = new GLTFLoader();

export async function loadModel(url: string): Promise<THREE.Group<THREE.Object3DEventMap>> {
    const gltf = await loader.loadAsync(url);
    const model = gltf.scene;

    model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return model;
}

export function defaultScene(shadowPlane: Boolean = true) {
    const scene = new THREE.Scene();

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(20, 35, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    if (shadowPlane) {

        const groundMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.ShadowMaterial({ opacity: 0.3 })
        );
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.position.y = -6;
        groundMesh.receiveShadow = true;
        scene.add(groundMesh);
    }

    return scene;
}
