import { makeScene2D, Node, Rect, Circle, Txt } from '@canvas-commons/2d';
import { loop, waitFor, createRef, slideTransition, Direction } from '@canvas-commons/core';
import { Colors, PhysicsManager } from 'toolkit';
import RAPIER from '@dimforge/rapier2d-compat';
import { createSeededRandom } from 'toolkit/utils/random';

// --- CONFIGURATION CONSTANTS ---
const sim_seconds = 12;
const BOX_COUNT = 200;     // Total number of dynamic physics cubes in the avalanche
const BAKED_FRAMES = 60 * sim_seconds;  // Total frames pre-calculated for the physics loop (10 seconds at 60fps)

export default makeScene2D(function*(view) {
    // --- 1. PHYSICS & ENGINE INITIALIZATION ---
    yield RAPIER.init();

    // Create the physics world with a downward gravity pull on the Y-axis
    const world = new RAPIER.World({ x: 0, y: 350 });
    const physicsManager = new PhysicsManager();

    // Seeded random guarantees the exact same physics drop on every reload/scrub
    const rnd = createSeededRandom(42);

    // --- 2. ENVIRONMENT & COLLIDER HELPERS ---
    // Helper function to easily spawn static obstacles (walls, floor, or pegs)
    const addStatic = (x: number, y: number, w: number, h: number, isBall = false) => {
        const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y));
        const desc = isBall
            ? RAPIER.ColliderDesc.ball(w)
            : RAPIER.ColliderDesc.cuboid(w / 2, h / 2);
        world.createCollider(desc, body);
    };

    // --- 3. BUILD ARENA BOUNDARIES ---
    // Floor and vertical side walls containing the simulation container
    addStatic(0, 380, 720, 40);   // Floor
    addStatic(-360, 60, 40, 640); // Left Wall
    addStatic(360, 60, 40, 640);  // Right Wall

    // --- 4. BUILD PLINKO OBSTACLE PEGS ---
    // Generate staggered rows of circular pegs for the boxes to bounce through
    const pegs: { x: number; y: number; r: number }[] = [];
    for (let r = 0; r < 4; r++) {
        const cols = r % 2 === 0 ? 3 : 2; // Alternate column counts per row
        const spacing = 190;
        const startX = -((cols - 1) * spacing) / 2;
        const y = -80 + r * 95;

        for (let c = 0; c < cols; c++) {
            const x = startX + c * spacing;
            addStatic(x, y, 15, 0, true); // Create static circle collider
            pegs.push({ x, y, r: 15 });
        }
    }

    // --- 5. SETUP DYNAMIC FALLING BOXES ---
    const palette = [
        Colors.red, Colors.peach, Colors.green, Colors.teal,
        Colors.blue, Colors.mauve, Colors.pink, Colors.lavender
    ];

    // Create canvas references for all 300 boxes so we can update their positions live
    const boxRefs = Array.from({ length: BOX_COUNT }, () => createRef<Rect>());

    const boxes = Array.from({ length: BOX_COUNT }, (_, i) => {
        const size = 14 + rnd() * 16; // Randomized box dimensions

        // Stagger spawn positions vertically above the screen so they cascade in waves
        const body = world.createRigidBody(
            RAPIER.RigidBodyDesc.dynamic().setTranslation((rnd() - 0.5) * 400, -500 - i * 10)
        );

        // Add physics properties (bounce / restitution and surface drag / friction)
        world.createCollider(
            RAPIER.ColliderDesc.cuboid(size / 2, size / 2)
                .setRestitution(0.2)
                .setFriction(0.5),
            body
        );

        // Bind the physics body position/rotation updates to the visual Motion Canvas nodes
        const ref = boxRefs[i];
        physicsManager.register(body, (pos, rot) => {
            ref()?.position([pos.x, pos.y]);
            ref()?.rotation(rot * (180 / Math.PI)); // Convert radians to degrees
        });

        return { size, color: palette[i % palette.length], ref };
    });

    // --- 6. PRE-BAKE PHYSICS TIMELINE ---
    // Pre-calculates all 600 frames upfront to ensure completely lag-free playback
    physicsManager.customBake(BAKED_FRAMES, () => world.step());

    // --- 7. VISUAL STYLING PRESETS ---
    const style = {
        stroke: Colors.text,
        lineWidth: 2,
        radius: 3,
    };

    // --- 8. SCENE GRAPH RENDERING ---
    view.add(
        <Node>
            {/* Background Canvas */}
            <Rect width={1920} height={1080} fill={Colors.base} />
            {/* Main Simulation Container Offset */}
            <Node position={[0, -20]}>
                {/* Static Arena Walls & Floor */}
                <Rect width={720} height={40} position={[0, 380]} fill={Colors.surface0} {...style} />
                <Rect width={40} height={640} position={[-360, 60]} fill={Colors.surface0} {...style} />
                <Rect width={40} height={640} position={[360, 60]} fill={Colors.surface0} {...style} />

                {/* Render Plinko Pegs */}
                {pegs.map((p, i) => (
                    <Circle
                        key={`peg-${i}`}
                        size={p.r * 2}
                        position={[p.x, p.y]}
                        fill={Colors.surface1}
                        stroke={Colors.text}
                        lineWidth={2}
                    />
                ))}

                {/* Render Dynamic Falling Cubes */}
                {boxes.map((b, i) => (
                    <Rect
                        key={`box-${i}`}
                        ref={b.ref}
                        width={b.size}
                        height={b.size}
                        fill={b.color}
                        {...style}
                    />
                ))}
            </Node>
        </Node>
    );

    // --- 9. ANIMATION PLAYBACK LOOP ---
    let frame = 0;
    yield loop(function*() {
        physicsManager.sync(frame); // Sync pre-baked physics frame to visual nodes
        frame = (frame + 1) % BAKED_FRAMES; // Loop back to start after 600 frames
        yield;
    });

    yield* slideTransition(Direction.Left);

    yield* waitFor(sim_seconds);
});
