import { Img, Layout, Rect, Txt, Video } from '@motion-canvas/2d/lib/components';
import { CodeBlock, insert, lines } from '@motion-canvas/2d/lib/components/CodeBlock';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { all, delay, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { DEFAULT } from '@motion-canvas/core/lib/signals';
import { easeInOutCubic } from '@motion-canvas/core/lib/tweening';
import { Color, Vector2 } from '@motion-canvas/core/lib/types';
import { createRef } from '@motion-canvas/core/lib/utils';


import createShellMp4 from "./creatingShell.mp4";
import shellMp4 from "./shell.mp4";
import nixLogo from "./nix-snowflake.svg";

export default makeScene2D(function*(view) {
    view.fill('#11111b')
    const logoRef = createRef<Img>();

    view.add(
        <Img ref={logoRef} src={nixLogo} y={-900} />
    );

    const langRef = createRef<Txt>();
    const packRef = createRef<Txt>();
    const operRef = createRef<Txt>();

    const textLayoutRef = createRef<Layout>();
    view.add(
        <>
            <Rect fill="#1e1e2e" direction={'column'} gap={40} y={800} radius={25} padding={15} ref={textLayoutRef} layout>
                <Txt textAlign={'center'} ref={langRef} fill={'#cdd6f4'} opacity={0} lineHeight={80} width={640} fontFamily="JetBrains Mono" position={0} >
                    Programming Language
                </Txt>
                <Txt textAlign={'center'} ref={packRef} fill={'#cdd6f4'} opacity={0} lineHeight={80} width={640} fontFamily="JetBrains Mono" position={0}>
                    Package Manager
                </Txt>
                <Txt textAlign={'center'} ref={operRef} fill={'#cdd6f4'} opacity={0} lineHeight={80} width={640} fontFamily="JetBrains Mono" position={0}>
                    Operating System
                </Txt>
            </Rect>
        </>,
    )

    yield* waitUntil("nix_logo")
    yield* logoRef().position.y(-900, 1).to(0, 1);

    yield* waitUntil("three_things")
    yield* logoRef().position.y(-200, 1);
    yield* textLayoutRef().position.y(250, 1);

    yield* waitUntil("programming_language");
    yield* langRef().opacity(100, 0.7);

    yield* waitUntil("package_manager");
    yield* packRef().opacity(100, 0.7);

    yield* waitUntil("operating_system");
    yield* operRef().opacity(100, 0.7);

    yield* waitUntil("not_need");
    yield* operRef().opacity(0.3, 1);
    yield* waitFor(2);
    yield* operRef().opacity(1, 1);

    yield* waitFor(3);

    yield* all(
        langRef().opacity(1, 0.6).to(0, 0.4),
        packRef().opacity(1, 0.6).to(0, 0.5),
        operRef().opacity(1, 0.6).to(0, 0.6),
    );

    yield* waitUntil("let_me_show_you");
    const createVideoRef = createRef<Video>();
    yield* all(
        textLayoutRef().position(0, 0.6),
        textLayoutRef().size(
            [1920 - 160, 1080 - 160],
            0.6,
            easeInOutCubic,
            Vector2.arcLerp,
        ),
    );
    yield* all(
        langRef().remove(),
        packRef().remove(),
        operRef().remove(),
    );
    textLayoutRef().add(<Video src={createShellMp4} ref={createVideoRef} opacity={0} />);
    yield* all(
        createVideoRef().opacity(1, 0.6, easeInOutCubic),
        createVideoRef().play(),
    )
    yield* delay(
        3,
        createVideoRef().opacity(0, 0.6, easeInOutCubic)
    )
    yield* createVideoRef().remove()

    yield* waitUntil("import_nixpkgs")
    const codeRef = createRef<CodeBlock>();
    yield textLayoutRef().add(
        <CodeBlock language='nix' ref={codeRef} opacity={0} code={`
        { pkgs ? import <nixpkgs> { } }: 
        `} />
    )
    yield* codeRef().opacity(1, 0.6);

    yield* waitUntil("make_shell")
    yield* codeRef().edit(1.2)`
    { pkgs ? import <nixpkgs> { } }:${insert(`
pkgs.mkShell {

}
    `)}
    `

    yield* waitUntil("nativeBuildInputs")
    yield* codeRef().edit(1.2)`
    { pkgs ? import <nixpkgs> { } }:
    pkgs.mkShell {
        ${insert(`nativeBuildInputs = with pkgs; [
            
    ];
    `)}
    }
    `

    yield* waitUntil("add_zig_zls")
    yield* codeRef().edit(1.2)`
{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
    nativeBuildInputs = with pkgs; [
      ${insert(`zig 
      zls`)}
    ];

}
    `


    yield* waitUntil("buildInputs")
    yield* codeRef().edit(1.2)`
{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
    nativeBuildInputs = with pkgs; [
      zig 
      zls
    ];
    ${insert(`buildInputs = with pkgs; [
      
    ];`)}
}
    `

    yield* waitUntil("add_sdl2")
    yield* codeRef().edit(1.2)`
{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
    nativeBuildInputs = with pkgs; [
      zig 
      zls
    ];
    buildInputs = with pkgs; [
      ${insert(`SDL2`)} 
    ];
}
    `

    yield* delay(
        1.5,
        codeRef().selection(lines(0, 60), 0.6)
    )

    yield* waitUntil("nix-shell")
    const shellRef = createRef<Video>();
    yield* codeRef().opacity(0, 0.6);

    textLayoutRef().add(<Video src={shellMp4} ref={shellRef} opacity={0} />);
    yield* all(
        codeRef().remove(),
        shellRef().opacity(1, 0.6, easeInOutCubic),
    )
    delay(0.7, shellRef().play())

    yield* waitUntil("end_shell")
    yield* shellRef().opacity(0, 0.6, easeInOutCubic);
    yield* all(shellRef().remove(), logoRef().remove(),)
    view.add(<Txt fill="#cdd6f4" fontFamily="JetBrains Mono" fontSize={120} zIndex={-1}>Thanks for watching!</Txt>)
    yield* all(
        textLayoutRef().position(0, 0.6),
        textLayoutRef().size(
            [0, 0],
            0.6,
            easeInOutCubic,
            Vector2.arcLerp,
        ),
    );
    yield* textLayoutRef().remove()

    yield* waitUntil("end")

});



