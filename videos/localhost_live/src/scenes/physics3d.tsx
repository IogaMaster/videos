import { makeScene2D, Node, Txt, Line, Rect } from '@canvas-commons/2d';
import { createRef, loop, waitFor, createRef as createSignalRef } from '@canvas-commons/core';
import { Three, PhysicsManager, Colors } from 'toolkit';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { createSeededRandom } from 'toolkit/utils/random';

// Interface defining the data structure for tracked UI elements (velocity overlays on cubes)
interface TrackedCubeUI {
    containerRef: ReturnType<typeof createSignalRef<Node>>;
    textRef: ReturnType<typeof createSignalRef<Txt>>;
    arrowRef: ReturnType<typeof createSignalRef<Line>>;
    mesh: THREE.Mesh;
    color: string;
    prevPosition: THREE.Vector3;
}

// --- CONFIGURATION CONSTANTS ---
const TOTAL_FRAMES = 60 * 30; // 30 seconds at 60 FPS
const TRACKED_COUNT = 5; // (NOTE: CHANGEME)
const RESOLUTION = { width: 1920, height: 1080 };

export default makeScene2D(function*(view) {
    // Seeded random number generator for reproducible cube placements and properties
    const random = createSeededRandom(663);

    // --- 1. CORE SCENE & CAMERA SETUP ---
    // Initialize Three.js integration bindings and create the 3D scene graph
    const three = createRef<Three>();
    const threeScene = new THREE.Scene();

    // Set up a perspective camera looking down at the origin from an angled elevation
    const camera = new THREE.PerspectiveCamera(60, RESOLUTION.width / RESOLUTION.height, 0.1, 1000);
    camera.position.set(0, 7, 18);
    camera.lookAt(0, 0, 0);

    // Populate lighting, shadows, and background plane
    setupLightingAndEnvironment(threeScene);

    // --- 2. PHYSICS ENGINE & WORLD INITIALIZATION ---
    // Boot up Rapier WebAssembly physics engine and configure a zero-gravity world
    yield RAPIER.init();
    const world = new RAPIER.World({ x: 0.0, y: 0.0, z: 0.0 });
    world.timestep = 1 / 60; // Fixed 60Hz physics timestep

    // Create our central moving body (the "stirrer") and surrounding dynamic cubes
    const { centralBody, sphereMesh } = createCentralBody(threeScene, world);
    const cubeObjects = createOrbitingCubes(threeScene, world, random);

    // --- 3. CUSTOM PHYSICS BAKING & GRAVITATIONAL FORCES ---
    // The PhysicsManager links our 3D meshes to physics bodies and handles pre-baking frames
    const manager = new PhysicsManager();
    registerPhysicsMeshSync(manager, centralBody, sphereMesh, cubeObjects);

    // Custom bake loop: executed frame-by-frame to inject custom forces before stepping the simulation
    manager.customBake(TOTAL_FRAMES, (frameIndex) => {
        // Normalize frame index into a continuous loop angle (0 to 2*PI)
        const t = (frameIndex / TOTAL_FRAMES) * Math.PI * 2;

        // Animate the central body in a complex 3D Lissajous-like motion path
        const targetX = Math.sin(t * 1.5) * 1.5;
        const targetY = Math.cos(t * 0.8) * 0.8;
        const targetZ = Math.sin(t * 2) * 1.0;

        centralBody.setTranslation({ x: targetX, y: targetY, z: targetZ }, true);

        // Apply custom orbital gravity or repulsion forces on every dynamic cube relative to the center
        cubeObjects.forEach(({ body }) => {
            const pos = body.translation();
            const dir = { x: targetX - pos.x, y: targetY - pos.y, z: targetZ - pos.z };
            const distance = Math.sqrt(dir.x ** 2 + dir.y ** 2 + dir.z ** 2);

            const minSafeDist = 0.8 + 0.35 + 0.4; // Combined collision safety buffer radius

            if (distance < minSafeDist) {
                // Push cubes outward if they get too close to prevent clipping/overlapping
                applyRepulsionForce(body, dir, distance, minSafeDist);
            } else {
                // Pull cubes inward using inverse-square gravitational attraction
                applyGravitationalPull(body, dir, distance);
            }
        });

        // Step the physics simulation forward by one increment
        world.step();
    });

    // --- 4. 2D OVERLAY UI SETUP ---
    // Sets up 2D canvas elements (velocity vectors & text boxes) tracking specific 3D cubes
    const trackedCubes = setupTrackedUI(cubeObjects, TRACKED_COUNT);

    view.add(
        <Node>
            {/* Render the Three.js viewport into our 2D motion graphics scene */}
            <Three
                ref={three}
                width={RESOLUTION.width}
                height={RESOLUTION.height}
                quality={1}
                background={Colors.base || '#11111b'}
                scene={threeScene}
                camera={camera}
            />

            {/* Render UI cards and velocity indicator lines for tracked items */}
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
                            fill={Colors.mantle || '#181825'}
                            stroke={item.color}
                            lineWidth={2}
                            radius={10}
                            shadowBlur={16}
                            shadowColor={'rgba(0, 0, 0, 0.6)'}
                        />
                        <Txt
                            ref={item.textRef}
                            text={''}
                            fill={Colors.text || '#cdd6f4'}
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

    // --- 5. SYNCHRONIZED RENDERING LOOP ---
    // Runs alongside the motion timeline to sync baked physics data and project 3D coords to 2D UI overlay space
    let currentFrame = 0;

    yield loop(function*() {
        manager.sync(currentFrame);

        trackedCubes.forEach((item, index) => {
            const currentPos = new THREE.Vector3();
            item.mesh.getWorldPosition(currentPos);

            // Calculate instantaneous speed vector based on delta position changes per frame
            const velocityVector = currentPos.clone().sub(item.prevPosition).divideScalar(1 / 60);
            const speed = velocityVector.length().toFixed(1);
            item.prevPosition.copy(currentPos);

            // Project 3D world coordinates into 2D Screen Normalized Device Coordinates (NDC)
            const startNDC = currentPos.clone().project(camera);
            const startX = (startNDC.x * RESOLUTION.width) / 2;
            const startY = -(startNDC.y * RESOLUTION.height) / 2;

            const endPos = currentPos.clone().add(velocityVector.clone().multiplyScalar(0.25));
            const endNDC = endPos.clone().project(camera);
            const endX = (endNDC.x * RESOLUTION.width) / 2;
            const endY = -(endNDC.y * RESOLUTION.height) / 2;

            // Update UI element positions and dynamic text labels
            if (item.arrowRef()) item.arrowRef().points([[startX, startY], [endX, endY]]);
            if (item.containerRef()) item.containerRef().position([startX + 80, startY - 48]);
            if (item.textRef()) item.textRef().text(`CUBE ${index}\n${speed} m/s`);
        });

        currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
        threeScene.updateWorldMatrix(true, true);
        if (three()) three().rerender();
        yield;
    });

    yield* waitFor(30);
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Configures scene ambient lighting, a high-res directional shadow-casting light, and a floor drop shadow plane
function setupLightingAndEnvironment(scene: THREE.Scene) {
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(20, 35, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;

    const d = 100;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const groundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.ShadowMaterial({ opacity: 0.3 })
    );
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -6;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);
}

// Creates the kinematic central body object that drives the simulation forces
function createCentralBody(scene: THREE.Scene, world: RAPIER.World) {
    const radius = 0.8;
    const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 0, 0);
    const centralBody = world.createRigidBody(bodyDesc);
    world.createCollider(RAPIER.ColliderDesc.ball(radius), centralBody);

    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 32, 32),
        new THREE.MeshStandardMaterial({
            color: Colors.blue || '#89b4fa',
            emissive: Colors.blue || '#89b4fa',
            emissiveIntensity: 0.8,
            roughness: 0.2,
        })
    );
    mesh.castShadow = true;
    scene.add(mesh);

    return { centralBody, sphereMesh: mesh };
}

