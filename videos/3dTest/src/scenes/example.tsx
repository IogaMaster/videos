import { makeScene2D, Node } from '@canvas-commons/2d';
import { createRef, loop, tween, waitFor } from '@canvas-commons/core';
import { Three } from 'toolkit';
import * as gameThree from '../simulations/main';
import * as THREE from 'three';

export default makeScene2D(function*(view) {
    const three = createRef<Three>();

    view.add(
        <Node>
            <Three
                ref={three}
                width={1920}
                height={1080}
                quality={1}
                background={'#1e1e2e'} // Catppuccin Mocha Base
                scene={gameThree.threeScene}
                camera={gameThree.camera}
            />
        </Node>
    );

    // Background Orbit & Rotation Loop Task
    yield loop(() =>
        tween(8, value => {
            const baseAngle = value * Math.PI * 2;
            const orbitRadius = 15;

            // Symmetrical Ring Distribution Math
            gameThree.cube1.position.set(Math.cos(baseAngle) * orbitRadius, 0, Math.sin(baseAngle) * orbitRadius);
            gameThree.cube1.rotation.set(value * Math.PI * 2, value * Math.PI * 4, 0);

            const angle2 = baseAngle + (2 * Math.PI / 3);
            gameThree.cube2.position.set(Math.cos(angle2) * orbitRadius, 0, Math.sin(angle2) * orbitRadius);
            gameThree.cube2.rotation.set(value * Math.PI * 4, 0, value * Math.PI * 2);

            const angle3 = baseAngle + (4 * Math.PI / 3);
            gameThree.cube3.position.set(Math.cos(angle3) * orbitRadius, 0, Math.sin(angle3) * orbitRadius);
            gameThree.cube3.rotation.set(0, value * Math.PI * 2, value * Math.PI * 4);

            gameThree.threeScene.updateWorldMatrix(true, true);
            three().rerender();
        })
    );

    // Keeps the presentation viewport window rendering indefinitely
    yield* waitFor(10);
});
