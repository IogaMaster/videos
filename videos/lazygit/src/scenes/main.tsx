import { Img, Rect, Txt, Video } from "@motion-canvas/2d/lib/components";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { all, waitFor, waitUntil } from "@motion-canvas/core/lib/flow";
import {
    createEaseInElastic,
    easeInCubic,
    easeInOutCubic,
    linear,
} from "@motion-canvas/core/lib/tweening";
import { Vector2 } from "@motion-canvas/core/lib/types";
import { createRef } from "@motion-canvas/core/lib/utils";
import {
    Colors,
    WhiteLabel,
    BaseFont,
    setupView,
    Container,
} from "components";

import git from "../assets/git.svg";
import github from "../assets/lazygit_page.png";
import installVideo from "../assets/install.mp4";
import lazygitStill from "../assets/lazygit.png";
import lazygitVideo from "../assets/lazygit.mp4";

export default makeScene2D(function*(view) {
    setupView(view);

    const logoContainerRef = createRef<Rect>();
    const logoTextRef = createRef<Txt>();
    view.add(
        <Rect ref={logoContainerRef} scale={1.5} y={-900} zIndex={-15}>
            <Img src={git} scale={2} />
            <Txt {...WhiteLabel} ref={logoTextRef} fontSize={58} y={160}>
                Lazygit
            </Txt>
        </Rect>,
    );

    yield* waitUntil("lazygit");
    yield* logoContainerRef().y(0, 0.5);

    yield* waitUntil("lazygit is a ui");
    const webpageScrollRef = createRef<Img>();
    view.add(
        <Img
            src={github}
            ref={webpageScrollRef}
            y={5600}
            opacity={0}
            scale={1.1}
        ></Img>,
    );
    yield* all(
        webpageScrollRef().y(3000, 9.36, linear),
        webpageScrollRef().opacity(1, 0.6),
    );

    yield* waitUntil("first install lazygit");
    const bigBoxRef = createRef<Rect>();
    const installVideoRef = createRef<Video>();
    view.add(
        <Rect
            {...Container}
            ref={bigBoxRef}
            size={[1920 - 160, 1080 - 160]}
            zIndex={-1}
        >
            <Video src={installVideo} ref={installVideoRef} />
        </Rect>,
    );
    yield* webpageScrollRef().opacity(0, 0.3);
    yield* all(webpageScrollRef().remove(), installVideoRef().play());

    yield* waitUntil("when you open");
    const lazygitVideoRef = createRef<Video>();
    view.add(
        <Video src={lazygitVideo} ref={lazygitVideoRef} scale={0.85} opacity={0} />,
    );
    yield* lazygitVideoRef().opacity(1, 0.3);

    yield* waitUntil("status");
    const highlightRef = createRef<Rect>();
    view.add(
        <Rect
            size={[525, 75]}
            ref={highlightRef}
            stroke={Colors.blue}
            lineWidth={8}
            x={-540}
            radius={20}
            zIndex={2}
            opacity={0}
            y={-405}
        />,
    );
    yield* highlightRef().opacity(1, 0.4);

    yield* waitUntil("changes");
    yield* all(highlightRef().height(400, 1), highlightRef().y(-125, 1));

    yield* waitUntil("branches");
    yield* all(highlightRef().height(90, 1), highlightRef().y(140, 1));

    yield* waitUntil("commit history");
    yield* all(highlightRef().height(90, 1), highlightRef().y(245, 1));

    yield* waitUntil("stashed files");
    yield* all(highlightRef().height(90, 1), highlightRef().y(360, 1));

    yield* waitUntil("diff view");
    yield* all(
        highlightRef().height(850, 1),
        highlightRef().y(-25, 1),
        highlightRef().width(1080, 1),
        highlightRef().x(275, 1),
    );

    yield* waitUntil("hide_highlight");
    yield* highlightRef().opacity(0, 0.3);
    yield* highlightRef().remove();

    yield* waitUntil("lazygit showcase");
    lazygitVideoRef().play();

    yield* waitUntil("a key");
    const txtRef = createRef<Txt>();
    view.add(
        <Txt {...WhiteLabel} scale={2.5} ref={txtRef} opacity={0} y={505}>
            a
        </Txt>,
    );
    yield* txtRef().opacity(1, 0.1);

    yield* waitUntil("space key");
    yield* txtRef().text("SPC", 0.3);

    yield* waitUntil("enter");
    yield* txtRef().text("Enter", 0.3);

    yield* waitUntil("space ke");
    yield* txtRef().text("SPC", 0.3);

    yield* waitUntil("c key");
    yield* txtRef().text("c", 0.3);

    yield* waitUntil("enter2");
    yield* txtRef().text("Enter", 0.3);

    yield* waitUntil("Shift+P");
    yield* txtRef().text("Shift+P", 0.3);

    yield* waitUntil("p");
    yield* txtRef().text("p", 0.3);

    yield* waitUntil("shift d then x");
    yield* txtRef().text("Shift+D x", 0.3);

    yield* waitUntil("q");
    yield* txtRef().text("q", 0.3);

    yield* waitUntil("outro");
    yield* all(
        bigBoxRef().y(-1000, 2, easeInCubic),
        lazygitVideoRef().y(-1000, 2, easeInCubic),
        txtRef().opacity(0, 0.3),
    );
    yield* logoTextRef().text("Thanks for watching!", 2);

    yield* waitUntil("End");
});
