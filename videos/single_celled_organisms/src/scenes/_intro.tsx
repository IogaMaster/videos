import { CubicBezier, Layout, makeScene2D, Txt } from '@canvas-commons/2d';
import {
    createRef,
    easeInOutCubic,
    loop,
    tween,
    waitFor,
    waitUntil,
} from '@canvas-commons/core';
import {
    Colors,
    defaultScene,
    GridBackground,
    hexToRgba,
    loadModel,
    Pop,
    Three,
} from 'toolkit';
import * as THREE from 'three';

import piranhaUrl from '../assets/piranhahigh.gltf?url';

function colorModel(model: THREE.Object3D, color: string) {
    model.traverse(child => {
        if (child instanceof THREE.Mesh) {
            if (child.material instanceof THREE.MeshStandardMaterial) {
                child.material = child.material.clone();
                child.material.color.set(color);
                child.material.emissiveIntensity = 1;
                child.material.roughness = 1;
                child.material.metalness = 0;
            }
        }
    });
}

export default makeScene2D(function*(view) {
    const title = createRef<Txt>();
    const three = createRef<Three>();
    const bezier = createRef<CubicBezier>();
    const pop = createRef<Pop>();

    const scene = defaultScene(false);

    const camera = new THREE.PerspectiveCamera(
        30,
        1920 / 1080,
        0.1,
        1000,
    );

    camera.position.set(0, 6, 8);
    camera.lookAt(0, 0, 0);

    // --------------------------------------------------
    // Fish
    // --------------------------------------------------

    const fish = yield loadModel(piranhaUrl);
    colorModel(fish, Colors.red);

    fish.position.set(0, 0, 0);
    fish.rotation.set(-0.3, 0.9, 0);
    fish.scale.setScalar(0);

    scene.add(fish);

    // --------------------------------------------------
    // Motion Canvas
    // --------------------------------------------------

    view.add(
        <GridBackground
            kind="dots"
            majorEvery={4}
            drift={[15, 8]}
        >
            <Layout
                layout
                gap={20}
                padding={10}
                width={1920}
                height={1080 * 0.6}
                direction="column"
                alignItems="center"
            >
                <Txt
                    ref={title}
                    text=""
                    fill={Colors.text}
                    fontSize={123}
                    fontFamily="Libron"
                    fontWeight={700}
                    grow={1}
                />

                <Three
                    ref={three}
                    width={1920}
                    height={1080}
                    scene={scene}
                    camera={camera}
                    quality={1}
                />
            </Layout>

            <CubicBezier
                ref={bezier}
                lineWidth={13}
                stroke={Colors.text}
                p0={[430, -175]}
                p1={[500, -50]}
                p2={[400, 50]}
                p3={[320, 70]}
                end={0}
                arrowSize={32}
                endArrow
            />

            <Pop
                ref={pop}
                position={[0, 0]}
                radius={350}
                startRadius={220}
                rays={12}
                lineWidth={21}
                color={Colors.text}
            />
        </GridBackground>
    );

    // --------------------------------------------------
    // Three.js render loop
    // --------------------------------------------------

    let rotat = fish.rotation.y;

    yield loop(function*(t) {
        fish.rotation.y = rotat + Math.sin(t / 7) * 0.1;

        scene.updateWorldMatrix(true, true);
        three().rerender();

        yield;
    });

    // --------------------------------------------------
    // Spawn
    // --------------------------------------------------
    yield* waitUntil("fish_enter");

    yield tween(0.35, value => {
        const s = easeInOutCubic(value) * 8;
        fish.scale.setScalar(s);
    });
    yield* pop().pop(0.3);


    yield* waitUntil("title");



    yield* title().height(200, 0.2);

    yield bezier().end(
        1,
        0.5,
        easeInOutCubic,
    );
    yield* title().text(
        'Working Brain',
        0.6,
        easeInOutCubic,
    );

    yield* waitFor(5);
});
