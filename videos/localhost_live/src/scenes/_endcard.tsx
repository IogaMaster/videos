import { makeScene2D, Node, Rect, Txt, Circle, Img } from '@canvas-commons/2d';
import { createRef, all, easeOutBack, easeInOutCubic, waitFor } from '@canvas-commons/core';
import { Colors } from 'toolkit';

import qrCodeUrl from '../assets/qr_code.png?url';

export default makeScene2D(function*(view) {
    // Endcard refs
    const endcardGroup = createRef<Node>();
    const qrContainer = createRef<Rect>();
    const endcardTitle = createRef<Txt>();
    const endcardUrl = createRef<Txt>();

    view.add(
        <Node>
            {/* Background */}
            <Rect width={3840} height={2160} fill={Colors.base} zIndex={-20} />

            {/* --- ENDCARD GROUP --- */}
            <Node ref={endcardGroup} opacity={0} scale={0.9} position={[0, 0]}>
                <Txt
                    ref={endcardTitle}
                    text={'Hope you enjoyed!'}
                    fill={Colors.text}
                    fontSize={56}
                    fontFamily={'JetBrains Mono, monospace'}
                    fontWeight={800}
                    position={[0, -380]}
                    textAlign={'center'}
                />

                {/* QR Code Container */}
                <Rect
                    ref={qrContainer}
                    width={360 * 1.8}
                    height={360 * 1.8}
                    radius={28}
                    fill={Colors.mantle}
                    stroke={Colors.surface0}
                    lineWidth={4}
                    position={[0, 10]}
                    shadowBlur={30}
                    shadowColor={'rgba(0, 0, 0, 0.4)'}
                >
                    {/* Rendered QR Code Image */}
                    <Img
                        src={qrCodeUrl}
                        width={300 * 2}
                        height={300 * 2}
                        radius={16}
                    />
                </Rect>

                <Txt
                    ref={endcardUrl}
                    text={'github.com/iogamaster/videos'}
                    fill={Colors.lavender}
                    fontSize={32}
                    fontFamily={'JetBrains Mono, monospace'}
                    fontWeight={600}
                    position={[0, 400]}
                    textAlign={'center'}
                />
            </Node>

            {/* Subtle Ambient Glow Orbs */}
            <Circle size={400} fill={Colors.mantle} position={[-600, -300]} opacity={0.5} />
            <Circle size={400} fill={Colors.mantle} position={[600, 300]} opacity={0.5} />
        </Node>
    );

    // --- ANIMATION SEQUENCE ---
    yield* waitFor(0.3);

    // Smooth entrance for the endcard
    yield* all(
        endcardGroup().opacity(1, 0.8, easeInOutCubic),
        endcardGroup().scale(1, 0.8, easeOutBack),
    );

    // Hold final endcard frame ready
    yield* waitFor(4.0);
});
