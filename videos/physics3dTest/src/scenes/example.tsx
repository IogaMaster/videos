import { makeScene2D, Node } from '@canvas-commons/2d';
import { createRef, loop, waitFor } from '@canvas-commons/core';
import { Three, PhysicsManager } from 'toolkit';
import * as THREE from 'three';
import { init3DPhysics, world, centralBody, sphereMesh, cubeObjects } from '../simulations/main';

export default makeScene2D(function*(view) {
    const three = createRef<Three>();

    const threeScene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, 1920 / 1080, 0.1, 1000);
    camera.position.set(0, 6, 16);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    threeScene.add(ambientLight);

    // Directional Light with massive shadow range/frustum
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(15, 30, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;

    const d = 30;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    threeScene.add(dirLight);

    // Huge Plane with ShadowMaterial (seamless background blending + massive shadows)
    const groundGeo = new THREE.PlaneGeometry(150, 150);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -6;
    groundMesh.receiveShadow = true;
    threeScene.add(groundMesh);

    yield init3DPhysics(threeScene);

    const manager = new PhysicsManager();

    manager.register(centralBody, (pos, rot) => {
        sphereMesh.position.set(pos.x, pos.y, pos.z);
    });

    cubeObjects.forEach(({ body, mesh }) => {
        manager.register(body, (pos, rot) => {
            mesh.position.set(pos.x, pos.y, pos.z);
            mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);
        });
    });

    const gravitationalStrength = 15.0;
    const sphereRadius = 0.8;
    const boxHalfSize = 0.35;
    const minSafeDistance = sphereRadius + boxHalfSize + 0.4;
    const repulsionStrength = 2.5;
    const tangentialBoostStrength = 1.0; // Controls how violently they whip around on impact
    const totalFrames = 400;

    manager.customBake(totalFrames, (frameIndex) => {
        const t = (frameIndex / totalFrames) * Math.PI * 2;
        const targetX = Math.sin(t * 2) * 2.5;
        const targetY = Math.cos(t) * 1.5;
        const targetZ = Math.sin(t * 3) * 1.5;

        centralBody.setTranslation({ x: targetX, y: targetY, z: targetZ }, true);

        cubeObjects.forEach(({ body }) => {
            const pos = body.translation();
            const dirX = targetX - pos.x;
            const dirY = targetY - pos.y;
            const dirZ = targetZ - pos.z;
            const distance = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);

            if (distance < minSafeDistance) {
                // 1. Radial push outward to prevent clipping
                const pushFactor = (minSafeDistance - distance) * repulsionStrength;
                const rx = (-dirX / distance) * pushFactor;
                const ry = (-dirY / distance) * pushFactor;
                const rz = (-dirZ / distance) * pushFactor;

                // 2. Tangential velocity boost (spin effect around the center)
                const cx = -dirX;
                const cz = -dirZ;
                let tx = -cz;
                let tz = cx;
                const tLen = Math.sqrt(tx * tx + tz * tz);
                if (tLen > 0.001) {
                    tx /= tLen;
                    tz /= tLen;
                }

                // Apply combined radial repulsion + tangential whip impulse
                body.applyImpulse({
                    x: rx + tx * tangentialBoostStrength,
                    y: ry,
                    z: rz + tz * tangentialBoostStrength,
                }, true);
            } else {
                // Standard gravitational pull when outside the threshold
                const distanceSq = distance * distance;
                const forceMagnitude = (gravitationalStrength / distanceSq) * body.mass();

                body.applyImpulse({
                    x: (dirX / distance) * forceMagnitude,
                    y: (dirY / distance) * forceMagnitude,
                    z: (dirZ / distance) * forceMagnitude,
                }, true);
            }
        });

        world.step();
    });

    view.add(
        <Node>
            <Three
                ref={three}
                width={1920}
                height={1080}
                quality={1}
                background={'#1e1e2e'}
                scene={threeScene}
                camera={camera}
            />
        </Node>
    );

    let currentFrame = 0;

    yield loop(function*() {
        manager.sync(currentFrame);
        currentFrame = (currentFrame + 1) % totalFrames;

        threeScene.updateWorldMatrix(true, true);
        if (three()) {
            three().rerender();
        }
        yield;
    });

    yield* waitFor(30);
});
