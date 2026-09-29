import { makeScene2D, Node, Rect, Txt, Line, Circle } from '@canvas-commons/2d';
import { createRef, all, tween, easeInOutCubic, easeOutBack, waitFor } from '@canvas-commons/core';
import { Colors } from 'toolkit';

export default makeScene2D(function*(view) {
    const titleBox = createRef<Node>();
    const line1 = createRef<Txt>();
    const line2 = createRef<Txt>();
    const badgeText = createRef<Txt>();
    const badgeBg = createRef<Rect>();
    const underline = createRef<Line>();

    view.add(
        <Node>
            {/* Background */}
            <Rect width={3840} height={2160} fill={Colors.base} zIndex={-20} />

            {/* --- CENTRAL TITLE GROUP --- */}
            <Node ref={titleBox} position={[0, 0]}>

                {/* Category Badge */}
                <Rect
                    ref={badgeBg}
                    width={0}
                    height={36}
                    radius={18}
                    fill={Colors.mantle}
                    stroke={Colors.lavender}
                    lineWidth={1.5}
                    position={[0, -110]}
                    scale={0}
                >
                    <Txt
                        ref={badgeText}
                        text={'Localhost Live // 2026'}
                        fill={Colors.lavender}
                        fontSize={14}
                        fontFamily={'JetBrains Mono, monospace'}
                        fontWeight={700}
                        opacity={0}
                    />
                </Rect>

                {/* Main Title - Line 1 */}
                <Txt
                    ref={line1}
                    text={''}
                    fill={Colors.text}
                    fontSize={62}
                    fontFamily={'JetBrains Mono, monospace'}
                    fontWeight={800}
                    position={[0, -25]}
                    textAlign={'center'}
                />

                {/* Main Title - Line 2 */}
                <Txt
                    ref={line2}
                    text={''}
                    fill={Colors.blue}
                    fontSize={52}
                    fontFamily={'JetBrains Mono, monospace'}
                    fontWeight={700}
                    position={[0, 45]}
                    textAlign={'center'}
                />

                {/* Elegant Underline */}
                <Line
                    ref={underline}
                    points={[[-300, 110], [300, 110]]}
                    stroke={Colors.subtext}
                    lineWidth={2}
                    lineCap={'round'}
                    scale={[0, 1]}
                    opacity={0.5}
                />
            </Node>

            {/* Subtle Ambient Glow Orbs */}
            <Circle size={400} fill={Colors.mantle} position={[-600, -300]} opacity={0.5} />
            <Circle size={400} fill={Colors.mantle} position={[600, 300]} opacity={0.5} />
        </Node>
    );

    // --- ANIMATION SEQUENCE ---
    yield* waitFor(0.4);

    // 1. Spring pop-in for badge
    yield all(
        badgeBg().scale(2, 1.3, easeOutBack),
        badgeBg().width(210, 0.5, easeOutBack),
        badgeText().opacity(1, 0.3),
    );

    yield* waitFor(0.15);

    // 2. Typewriter / fade-in for two-line title
    yield all(
        line1().text('Building Animated Physics & Simulations', 0.8, easeInOutCubic),
    );

    yield* all(
        line2().text('Using Motion Canvas', 0.6, easeInOutCubic),
        underline().scale([1, 1], 0.7, easeInOutCubic),
    );

    // Hold frame ready
    yield* waitFor(3.5);
});
