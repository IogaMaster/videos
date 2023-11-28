import { Img, Layout, makeScene2D, Rect, Txt } from '@motion-canvas/2d';
import { all, createRef, delay, easeInOutQuad, waitFor, waitUntil } from '@motion-canvas/core';
import { Logo, setupView, slideIn, slideOut } from 'components';

import nixosLogo from "../assets/flake.webp";

export default makeScene2D(function*(view) {
    setupView(view);
    const logoRef = createRef<Logo>();
    view.add(<Logo ref={logoRef} />)
    yield logoRef().animateToCorner();

    const nixosLogoRef = createRef<Img>();
    view.add(<Img src={nixosLogo} ref={nixosLogoRef} y={-2000} />)
    yield* slideIn(nixosLogoRef)

    yield* waitUntil("remove logo");
    yield* slideOut(nixosLogoRef, [0, 2000])

    yield* waitUntil("monolithic");
    const langRef = createRef<Txt>();
    const packRef = createRef<Txt>();

    const textLayoutRef = createRef<Layout>();
    view.add(<>
        <Rect
            fill="#1e1e2e"
            direction={"column"}
            gap={40}
            y={800}
            radius={25}
            padding={15}
            ref={textLayoutRef}
            layout
        >
            <Txt
                textAlign={"center"}
                ref={langRef}
                fill={"#cdd6f4"}
                opacity={0}
                lineHeight={80}
                width={770}
                fontFamily="JetBrains Mono"
                position={0}
            >
                configuration.nix
            </Txt>
            <Txt
                textAlign={"center"}
                ref={packRef}
                fill={"#cdd6f4"}
                opacity={0}
                lineHeight={80}
                width={770}
                fontFamily="JetBrains Mono"
                position={0}
            >
                hardware-configuration.nix
            </Txt>
        </Rect>
    </>,
    );
    yield* textLayoutRef().position.y(0, 1);


    yield* waitUntil("config");
    yield* langRef().opacity(100, 1.2);

    yield* waitUntil("hardware");
    yield* packRef().opacity(100, 1.2);


    yield* waitUntil("remove list")
    yield* all(
        langRef().opacity(0, 1),
        delay(0.2, packRef().opacity(0, 1)),
    )
    yield* textLayoutRef().opacity(0, 0.2);

    // --------- Flakes ------------
    yield* waitUntil("flakes");


    yield* waitFor(500);
});
