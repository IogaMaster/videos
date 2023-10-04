import { Img, Layout, makeScene2D, Rect, Txt, Video } from '@motion-canvas/2d';
import { all, createRef, easeInOutCubic, easeInOutElastic, easeInOutQuart, easeInQuart, linear, Vector2, waitFor, waitUntil } from '@motion-canvas/core';
import {
    CodeBlock,
    edit,
    insert,
    lines,
    remove,
} from "@motion-canvas/2d/lib/components/CodeBlock";
import { CodeStyle, Colors, Logo, setupView, WhiteLabel, Window } from 'components';

import direnvSvg from '../assets/direnv-logo.svg'
import discordSvg from '../assets/discord.svg'
import filesPng from '../assets/files.png'
import githubPageImg from '../assets/nix-direnv.png'
import switchingMp4 from '../assets/switching.mp4'
import approveMp4 from '../assets/approve.mp4'
import kofi from '../assets/ko-fi.png'

export default makeScene2D(function*(view) {
    setupView(view)


    const direnvLogo = createRef<Img>();
    const logoRef = createRef<Logo>();
    view.add(<Logo ref={logoRef} />)
    view.add(<Img ref={direnvLogo} src={direnvSvg} y={-700} />)
    yield* logoRef().animateToCorner();

    yield* waitUntil("direnv")
    yield* direnvLogo().y(0, 0.6, easeInOutCubic)

    yield* waitUntil("files")
    yield* direnvLogo().y(700, 0.6, easeInOutCubic)
    const filesRef = createRef<Img>();
    view.add(<Img ref={filesRef} src={filesPng} scale={2.7} x={-2000} y={50} />)

    yield* filesRef().x(0, 0.6, easeInOutCubic)

    yield* waitUntil("envrc")
    const highlightRef = createRef<Rect>();
    view.add(
        <Rect
            size={[1035, 245]}
            ref={highlightRef}
            stroke={Colors.blue}
            lineWidth={18}
            x={0}
            radius={20}
            zIndex={2}
            opacity={0}
            y={-165}
        />,
    );
    yield* highlightRef().opacity(1, 0.4);
    yield* waitFor(0.2)
    yield* highlightRef().y(110, 0.4)
    yield* highlightRef().opacity(0, 0.4)


    yield* waitUntil("signif")
    const exclam = createRef<Txt>();
    view.add(<Txt ref={exclam} {...WhiteLabel} fontSize={200} y={-145} x={-575} zIndex={3} opacity={0}>❗</Txt>)
    yield* exclam().opacity(1, 0.3)
    yield* exclam().rotation(10, 0.1, easeInOutQuart)
    yield* exclam().rotation(-10, 0.1, easeInOutQuart)
    yield* exclam().rotation(10, 0.1, easeInOutQuart)
    yield* exclam().rotation(-10, 0.1, easeInOutQuart)
    yield* exclam().rotation(0, 0.1, easeInOutQuart)
    yield* waitFor(0.5)
    yield* exclam().opacity(0, 0.3)

    yield* waitUntil("switching")
    const videoRef = createRef<Video>();
    const windowRef = createRef<Video>();
    yield view.add(<Window title={"Terminal"} ref={windowRef} size={0}> <Video ref={videoRef} src={switchingMp4} size={[1080 - 20, 720 - 75]} radius={20} /> </Window>)
    yield videoRef().play();
    yield* filesRef().x(-2000, 0.6, easeInOutCubic)
    yield* windowRef().size([1080, 720], 0.6, easeInOutCubic, Vector2.arcLerp)
    yield* waitUntil("stopvideo")
    yield videoRef().pause();
    yield* all(windowRef().size(0, 0.6, easeInOutCubic), videoRef().opacity(0, 0.4))

    yield* waitUntil("package")
    const packageEmojiRef = createRef<Txt>();
    view.add(<Txt ref={packageEmojiRef} {...WhiteLabel} fontSize={256} y={1000}>📦</Txt>)
    yield* packageEmojiRef().position(0, 0.6)

    yield* waitUntil("shell conf")
    yield* packageEmojiRef().opacity(0, 0.1)
    const windowRefTwo = createRef<Video>();
    const codeBlockRef = createRef<CodeBlock>();
    yield view.add(<Window title={"Editor"} ref={windowRefTwo} size={0}>
        <Layout direction={'column'} width={960} gap={40} layout>
            <CodeBlock {...CodeStyle} ref={codeBlockRef} language="sh" code={`
# Bash
eval "$(direnv hook bash)"

# ZSH
eval "$(direnv hook zsh)"

# Fish
eval "$(direnv hook zsh)"
            `} />
        </Layout>
    </Window>)
    yield* windowRefTwo().size([1080, 720], 0.6, easeInOutCubic, Vector2.arcLerp)

    yield* waitUntil("quiet")
    yield* codeBlockRef().edit()`
# Bash
eval "$(direnv hook bash)"

# ZSH
eval "$(direnv hook zsh)"

# Fish
eval "$(direnv hook zsh)"

${insert(`export DIRENV_LOG_FORMAT=""`)}
`


    yield* waitUntil("highlight normal")
    yield* codeBlockRef().selection(lines(0, 23), 0.4)


    yield* waitUntil("envrcfileediting")
    yield* codeBlockRef().edit()`
${remove(`# Bash
eval "$(direnv hook bash)"

# ZSH
eval "$(direnv hook zsh)"

# Fish
eval "$(direnv hook zsh)"

export DIRENV_LOG_FORMAT=""`)}
`

    yield* codeBlockRef().edit()`
${insert(`# .envrc
export FOO="Hello, World!"
`)}`




    yield* waitUntil("approve")
    const windowRef3 = createRef<Window>();
    const approveRef = createRef<Video>();
    view.add(<Window title={"Terminal"} ref={windowRef3} size={25}> <Video ref={approveRef} src={approveMp4} size={[1180 - 20, 820 - 75]} radius={20} /> </Window>)
    yield* windowRef3().size([1180, 820], 0.6, easeInOutCubic, Vector2.arcLerp)
    yield approveRef().play()
    yield* windowRefTwo().size(0, 0.2)

    yield* waitUntil("nix")
    yield* all(windowRef3().size(0, 0.6, easeInOutCubic), approveRef().opacity(0, 0.4))
    yield videoRef().remove()
    yield approveRef().remove()

    yield* waitUntil("nix-direnv")
    const githubPageImgRef = createRef<Img>();
    view.add(<Img ref={githubPageImgRef} src={githubPageImg} y={3200} opacity={0} />)
    yield* all(githubPageImgRef().opacity(1, 0.3),
        githubPageImgRef().y(0, 16.5, linear))
    yield* githubPageImgRef().opacity(0, 0.3),

        yield* waitUntil("using")
    yield* codeBlockRef().edit()`
# .envrc
`
    yield* windowRefTwo().size([1080, 720], 0.6, easeInOutCubic, Vector2.arcLerp)

    yield* waitUntil("shell or default")

    yield* codeBlockRef().edit()`
# .envrc
${insert(`use nix`)}
`


    yield* waitUntil("nonstandard name")
    yield* codeBlockRef().edit()`
# .envrc
use nix ${insert(`myenv.nix`)}
`
    yield* waitFor(0.6);
    yield* codeBlockRef().selection(lines(0, 12), 0.3)

    yield* waitUntil("if")

    yield* codeBlockRef().edit()`
# .envrc
${remove(`use nix myenv.nix`)}
`


    yield* waitUntil("flake")
    yield* codeBlockRef().edit()`
# .envrc
${insert(`use flake`)}
`



    yield* waitUntil("editors")
    yield* windowRefTwo().size(0, 0.6)

    yield* waitUntil("outro")
    yield* logoRef().animateToCenter()
    const kofiRef = createRef<Img>();
    view.add(<Img ref={kofiRef} src={kofi} x={-650} opacity={0} scale={1.6} />)

    yield* waitUntil("kofi")
    yield* kofiRef().opacity(1, 0.4)

    yield* waitUntil("discord")
    const discordRef = createRef<Img>();
    yield view.add(<Img ref={discordRef} src={discordSvg} x={625} scale={2} opacity={0} />)
    yield* discordRef().opacity(1, 0.4)

    yield* waitUntil("done")
    yield* all(kofiRef().opacity(0, 0.4),
        discordRef().opacity(0, 0.4))


    yield* waitFor(2);
});
