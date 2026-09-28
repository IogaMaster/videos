import RAPIER from '@dimforge/rapier2d-compat';

export let world: RAPIER.World;
export let boxes: { id: number; body: RAPIER.RigidBody; width: number; height: number; color: string }[] = [];

export async function init2DPhysics() {
    // Always await initialization for the compat package
    await RAPIER.init();

    const gravity = { x: 0.0, y: 9.81 * 25 };
    world = new RAPIER.World(gravity);

    // Static Floor Platform
    const floorBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, 300);
    const floorBody = world.createRigidBody(floorBodyDesc);
    const floorColliderDesc = RAPIER.ColliderDesc.cuboid(600, 20);
    world.createCollider(floorColliderDesc, floorBody);

    // Containment Walls
    const leftWallDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(-320, 100);
    const leftWallBody = world.createRigidBody(leftWallDesc);
    world.createCollider(RAPIER.ColliderDesc.cuboid(20, 250), leftWallBody);

    const rightWallDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(320, 100);
    const rightWallBody = world.createRigidBody(rightWallDesc);
    world.createCollider(RAPIER.ColliderDesc.cuboid(20, 250), rightWallBody);

    const colors = [
        '#f38ba8', // Red
        '#fab387', // Peach
        '#a6e3a1', // Green
        '#94e2d5', // Teal
        '#89b4fa', // Blue
        '#cba6f7', // Mauve
        '#f5c2e7', // Pink
    ];

    boxes = [];

    for (let i = 0; i < 7; i++) {
        const width = 130 - i * 8;
        const height = 45;

        const startX = Math.sin(i * 1.5) * 45;
        const startY = -220 - i * 60;

        const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(startX, startY)
            .setLinvel(Math.cos(i) * 6, 0)
            .setAngvel(Math.sin(i) * 2.5);

        const body = world.createRigidBody(bodyDesc);
        const colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2)
            .setRestitution(0.15)
            .setFriction(0.9);

        world.createCollider(colliderDesc, body);

        boxes.push({
            id: i,
            body,
            width,
            height,
            color: colors[i % colors.length],
        });
    }
}