// Spawns and configures the ring of dynamic orbiting cubes with initial random velocities and colors
function createOrbitingCubes(scene: THREE.Scene, world: RAPIER.World, random: () => number) {
    const cubeObjects: { body: RAPIER.RigidBody; mesh: THREE.Mesh }[] = [];
    const count = 15;

    const palette = [
        Colors.red || '#f38ba8',
        Colors.peach || '#fab387',
        Colors.green || '#a6e3a1',
        Colors.teal || '#94e2d5',
        Colors.mauve || '#cba6f7',
        Colors.pink || '#f5c2e7',
    ];

    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = 5.5 + random() * 2.0;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (random() - 0.5) * 2.0;

        const speedScale = 4.8 + random() * 2.5;
        const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(x, y, z)
            .setLinvel(-Math.sin(angle) * speedScale, (random() - 0.5) * 2.0, Math.cos(angle) * speedScale)
            .setAngvel({
                x: (random() - 0.5) * 1.5,
                y: (random() - 0.5) * 2.0,
                z: (random() - 0.5) * 1.5,
            });

        const body = world.createRigidBody(bodyDesc);
        const boxSize = 0.6 + random() * 0.3;
        world.createCollider(RAPIER.ColliderDesc.cuboid(boxSize / 2, boxSize / 2, boxSize / 2).setRestitution(0.7), body);

        const color = palette[i % palette.length];
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(boxSize, boxSize, boxSize),
            new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4, roughness: 0.3 })
        );
        mesh.castShadow = true;
        scene.add(mesh);

        cubeObjects.push({ body, mesh });
    }
    return cubeObjects;
}

