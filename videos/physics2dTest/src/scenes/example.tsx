import { makeScene2D, Node, Rect, Txt } from '@canvas-commons/2d';
import { createRef, loop, waitFor, createRef as createSignalRef } from '@canvas-commons/core';
import { init2DPhysics, world, boxes } from '../simulations/main';
import { PhysicsManager, LineBoil } from 'toolkit';

export default makeScene2D(function*(view) {
    // 1. Initialize physics WASM context safely
    yield init2DPhysics();

    const manager = new PhysicsManager();
    const lineBoil = new LineBoil(4, 60); // 4 FPS line boil over a 60 FPS timeline

    const boxRefs = boxes.map(() => createSignalRef<Rect>());
    const containerRef = createSignalRef<Node>(); // Parent container for automatic child line boiling

    boxes.forEach((boxData, index) => {
        manager.register(boxData.body, (pos, rot) => {
            const ref = boxRefs[index];
            if (ref()) {
                ref().position([pos.x, pos.y]);
                ref().rotation((rot * 180) / Math.PI);
            }
        });
    });

    // 2. Bake 400 frames of physics history
    manager.bake(world, 60 * 20);

    // 3. Build Scene Layout View Elements
    view.add(
        <Node>
            <Rect width={1920} height={1080} fill={'#1e1e2e'} />

            {/* Parent Node ref so LineBoil can automatically iterate through its children */}
            <Node ref={containerRef} position={[0, -30]}>
                {/* Platform Floor Visual */}
                <Rect
                    width={640}
                    height={40}
                    fill={'#313244'}
                    stroke={'#cdd6f4'}
                    lineWidth={3}
                    position={[0, 300]}
                    radius={8}
                    rough
                    roughness={1}
                    roughFillStyle={'cross-hatch'}
                />

                {/* Left Wall */}
                <Rect
                    width={40}
                    height={500}
                    fill={'#313244'}
                    stroke={'#cdd6f4'}
                    lineWidth={3}
                    position={[-320, 100]}
                    radius={8}
                    rough
                    roughness={1}
                    roughFillStyle={'cross-hatch'}
                />

                {/* Right Wall */}
                <Rect
                    width={40}
                    height={500}
                    fill={'#313244'}
                    stroke={'#cdd6f4'}
                    lineWidth={3}
                    position={[320, 100]}
                    radius={8}


                    rough
                    roughness={1}
                    roughFillStyle={'cross-hatch'}
                />

                {/* Dynamic Boxes Visuals */}
                {boxes.map((boxData, index) => (
                    <Rect
                        ref={boxRefs[index]}
                        key={boxData.id}
                        width={boxData.width}
                        height={boxData.height}
                        fill={boxData.color}
                        stroke={'#cdd6f4'}
                        lineWidth={3}
                        radius={8}
                        rough
                        roughness={1}
                        roughFillStyle={'cross-hatch'}
                    />
                ))}
            </Node>
        </Node>
    );

    let currentFrame = 0;

    // 4. Combined Simulation & LineBoil Loop
    yield loop(function*() {
        manager.sync(currentFrame);
        lineBoil.apply(containerRef);
        currentFrame = (currentFrame + 1) % 400;
        yield;
    });

    yield* waitFor(6);
});
