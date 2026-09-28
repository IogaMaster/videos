import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';

export let world: RAPIER.World;
export let centralBody: RAPIER.RigidBody;
export let sphereMesh: THREE.Mesh;
export let cubeObjects: { body: RAPIER.RigidBody; mesh: THREE.Mesh }[] = [];

export async function init3DPhysics(scene: THREE.Scene) {
    await RAPIER.init();

    const gravity = { x: 0.0, y: 0.0, z: 0.0 };
    world = new RAPIER.World(gravity);
    world.timestep = 1 / 60;

    // --- 1. Central Sphere ---
    const sphereRadius = 0.8;
    const centralDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 0, 0);
    centralBody = world.createRigidBody(centralDesc);
    world.createCollider(RAPIER.ColliderDesc.ball(sphereRadius), centralBody);

    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
        color: '#89b4fa',
        emissive: '#89b4fa',
        emissiveIntensity: 0.5,
        roughness: 1,
        metalness: 0,
    });
    sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;
    scene.add(sphereMesh);

    // --- 2. Orbiting Cubes ---
    cubeObjects = [];
    const cubeCount = 15;
    const colors = ['#f38ba8', '#fab387', '#a6e3a1', '#94e2d5', '#cba6f7', '#f5c2e7'];

    for (let i = 0; i < cubeCount; i++) {
        const angle = (i / cubeCount) * Math.PI * 2;
        const orbitRadius = 6.0;
        const x = Math.cos(angle) * orbitRadius;
        const z = Math.sin(angle) * orbitRadius;

        const y = Math.sin(i * 2.1) * 1.5;
        const verticalVel = Math.cos(i * 1.7) * 3.0;

        const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(x, y, z)
            .setLinvel(-Math.sin(angle) * 8.5, verticalVel, Math.cos(angle) * 8.5)
            .setAngvel({
                x: 2.0 + (i % 3) * 0.5,
                y: 4.0 - (i % 2) * 1.0,
                z: 1.5 + (i % 4) * 0.3
            });

        const body = world.createRigidBody(bodyDesc);
        const boxSize = 0.7;
        const colliderDesc = RAPIER.ColliderDesc.cuboid(boxSize / 2, boxSize / 2, boxSize / 2)
            .setRestitution(0.85)
            .setFriction(0.2);

        world.createCollider(colliderDesc, body);

        const boxColor = colors[i % colors.length];
        const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
        const boxMat = new THREE.MeshStandardMaterial({
            color: boxColor,
            emissive: boxColor,
            emissiveIntensity: 0.5,
            roughness: 0.2
        });
        const mesh = new THREE.Mesh(boxGeo, boxMat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);

        cubeObjects.push({ body, mesh });
    }
}
