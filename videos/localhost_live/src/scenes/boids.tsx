import { makeScene2D, Node } from '@canvas-commons/2d';
import { createRef, loop, waitFor } from '@canvas-commons/core';
import { Three, Colors } from 'toolkit';
import { createSeededRandom } from 'toolkit/utils/random';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import piranhaUrl from '../assets/piranhahigh.gltf?url';
import sharkUrl from '../assets/shork.gltf?url';

const WIDTH = 1920;
const HEIGHT = 1080;
const BOID_COUNT = 500;
const BOUNDS = new THREE.Vector3(14, 8, 10);
const CELL_SIZE = 3.0;

// Color palette using the Colors library by name
const PALETTE = [
    Colors.red, Colors.peach, Colors.yellow, Colors.green,
    Colors.teal, Colors.sky, Colors.blue, Colors.lavender,
    Colors.mauve, Colors.pink
];

// ==========================================
// SPATIAL GRID (O(N) Neighbor Lookup)
// ==========================================
class SpatialGrid {
    private map = new Map<string, Boid[]>();

    constructor(private cellSize: number) { }

    clear() {
        this.map.clear();
    }

    insert(boid: Boid) {
        const cx = Math.floor(boid.position.x / this.cellSize);
        const cy = Math.floor(boid.position.y / this.cellSize);
        const cz = Math.floor(boid.position.z / this.cellSize);
        const key = `${cx},${cy},${cz}`;

        let cell = this.map.get(key);
        if (!cell) {
            cell = [];
            this.map.set(key, cell);
        }
        cell.push(boid);
    }

    getNeighbors(pos: THREE.Vector3, radius: number): Boid[] {
        const neighbors: Boid[] = [];
        const r = Math.ceil(radius / this.cellSize);
        const baseCx = Math.floor(pos.x / this.cellSize);
        const baseCy = Math.floor(pos.y / this.cellSize);
        const baseCz = Math.floor(pos.z / this.cellSize);

        for (let x = -r; x <= r; x++) {
            for (let y = -r; y <= r; y++) {
                for (let z = -r; z <= r; z++) {
                    const cell = this.map.get(`${baseCx + x},${baseCy + y},${baseCz + z}`);
                    if (cell) neighbors.push(...cell);
                }
            }
        }
        return neighbors;
    }
}

const spatialGrid = new SpatialGrid(CELL_SIZE);

// ==========================================
// BOID
// ==========================================
class Boid {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    acceleration = new THREE.Vector3();
    mesh: THREE.Group;
    maxSpeed = 0.12;
    maxForce = 0.004;
    private swimOffset: number;

    constructor(scene: THREE.Scene, template: THREE.Group, random: () => number) {
        this.swimOffset = random() * Math.PI * 2;
        this.position = new THREE.Vector3(
            (random() - 0.5) * BOUNDS.x * 0.8,
            (random() - 0.5) * BOUNDS.y * 0.8,
            (random() - 0.5) * BOUNDS.z * 0.8
        );
        this.velocity = new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5)
            .normalize()
            .multiplyScalar(this.maxSpeed);

        this.mesh = template.clone();
        this.mesh.scale.setScalar(0.65);

        // Pick a unique color from the Colors palette
        const color = PALETTE[Math.floor(random() * PALETTE.length)];

        this.mesh.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const mat = mesh.material;
                const materials = Array.isArray(mat) ? mat : [mat];

                // Clone materials so each boid has its own independent color instance
                const clonedMaterials = materials.map(m => {
                    if (!m) return m;
                    const newMat = m.clone();
                    if ('color' in newMat) {
                        const stdMat = newMat as THREE.MeshStandardMaterial;
                        stdMat.color.set(color);
                        stdMat.emissive.set(color);
                        stdMat.emissiveIntensity = 2.0;
                        stdMat.roughness = 1.0;
                        stdMat.metalness = 0.0;
                    }
                    return newMat;
                });

