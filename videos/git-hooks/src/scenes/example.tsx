import { Img, Layout, makeScene2D, Rect, Txt, Video } from '@motion-canvas/2d';
import { all, createRef, delay, easeInOutCubic, Vector2, waitFor, waitUntil } from '@motion-canvas/core';

import { CodeStyle, Logo, setupView, slideIn, slideOut, Window } from "components"
import {
    CodeBlock,
    edit,
    insert,
    lines,
    remove,
} from "@motion-canvas/2d/lib/components/CodeBlock";


import gitHookImage from "../assets/git-hook.svg";
import dirImage from "../assets/dir.png";
import sampleImage from "../assets/sample.png";
import branchesImage from "../assets/branches.png";
import hookMp4 from "../assets/hook.mp4";



export default makeScene2D(function*(view) {
    setupView(view);

    const logo = createRef<Logo>();
    view.add(<Logo ref={logo} />)
    yield* logo().animateToCorner();

    yield* waitUntil("git-hook enter");
    const gitHook = createRef<Img>();
    view.add(<Img ref={gitHook} src={gitHookImage} scale={3.5} y={-1000} />);
    yield* slideIn(gitHook)


    yield* waitUntil("remove git-hook");
    yield* slideOut(gitHook, [0, 1000])

    yield* waitUntil("types");
    const langRef = createRef<Txt>();
    const packRef = createRef<Txt>();
    const operRef = createRef<Txt>();

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
                width={640}
                fontFamily="JetBrains Mono"
                position={0}
            >
                pre-commit
            </Txt>
            <Txt
                textAlign={"center"}
                ref={packRef}
                fill={"#cdd6f4"}
                opacity={0}
                lineHeight={80}
                width={640}
                fontFamily="JetBrains Mono"
                position={0}
            >
                post-commit
            </Txt>
            <Txt
                textAlign={"center"}
                ref={operRef}
                fill={"#cdd6f4"}
                opacity={0}
                lineHeight={80}
                width={640}
                fontFamily="JetBrains Mono"
                position={0}
            >
                pre-push
            </Txt>
        </Rect>
    </>,
    );
    yield* textLayoutRef().position.y(0, 1);


    yield* waitUntil("pre");
    yield* langRef().opacity(100, 0.7);

    yield* waitUntil("post");
    yield* packRef().opacity(100, 0.7);
    yield* waitUntil("push");
    yield* operRef().opacity(100, 0.7);


    yield* waitUntil("remove list")
    yield* all(
        langRef().opacity(0, 1),
        delay(0.2, packRef().opacity(0, 1)),
    )
    delay(0.4, operRef().opacity(0, 1))
    yield* textLayoutRef().opacity(0, 0.2);

    yield* waitUntil("hooks dir")
    const dir = createRef<Img>();
    view.add(<Img ref={dir} src={dirImage} scale={1.6} x={-2000} radius={25} />);
    yield* slideIn(dir)
    yield* waitFor(3);
    yield* slideOut(dir, [-2000, 0])



    yield* waitUntil("sample")
    const sample = createRef<Img>();
    view.add(<Img ref={sample} src={sampleImage} scale={1.4} x={2000} radius={25} />);

    yield* slideIn(sample)

    yield* waitUntil("stylua check")

    yield* slideOut(sample, [2000, 0])
    const windowRef = createRef<Window>();
    const codeBlockRef = createRef<CodeBlock>();
    yield view.add(<Window title={"Editor"} ref={windowRef} size={0}>
        <Layout direction={'column'} width={960} gap={40} layout>
            <CodeBlock {...CodeStyle} ref={codeBlockRef} language="sh" code={`
# .git/hooks/pre-commit
stylua --check
            `} />
        </Layout>
    </Window>)
    yield* windowRef().size([1080, 720], 0.6, easeInOutCubic, Vector2.arcLerp)

    yield* waitUntil("no main")
    yield* windowRef().close();
    const branches = createRef<Img>();
    view.add(<Img ref={branches} src={branchesImage} scale={3} y={2000} radius={25} zIndex={-1} />);
    yield* slideIn(branches)

    yield* waitUntil("this hook checks")
    yield* branches().opacity(0, 0.2)
    yield* codeBlockRef().edit()`
# .git/hooks/pre-commit
stylua --check
${insert(`current_branch=$(git symbolic-ref --short HEAD)
if [ "$current_branch" == "main" ]; then
  echo "Direct commits to the main branch are not allowed."
  echo "Please create a pull request."
  exit 1
fi`)}
`
    yield* windowRef().open()

    yield* waitUntil("after")
    yield* codeBlockRef().selection(lines(0, 1), 0.3)
    yield* waitFor(2);
    yield* codeBlockRef().selection(lines(0, 3000), 0.3)


    yield* waitUntil("fail")
    yield* windowRef().close()

    const hookVideo = createRef<Video>();
    view.add(<Video src={hookMp4} ref={hookVideo} scale={1.4} y={-2000} />)
    yield hookVideo().play()
    yield* slideIn(hookVideo)

    yield* waitUntil("end video")
    yield* slideOut(hookVideo, [0, 2000])

    yield* waitUntil("logo back")
    yield* logo().animateToCenter()

    yield* waitUntil("end")
});
