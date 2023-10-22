import { Icon, Img, Layout, makeScene2D, Rect, Video } from '@motion-canvas/2d';
import { all, createRef, easeInOutCubic, easeInOutQuart, easeInOutQuint, Vector2, waitFor, waitUntil } from '@motion-canvas/core';
import { CodeStyle, Colors, Logo, scrollScreenshot, setupView, slideIn, slideOut, Window } from 'components';

import {
    CodeBlock,
    edit,
    insert,
    lines,
    remove,
} from "@motion-canvas/2d/lib/components/CodeBlock";

import githubImage from "../assets/github.png"
import rec from '../assets/rec.mp4'
import terminal from '../assets/terminal.mp4'
import cripplerblood from '../assets/cripplerblood.png'


export default makeScene2D(function*(view) {
    setupView(view)

    const logoRef = createRef<Logo>();
    view.add(<Logo ref={logoRef} />)
    yield logoRef().animateToCorner();

    yield* waitUntil("filetree in")
    const fileTree = createRef<Icon>();
    view.add(<Icon icon={"material-symbols:folder-copy"} ref={fileTree} color={Colors.text} scale={27} y={-2000} />)
    yield* slideIn(fileTree)

    yield* waitUntil("zoxide is")
    const github = createRef<Img>();
    view.add(<Img src={githubImage} ref={github} scale={1.2} y={3200} opacity={0} />)
    yield github().opacity(1, 0.1)
    yield scrollScreenshot(github)
    yield* fileTree().opacity(0, 0.1)

    yield* waitUntil("end scroll")
    yield* github().opacity(0, 0.1)

    yield* waitUntil("logs")
    const spy = createRef<Icon>();
    view.add(<Icon
        icon={"twemoji:magnifying-glass-tilted-left"}
        ref={spy}
        scale={22}
        zIndex={2}
        x={-2000}
    />)

    yield* fileTree().opacity(1, 0.1)
    yield* slideIn(spy)
    yield* waitFor(0.3);
    yield* spy().position(250, 0.5)
    yield* spy().position(-250, 0.5)
    yield* spy().x(0, 0.5)
    yield* spy().y(0, 0.5)

    yield* waitUntil("database")
    yield spy().opacity(0, 0.3)

    yield* waitUntil("selects")
    const list = createRef<Icon>();
    view.add(<Icon
        icon={"ph:list-magnifying-glass-bold"}
        ref={list}
        scale={15}
        zIndex={2}
        y={2000}
        color={Colors.text}
    />)

    yield* list().position([0, 325], 0.5, easeInOutQuart)

    yield* waitUntil("remove")
    yield list().opacity(0, 0.1)
    yield fileTree().opacity(0, 0.1)

    yield* waitUntil("web")
    const videoRef = createRef<Video>();
    yield view.add(<Video ref={videoRef} src={rec} scale={1.6} radius={20} opacity={0} />)
    yield* videoRef().opacity(1, 0.4)

    yield videoRef().play();
    yield* waitUntil("stopvideo")
    yield videoRef().pause();
    yield* waitFor(0.7);
    yield* slideOut(videoRef, [0, -2000])

    yield* waitUntil("package")
    const packageIcon = createRef<Icon>();
    view.add(<Icon
        icon={"streamline:shipping-transfer-cart-package-box-fulfillment-cart-warehouse-shipping-delivery"}
        ref={packageIcon}
        scale={15}
        y={-2000}
        color={Colors.text}
    />)
    yield* slideIn(packageIcon)

    yield* waitUntil("hook")
    const windowRef = createRef<Window>();
    const codeBlockRef = createRef<CodeBlock>();
    yield view.add(<Window title={"Editor"} ref={windowRef} size={0}>
        <Layout direction={'column'} width={960} gap={40} layout>
            <CodeBlock {...CodeStyle} ref={codeBlockRef} language="sh" fontSize={48} code={`
# Bash
eval "$(zoxide init bash)"

# ZSH
eval "$(zoxide init zsh)"

# Fish
zoxide init fish | source
            `} />
        </Layout>
    </Window>)
    yield* windowRef().size([1080, 720], 0.6, easeInOutCubic, Vector2.arcLerp)

    yield* packageIcon().opacity(0, 0.001)

    yield* waitUntil("closeWindow")
    yield windowRef().close()

    yield* waitUntil("open terminal")
    const terminalVideoRef = createRef<Video>();
    const terminalWindowRef = createRef<Video>();
    yield view.add(<Window title={"Terminal"} ref={terminalWindowRef} size={0}> <Video ref={terminalVideoRef} src={terminal} size={[1080 - 20, 720 - 75]} radius={20} /> </Window>)
    yield* view.add(<Rect fill={Colors.crust} size={[20, 20]} x={345} y={325} />)
    yield terminalVideoRef().play();
    yield* terminalWindowRef().size([1080, 720], 0.6, easeInOutCubic, Vector2.arcLerp)
    yield* waitUntil("endvideo")
    yield terminalVideoRef().pause();

    yield* waitUntil("closewindow")
    yield* all(terminalWindowRef().size(0, 0.6, easeInOutCubic), terminalVideoRef().opacity(0, 0.4))

    yield* waitUntil("popup logo")
    yield* logoRef().animateToCenter()

    yield* waitUntil("cripplerblood")
    yield logoRef().y(-200, 0.6, easeInOutCubic)
    yield logoRef().scale(0.9, 0.6, easeInOutCubic)
    const crippler = createRef<Img>();
    view.add(<Img src={cripplerblood} ref={crippler} scale={1.6} y={2000} opacity={1} radius={50} />)
    yield* crippler().y(360, 0.5, easeInOutCubic)

    yield* waitUntil("cripplerblood out")
    yield* crippler().y(2000, 0.5, easeInOutCubic)
    yield logoRef().scale(1, 0.6, easeInOutCubic)
    yield logoRef().y(0, 0.6, easeInOutCubic)

    yield* waitFor(6);
});
