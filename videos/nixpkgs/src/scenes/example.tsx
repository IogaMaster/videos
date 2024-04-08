import { Circle, Code, Icon, Img, Layout, Rect, Txt, Video, makeScene2D } from '@motion-canvas/2d';
import { Vector2, createRef, easeInCirc, easeInOutCirc, easeInOutCubic, easeInOutSine, easeOutCirc, waitFor, waitUntil } from '@motion-canvas/core';
import { CodeBlockStyle, CodeStyle, Colors, Logo, WhiteLabel, Window, setupView, slideIn, slideOut } from 'components';

import initVideo from "../assets/nix-init.mp4";

import {
    CodeBlock,
    insert,
    lines,
    remove,
} from "@motion-canvas/2d/lib/components/CodeBlock";

export default makeScene2D(function*(view) {
    yield setupView(view);
    const logoRef = createRef<Logo>();
    yield view.add(<Logo ref={logoRef} />)
    yield logoRef().animateToCorner();

    const nixosLogoRef = createRef<Img>();
    yield view.add(<Img src={(new URL("../assets/reproducable.svg", import.meta.url)).href} ref={nixosLogoRef} scale={8} y={-2000} />)
    yield* slideIn(nixosLogoRef)

    yield* nixosLogoRef().y(-5, 1, easeInOutSine)
    yield* nixosLogoRef().y(5, 1, easeInOutSine)
    yield* nixosLogoRef().y(-5, 1, easeInOutSine)
    yield* nixosLogoRef().y(5, 1, easeInOutSine)
    yield* nixosLogoRef().y(-5, 1, easeInOutSine)
    yield* nixosLogoRef().y(5, 1, easeInOutSine)
    yield* nixosLogoRef().y(-5, 1, easeInOutSine)
    yield* nixosLogoRef().y(5, 1, easeInOutSine)
    yield* nixosLogoRef().y(-5, 1, easeInOutSine)
    yield* nixosLogoRef().y(5, 1, easeInOutSine)
    yield* nixosLogoRef().y(-5, 1, easeInOutSine)
    yield* nixosLogoRef().y(5, 1, easeInOutSine)
    yield* nixosLogoRef().y(-5, 1, easeInOutSine)
    yield* nixosLogoRef().y(5, 1, easeInOutSine)
    yield* nixosLogoRef().y(-5, 1, easeInOutSine)
    yield* nixosLogoRef().y(5, 1, easeInOutSine)
    yield* nixosLogoRef().y(-5, 1, easeInOutSine)
    yield* nixosLogoRef().y(5, 1, easeInOutSine)
    yield* nixosLogoRef().y(-5, 1, easeInOutSine)

    yield* slideOut(nixosLogoRef, [0, -2000])

    yield* waitUntil("getting started");
    const title = createRef<Txt>();
    view.add(
        <Txt
            {...WhiteLabel}
            ref={title}
            fontSize={125}
            y={0}
            zIndex={12}
        ></Txt>,
    );
    yield* title().text("Getting Started", 0.7);
    yield* title().y(-350, 0.3);


    yield* waitUntil("fork");
    const fork = createRef<Icon>();
    yield* view.add(<Icon icon={"ph:git-fork-bold"} ref={fork} color={Colors.red} scale={15} x={0} y={250} opacity={0} />)
    yield* fork().opacity(100, 0.6)
    yield* fork().rotation(-20, 0.3)
    yield* fork().rotation(0, 0.3)
    yield* waitFor(0.4);
    yield fork().y(2000, 1)


    yield* waitUntil("clone");
    const command = createRef<Txt>();
    view.add(
        <Txt
            {...WhiteLabel}
            ref={command}
            fontSize={45}
            y={150}
            zIndex={12}
        ></Txt>,
    );
    yield command().fill(Colors.blue)
    yield* command().text("git clone git@github.com:<yourname>/nixpkgs --filter=tree:0", 0.7);
    yield* waitFor(3)
    yield* command().text("", 0.7);


    yield* command().fontSize(65)
    yield* waitUntil("gommit");
    yield* command().text("git commit-graph write", 0.7);
    yield* waitFor(5)
    yield* command().text("", 0.7);

    yield* command().fontSize(65)
    yield* waitUntil("main");
    yield* command().text("git maintenance start", 0.7);
    yield* waitFor(5)
    yield* command().text("", 0.7);

    yield* command().fontSize(65)
    yield* waitUntil("branch");
    yield* command().text("git checkout -b mynewpkg", 0.7);
    yield* waitFor(5)
    yield* command().text("", 0.7);

    yield* command().fontSize(95)
    yield* waitUntil("bynam");
    yield* command().text("pkgs/by-name", 0.7);
    yield* waitFor(2)
    yield* command().text("", 0.7);

    yield* waitUntil("createpackage");
    const bynameref = createRef<Img>();
    yield view.add(<Img src={(new URL("../assets/package.png", import.meta.url)).href} ref={bynameref} scale={1.3} y={2000} radius={20} />)
    yield slideOut(bynameref, [0, 75]) // Can't set pos with slideIn

    const coverref = createRef<Img>();
    yield view.add(<Rect fill={Colors.crust} ref={coverref} size={[1000, 1000]} x={0} y={2500} />)
    yield* slideOut(coverref, [0, 575]) // Can't set pos with slideIn

    yield* waitUntil("ni");
    yield coverref().y(675, 0.3);

    yield* waitUntil("niri");
    yield coverref().y(775, 0.3);


    yield* waitUntil("package.nix");
    yield coverref().y(875, 0.3);


    yield* waitUntil("creatingpackage");
    yield title().text("package.nix", 0.7);
    yield coverref().y(2000, 0.3);
    yield bynameref().y(2000, 0.3);


    const windowRef = createRef<Window>();
    const codeBlockRef = createRef<CodeBlock>();
    yield view.add(<Window title={"Editor"} ref={windowRef} y={115} size={0}>
        <Layout direction={'column'} width={960} gap={40} layout>
            <CodeBlock {...CodeBlockStyle} ref={codeBlockRef} fontSize={40} language="nix" code={`
{ stdenv
, fetchFromGitHub
, SDL2
, ... # YADA YADA
}
            `} />
        </Layout>
    </Window>)

    yield* windowRef().size([1000, 750], 0.6, easeInOutCubic, Vector2.arcLerp)

    yield* waitUntil("stdenv");
    yield* codeBlockRef().edit()`
{ stdenv
, fetchFromGitHub
, SDL2
, ... # YADA YADA
}${insert(`: stdenv.mkDerivation {


}`)}
`


    yield* waitUntil("pname");
    yield* codeBlockRef().edit()`
{ stdenv
, fetchFromGitHub
, SDL2
, ... # YADA YADA
}: stdenv.mkDerivation {
    ${insert(`pname = "mypackage";`)}
    ${insert(`version = "v0.1.2";`)}
}
`

    yield* waitUntil("v");
    yield* codeBlockRef().edit()`
{ stdenv
, fetchFromGitHub
, SDL2
, ... # YADA YADA
}: stdenv.mkDerivation {
    pname = "mypackage";
    version = "${remove(`v`)}0.1.2";
}
`
    yield codeBlockRef().selection(lines(0, 123), 0.4)

    yield* waitUntil("src");


    yield* codeBlockRef().edit()`
{ stdenv
, fetchFromGitHub
, SDL2
, ... # YADA YADA
}: stdenv.mkDerivation {
    pname = "mypackage";
    version = "0.1.2";

    ${insert(`src =  `)}
}
`

    yield* waitUntil("fetchFromGitHub");
    yield* codeBlockRef().edit()`
{ stdenv
, fetchFromGitHub
, SDL2
, ... # YADA YADA
}: stdenv.mkDerivation {
    pname = "mypackage";
    version = "0.1.2";

    src = ${insert(`fetchFromGitHub {
        owner = "IogaMaster";
        repo = "videos";
        rev = "asd7asfd778as9df";
        hash = "sha256-dh87d8sa...="
    };`)}
}
`

    yield* waitUntil("owner");
    yield codeBlockRef().selection(lines(9), 0.4)

    yield* waitUntil("repo");
    yield codeBlockRef().selection(lines(10), 0.4)

    yield* waitUntil("rev");
    yield codeBlockRef().selection(lines(11), 0.4)

    yield* waitUntil("hash");
    yield codeBlockRef().selection(lines(12), 0.4)

    yield* waitUntil("whole");
    yield* codeBlockRef().selection(lines(0, 123), 0.4)

    yield* waitUntil("nativeBuildInputs");
    yield* codeBlockRef().edit()`
{ stdenv
, fetchFromGitHub
, SDL2
, ... # YADA YADA
}: stdenv.mkDerivation {${remove(`
    pname = "mypackage";
    version = "0.1.2";

    src = fetchFromGitHub {
        owner = "IogaMaster";
        repo = "videos";
        rev = "asd7asfd778as9df";
        hash = "sha256-dh87d8sa...="
    };`)}${insert(`
    nativeBuildInputs = [
        meson
    ];`)}
}
`


    yield* waitUntil("buildInputs");
    yield* codeBlockRef().edit()`
{ stdenv
, fetchFromGitHub
, SDL2
, ... # YADA YADA
}: stdenv.mkDerivation {
    ${remove(`nativeBuildInputs = [
        meson
    ];`)}${insert(`buildInputs = [
        SDL2
    ];`)}
}
`


    yield* waitUntil("vars");
    yield* codeBlockRef().edit()`
{ stdenv
, fetchFromGitHub
, SDL2
, ... # YADA YADA
}: stdenv.mkDerivation {
    ${remove(`buildInputs = [
        SDL2
    ];`)}${insert(`configurePhase = ''
        # $src & $out
        mkdir build && cd build
        cmake -S .. -B .
    '';`)}
}
`



    yield* waitUntil("build");
    yield* codeBlockRef().edit()`
{ stdenv
, fetchFromGitHub
, SDL2
, ... # YADA YADA
}: stdenv.mkDerivation {
    ${remove(`configurePhase = ''
        # $src & $out
        mkdir build && cd build
        cmake -S .. -B .
    '';`)}${insert(`buildPhase = ''
        make -j$(nproc)
    '';`)}
}
`

    yield* waitUntil("installPhase");
    yield* codeBlockRef().edit()`
{ stdenv
, fetchFromGitHub
, SDL2
, ... # YADA YADA
}: stdenv.mkDerivation {
    ${remove(`buildPhase = ''
        make -j$(nproc)
    '';`)}${insert(`installPhase = ''
        mkdir -p $out/bin
        cp -r ./Source $out/bin/.
    '';`)}
}
`


    yield* waitUntil("meta");
    yield* codeBlockRef().edit()`
{ stdenv
, fetchFromGitHub
, SDL2
, ... # YADA YADA
}: stdenv.mkDerivation {
    ${remove(`installPhase = ''
        mkdir -p $out/bin
        cp -r ./Source $out/bin/.
    '';`)}${insert(`
  meta = with lib; {
    description = "...";
    homepage = "https://github.com/...";
    license = licenses.gpl3Only;
    mainProgram = "niri";
    platforms = platforms.linux;
    maintainers = [ maintainers.foo ];
  };
  `)}
}
`

    yield* waitUntil("pl")
    yield codeBlockRef().selection(lines(7), 0.4)

    yield* waitUntil("homo")
    yield codeBlockRef().selection(lines(8), 0.4)


    yield* waitUntil("license")
    yield codeBlockRef().selection(lines(9), 0.4)

    yield* waitUntil("mainprogram")
    yield codeBlockRef().selection(lines(10), 0.4)

    yield* waitUntil("platforms")
    yield codeBlockRef().selection(lines(11), 0.4)

    yield* waitUntil("maintainers")
    yield codeBlockRef().selection(lines(12), 0.4)

    yield* waitUntil("asdjk");
    yield* codeBlockRef().edit()`
    ${remove(`{ stdenv
, fetchFromGitHub
, SDL2
, ... # YADA YADA
}: stdenv.mkDerivation {

  meta = with lib; {
    description = "...";
    homepage = "https://github.com/...";
    license = licenses.gpl3Only;
    mainProgram = "niri";
    platforms = platforms.linux;
    maintainers = [ maintainers.foo ];
  };
}`)}
            `

    yield* waitUntil("mainer");
    yield title().text("maintainer-list.nix", 0.7);
    yield title().scale(0.7, 0.7);
    yield* windowRef().size([1000, 500], 0.6, easeInOutCubic, Vector2.arcLerp)

    yield* waitUntil("maintainterssdf");

    yield* codeBlockRef().edit()`
${insert(`...
  iogamaster = {
    email = "iogamastercode+nixpkgs@gm...";
    name = "IogaMaster";
    github = "iogamaster";
    githubId = 67164465;
  };
...`)}
`

    yield* waitUntil("email");
    yield codeBlockRef().selection(lines(2), 0.4)

    yield* waitUntil("name");
    yield codeBlockRef().selection(lines(3), 0.4)

    yield* waitUntil("ghu");
    yield codeBlockRef().selection(lines(4), 0.4)

    yield* waitUntil("ghid");
    yield codeBlockRef().selection(lines(5), 0.4)


    yield* waitUntil("get ");
    yield command().scale(0.5)
    yield command().y(-220)
    yield* command().text("curl https://api.github.com/users/<username> | grep \"id\":", 0.7);

    yield* waitUntil("windowclose");

    yield windowRef().close();
    yield* command().text("", 0.7);
    yield command().scale(1)
    yield command().y(0)


    yield* waitUntil("commit with");
    yield* command().text("maintainers: add <username>", 0.7);

    yield* waitUntil("with");
    yield* command().text("", 0.7);
    yield command().scale(0.5)
    yield title().text("Committing", 0.7);
    yield* command().text("(pkg-name): (from -> to | init at version | refactor | etc)", 0.7);

    yield* waitUntil("examples");
    yield command().scale(1.2, 0.7)
    yield* command().text(`niri: init at 0.1.0`, 0.7);

    yield* waitUntil("sdajkl");
    yield* command().text(`niri: 0.1.0 -> 0.1.2`, 0.7);

    yield* waitUntil("cerqat");
    yield title().text("Creating PR", 0.7);
    yield command().text("", 0.7);

    yield* waitUntil("baller");
    yield* title().y(-375, 0.7);
    const boxesRef = createRef<Img>();
    yield view.add(<Img src={(new URL("../assets/pr.png", import.meta.url)).href} ref={boxesRef} scale={1.4} radius={25} y={2000} />)
    yield* slideOut(boxesRef, [0, 100])

    const arrow = createRef<Icon>();
    yield* view.add(<Icon icon={"material-symbols:arrow-right-alt"} ref={arrow} color={Colors.blue} scale={15} x={-2000} y={0} opacity={100} />)
    yield* slideOut(arrow, [-700, -220])

    yield* waitUntil("fuinction");
    yield slideOut(arrow, [-700, 300])
    yield arrow().rotation(-29, 0.6, easeInOutCirc)

    yield* waitUntil("fuinctio");
    yield arrow().rotation(29, 0.6, easeOutCirc)
    yield slideOut(arrow, [-700, 400])

    yield* waitUntil("skibidi");
    yield slideOut(arrow, [-700, 1000])
    yield slideOut(boxesRef, [0, 2000])

    yield* waitUntil("like so");
    yield command().scale(0.6);
    yield* command().text("hypridle: init at 0.1.0, hyprlang: 0.3.2 -> 0.4.0", 0.7);

    yield* waitUntil("skibidi wagort");
    yield* command().text("", 0.7);
    const orborg = createRef<Img>();
    yield view.add(<Img src={(new URL("../assets/ofborg.png", import.meta.url)).href} ref={orborg} scale={1.4} radius={25} y={2000} />)
    yield* slideOut(orborg, [0, 100])


    yield* waitUntil("etiquette");
    yield* slideOut(orborg, [0, 2000])
    yield* command().scale(1)
    yield* command().text("Have proper etiquette!", 0.7);


    yield* waitUntil("ping");
    yield* command().scale(1)
    yield* command().text("@IogaMaster on GitHub", 0.7);

    yield* waitUntil("tools");
    yield title().scale(1.2, 0.7);
    yield title().text("Tools", 0.7);
    yield* command().text("", 0.7);

    yield* waitUntil("statix");
    yield* command().text("github:NerdyPepper/statix", 0.7);

    yield* waitUntil("deadnix");
    yield* command().text("github:astro/deadnix", 0.7);


    yield* waitUntil("gammer");
    yield* command().text("github:jtojnar/nixpkgs-hammering", 0.7);


    yield* waitUntil("fmt");
    yield* command().text("github:nix-community/nixpkgs-fmt", 0.7);

    yield* waitUntil("int");
    yield* command().text("github:nix-community/nix-init", 0.7);

    yield* waitUntil("srcsd");
    yield* command().text("", 0.7);
    const init = createRef<Video>();
    yield view.add(<Video src={initVideo} ref={init} y={2000} radius={25} />)
    yield slideOut(init, [0, 100])
    yield init().play()

    yield* waitUntil("eqjk");
    yield slideOut(init, [0, 2000])

    yield* waitUntil("nix-update");
    yield* command().text("github:Mic92/nix-update", 0.7);


    yield* waitUntil("update");
    yield* command().text("github:nix-community/nurl", 0.7);

    yield* waitUntil("nix-updatesd");
    yield* command().text("github:Mic92/nixpkgs-review", 0.7);



    yield* waitUntil("Thanks");
    yield* title().text("Thanks", 0.7);
    yield* command().text("", 0.7);
    yield command().scale(2)


    yield* waitUntil("hauskens");
    yield* command().fill(Colors.lavender);
    yield* command().text("Hauskens | $5/mo", 0.7);


    yield* waitUntil("kinzoku");
    yield* command().fill(Colors.lavender);
    yield* command().text("Kinzoku | $5/mo", 0.7);


    yield* waitUntil("aksh1618");
    yield command().fill(Colors.green, 0.3);
    yield* command().text("aksh1618 | $1/mo", 0.7);

    yield* waitUntil("thanksOut");
    yield slideOut(command, [0, 1000])
    yield* waitFor(0.1);
    yield* slideOut(title, [0, 1000])
    yield* logoRef().animateToCenter();

    yield* waitUntil("DONE!!!");
});