                mesh.material = Array.isArray(mat) ? clonedMaterials : clonedMaterials[0];
            }
        });

        scene.add(this.mesh);
    }

    applyForce(force: THREE.Vector3) {
        this.acceleration.add(force);
    }

    update(time: number) {
        this.velocity.add(this.acceleration).clampLength(0.03, this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0, 0);

        // Smooth boundary steering
        const margin = 2.5;
        (['x', 'y', 'z'] as const).forEach(axis => {
            const limit = BOUNDS[axis];
            const pos = this.position[axis];
            if (Math.abs(pos) > limit - margin) {
                const steerFactor = (Math.abs(pos) - (limit - margin)) / margin;
                this.velocity[axis] -= Math.sign(pos) * steerFactor * 0.012;
            }
        });

        this.mesh.position.copy(this.position);
        if (this.velocity.lengthSq() > 0.0001) {
            this.mesh.lookAt(this.position.clone().add(this.velocity));
            this.mesh.rotateY(Math.sin(time * 15 + this.swimOffset) * 0.25);
        }
    }

    flock(predator: Predator) {
        const neighbors = spatialGrid.getNeighbors(this.position, 3.5);

        this.applyForce(this.separate(neighbors).multiplyScalar(2.0));
        this.applyForce(this.align(neighbors).multiplyScalar(1.2));
        this.applyForce(this.cohere(neighbors).multiplyScalar(1.0));
        this.applyForce(this.orbitCenter().multiplyScalar(2.5));
        this.applyForce(this.flee(predator.position).multiplyScalar(3.5));
    }

    private seek(target: THREE.Vector3): THREE.Vector3 {
        return target.clone().sub(this.position).normalize().multiplyScalar(this.maxSpeed).sub(this.velocity).clampLength(0, this.maxForce);
    }

    private orbitCenter(): THREE.Vector3 {
        const toCenter = new THREE.Vector3().sub(this.position);
        const tangent = new THREE.Vector3(-toCenter.z, 0, toCenter.x).normalize();
        const radial = toCenter.clone().normalize().multiplyScalar((toCenter.length() - 4.0) * 0.12);
        return tangent.add(radial).normalize().multiplyScalar(this.maxSpeed).sub(this.velocity).clampLength(0, this.maxForce);
    }

    private flee(target: THREE.Vector3): THREE.Vector3 {
        const desired = this.position.clone().sub(target);
        if (desired.lengthSq() < 36.0) {
            return desired.normalize().multiplyScalar(this.maxSpeed * 1.5).sub(this.velocity).clampLength(0, this.maxForce * 1.8);
        }
        return new THREE.Vector3();
    }

    private separate(neighbors: Boid[]): THREE.Vector3 {
        const steer = new THREE.Vector3();
        let count = 0;
        for (const other of neighbors) {
            if (other === this) continue;
            const dSq = this.position.distanceToSquared(other.position);
            if (dSq > 0 && dSq < 1.44) {
                const diff = this.position.clone().sub(other.position).normalize().divideScalar(Math.sqrt(dSq));
                steer.add(diff);
                count++;
            }
        }
        if (count > 0) {
            steer.divideScalar(count);
            if (steer.lengthSq() > 0) {
                return steer.normalize().multiplyScalar(this.maxSpeed).sub(this.velocity).clampLength(0, this.maxForce * 1.5);
            }
        }
        return new THREE.Vector3();
    }

    private align(neighbors: Boid[]): THREE.Vector3 {
        const sum = new THREE.Vector3();
        let count = 0;
        for (const other of neighbors) {
            if (other === this) continue;
            if (this.position.distanceToSquared(other.position) < 7.84) {
                sum.add(other.velocity);
                count++;
            }
        }
        return count > 0 ? sum.divideScalar(count).normalize().multiplyScalar(this.maxSpeed).sub(this.velocity).clampLength(0, this.maxForce) : new THREE.Vector3();
    }

    private cohere(neighbors: Boid[]): THREE.Vector3 {
        const sum = new THREE.Vector3();
        let count = 0;
        for (const other of neighbors) {
            if (other === this) continue;
            if (this.position.distanceToSquared(other.position) < 10.24) {
                sum.add(other.position);
                count++;
            }
        }
        return count > 0 ? this.seek(sum.divideScalar(count)) : new THREE.Vector3();
    }
}

// ==========================================
// PREDATOR
// ==========================================
class Predator {
    position = new THREE.Vector3();
    velocity = new THREE.Vector3(1, 0, 0);
    acceleration = new THREE.Vector3();
    mesh: THREE.Group;
    maxSpeed = 0.08;
    maxForce = 0.0035;

