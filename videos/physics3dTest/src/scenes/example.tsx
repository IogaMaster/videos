import { makeScene2D, Node, Txt, Line, Rect } from '@canvas-commons/2d';
import { createRef, loop, waitFor, createRef as createSignalRef } from '@canvas-commons/core';
import { Three, PhysicsManager } from 'toolkit';
import * as THREE from 'three';
import { init3DPhysics, world, centralBody, sphereMesh, cubeObjects } from '../simulations/main';

interface TrackedCubeUI {
    containerRef: ReturnType<typeof createSignalRef<Node>>;
    textRef: ReturnType<typeof createSignalRef<Txt>>;
    arrowRef: ReturnType<typeof createSignalRef<Line>>;
    mesh: THREE.Mesh;
    color: string;
    prevPosition: THREE.Vector3;
}

export default makeScene2D(function*(view) {
    const three = createRef<Three>();

    const threeScene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, 1920 / 1080, 0.1, 1000);
    camera.position.set(0, 6, 16);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    threeScene.add(ambientLight);

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

    const gravitationalStrength = 10.0;
    const sphereRadius = 0.8;
    const boxHalfSize = 0.35;
    const minSafeDistance = sphereRadius + boxHalfSize + 0.4;
    const repulsionStrength = 1.5;
    const tangentialBoostStrength = 1.2;
    const totalFrames = 60 * 30;

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
                const pushFactor = (minSafeDistance - distance) * repulsionStrength;
                const rx = (-dirX / distance) * pushFactor;
                const ry = (-dirY / distance) * pushFactor;
                const rz = (-dirZ / distance) * pushFactor;

                const cx = -dirX;
                const cz = -dirZ;
                let tx = -cz;
                let tz = cx;
                const tLen = Math.sqrt(tx * tx + tz * tz);
                if (tLen > 0.001) {
                    tx /= tLen;
                    tz /= tLen;
                }

                body.applyImpulse({
                    x: rx + tx * tangentialBoostStrength,
                    y: ry,
                    z: rz + tz * tangentialBoostStrength,
                }, true);
            } else {
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

    // Setup 5 tracked UI elements mapped to the first 5 cubes
    const trackedCount = 5;
    const trackedCubes: TrackedCubeUI[] = [];

    for (let i = 0; i < trackedCount; i++) {
        const obj = cubeObjects[i];
        const mat = obj.mesh.material as THREE.MeshStandardMaterial;
        const color = '#' + mat.color.getHexString();

        const initialPos = new THREE.Vector3();
        obj.mesh.getWorldPosition(initialPos);

        trackedCubes.push({
            containerRef: createSignalRef<Node>(),
            textRef: createSignalRef<Txt>(),
            arrowRef: createSignalRef<Line>(),
            mesh: obj.mesh,
            color,
            prevPosition: initialPos,
        });
    }

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

            {/* Render 5 Unique Arrow Overlays and Label Containers */}
            {trackedCubes.map((item, index) => (
                <Node key={index}>
                    <Line
                        ref={item.arrowRef}
                        points={[[0, 0], [0, 0]]}
                        stroke={item.color}
                        lineWidth={3}
                        endArrow
                        arrowSize={10}
                        zIndex={9}
                    />
                    <Node ref={item.containerRef} zIndex={10}>
                        <Rect
                            width={160}
                            height={64}
                            fill={'#181825'}
                            stroke={item.color}
                            lineWidth={2}
                            radius={10}
                            shadowBlur={16}
                            shadowColor={'rgba(0, 0, 0, 0.6)'}
                        />
                        <Txt
                            ref={item.textRef}
                            text={''}
                            fill={'#cdd6f4'}
                            fontFamily={'JetBrains Mono, monospace'}
                            fontSize={16}
                            fontWeight={700}
                            lineHeight={22}
                        />
                    </Node>
                </Node>
            ))}
        </Node>
    );

    let currentFrame = 0;

    yield loop(function*() {
        manager.sync(currentFrame);

        // Update positions, velocities, and project UI elements for all 5 cubes
        trackedCubes.forEach((item, index) => {
            const currentPos = new THREE.Vector3();
            item.mesh.getWorldPosition(currentPos);

            const velocityVector = currentPos.clone().sub(item.prevPosition).divideScalar(1 / 60);
            const speed = velocityVector.length().toFixed(1);
            item.prevPosition.copy(currentPos);

            const startNDC = currentPos.clone().project(camera);
            const startX = (startNDC.x * 1920) / 2;
            const startY = -(startNDC.y * 1080) / 2;

            const endPos = currentPos.clone().add(velocityVector.clone().multiplyScalar(0.25));
            const endNDC = endPos.clone().project(camera);
            const endX = (endNDC.x * 1920) / 2;
            const endY = -(endNDC.y * 1080) / 2;

            if (item.arrowRef()) {
                item.arrowRef().points([[startX, startY], [endX, endY]]);
            }

            if (item.containerRef()) {
                item.containerRef().position([startX + 80, startY - 48]);
            }

            if (item.textRef()) {
                item.textRef().text(`CUBE ${index}\n${speed} m/s`);
            }
        });

        currentFrame = (currentFrame + 1) % totalFrames;

        threeScene.updateWorldMatrix(true, true);
        if (three()) {
            three().rerender();
        }
        yield;
    });

    yield* waitFor(10);
});