// Binds Rapier physics transformations directly to Three.js renderable meshes
function registerPhysicsMeshSync(manager: PhysicsManager, centralBody: RAPIER.RigidBody, sphereMesh: THREE.Mesh, cubes: { body: RAPIER.RigidBody; mesh: THREE.Mesh }[]) {
    manager.register(centralBody, (pos) => sphereMesh.position.set(pos.x, pos.y, pos.z));
    cubes.forEach(({ body, mesh }) => {
        manager.register(body, (pos, rot) => {
            mesh.position.set(pos.x, pos.y, pos.z);
            mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);
        });
    });
}

// Computes a repulsive force vector plus a tangential push to keep objects from colliding into the center core
function applyRepulsionForce(body: RAPIER.RigidBody, dir: { x: number; y: number; z: number }, distance: number, minSafeDist: number) {
    const pushFactor = (minSafeDist - distance) * 0.8;
    const rx = (-dir.x / distance) * pushFactor;
    const ry = (-dir.y / distance) * pushFactor;
    const rz = (-dir.z / distance) * pushFactor;

    let tx = dir.z, tz = -dir.x;
    const tLen = Math.sqrt(tx * tx + tz * tz);
    if (tLen > 0.001) { tx /= tLen; tz /= tLen; }

    body.applyImpulse({ x: rx + tx * 0.5, y: ry, z: rz + tz * 0.5 }, true);
}

// Applies simulated inverse-square gravitational attraction toward the center target
function applyGravitationalPull(body: RAPIER.RigidBody, dir: { x: number; y: number; z: number }, distance: number) {
    const forceMag = (6.5 / (distance * distance)) * body.mass();
    body.applyImpulse({
        x: (dir.x / distance) * forceMag,
        y: (dir.y / distance) * forceMag,
        z: (dir.z / distance) * forceMag,
    }, true);
}

// Initializes tracking states for the 2D overlays mapped onto selected cubes
function setupTrackedUI(cubes: { body: RAPIER.RigidBody; mesh: THREE.Mesh }[], count: number): TrackedCubeUI[] {
    const tracked: TrackedCubeUI[] = [];
    for (let i = 0; i < count; i++) {
        const obj = cubes[i];
        const mat = obj.mesh.material as THREE.MeshStandardMaterial;
        const initialPos = new THREE.Vector3();
        obj.mesh.getWorldPosition(initialPos);

        tracked.push({
            containerRef: createSignalRef<Node>(),
            textRef: createSignalRef<Txt>(),
            arrowRef: createSignalRef<Line>(),
            mesh: obj.mesh,
            color: '#' + mat.color.getHexString(),
            prevPosition: initialPos,
        });
    }
    return tracked;
}