    private currentTarget: Boid | null = null;
    private targetTimer = 0;
    private isDashReady = true;
    private isDashing = false;
    private dashTimer = 0;
    private dashCooldown = 0;

    constructor(scene: THREE.Scene, template: THREE.Group) {
        this.mesh = template.clone();
        scene.add(this.mesh);
    }

    update(boids: Boid[], random: () => number) {
        if (--this.targetTimer <= 0 || !this.currentTarget) {
            this.currentTarget = boids[Math.floor(random() * boids.length)];
            this.targetTimer = 140;
        }

        if (this.currentTarget) {
            const dist = this.position.distanceTo(this.currentTarget.position);
            if (dist < 10.0 && dist > 1.5 && this.isDashReady && !this.isDashing) {
                this.isDashing = true;
                this.dashTimer = 35;
                this.isDashReady = false;
                this.dashCooldown = 120;
            }

            let speed = this.maxSpeed;
            if (this.isDashing) {
                speed *= 3.2;
                if (--this.dashTimer <= 0) this.isDashing = false;
            } else {
                if (this.dashCooldown > 0) this.dashCooldown--;
                else this.isDashReady = true;
            }

            const desired = this.currentTarget.position.clone().sub(this.position).normalize().multiplyScalar(speed);
            const steer = desired.sub(this.velocity).clampLength(0, this.maxForce * (this.isDashing ? 2.2 : 1));
            this.acceleration.add(steer);
        }

        this.velocity.add(this.acceleration).clampLength(0.02, this.isDashing ? this.maxSpeed * 3.2 : this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0, 0);

        const margin = 2.5;
        (['x', 'y', 'z'] as const).forEach(axis => {
            const limit = BOUNDS[axis];
            const pos = this.position[axis];
            if (Math.abs(pos) > limit - margin) {
                const steerFactor = (Math.abs(pos) - (limit - margin)) / margin;
                this.velocity[axis] -= Math.sign(pos) * steerFactor * 0.012;
            }
        });

        this.mesh.position.copy(this.position);
        if (this.velocity.lengthSq() > 0.0001) {
            this.mesh.lookAt(this.position.clone().add(this.velocity));
        }
    }
}

// ==========================================
// SCENE SETUP & MAIN LOOP
// ==========================================
export default makeScene2D(function*(view) {
    const random = createSeededRandom(6764);
    const three = createRef<Three>();
    const scene = new THREE.Scene();

    // Lighting & Environment
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(20, 35, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    dirLight.shadow.camera.left = dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.right = dirLight.shadow.camera.top = 100;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.ShadowMaterial({ opacity: 0.3 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -18.5;
    ground.receiveShadow = true;
    scene.add(ground);

    const camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 1000);
    camera.position.set(0, 8, 16);
    camera.lookAt(0, 0, 0);

    // Load Models
    const gltfLoader = new GLTFLoader();
    const [piranhaGltf, sharkGltf] = yield Promise.all([
        gltfLoader.loadAsync(piranhaUrl),
        gltfLoader.loadAsync(sharkUrl),
    ]);

    [piranhaGltf.scene, sharkGltf.scene].forEach(s => {
        s.traverse(child => {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = child.receiveShadow = true;
            }
        });
    });

    // Create Entities
    const boids = Array.from({ length: BOID_COUNT }, () => new Boid(scene, piranhaGltf.scene, random));
    const predator = new Predator(scene, sharkGltf.scene);

    view.add(
        <Node>
            <Three
                ref={three}
                width={WIDTH}
                height={HEIGHT}
                quality={1}
                background={Colors.base || '#11111b'}
                scene={scene}
                camera={camera}
            />
        </Node>
    );

    if (three()?.renderer) {
        three().renderer.shadowMap.enabled = true;
        three().renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    let frameCount = 0;
    yield loop(function*() {
        frameCount++;
        const time = frameCount * 0.05;

        spatialGrid.clear();
        for (const boid of boids) spatialGrid.insert(boid);

        predator.update(boids, random);
        for (const boid of boids) {
            boid.flock(predator);
            boid.update(time);
        }

        scene.updateWorldMatrix(true, true);
        three()?.rerender();
        yield;
    });

    yield* waitFor(30);
});
