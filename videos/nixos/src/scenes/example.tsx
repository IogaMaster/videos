import { Icon, Img, Layout, makeScene2D, Rect, Txt } from '@motion-canvas/2d';
import { all, createRef, delay, easeInOutQuad, easeInOutQuint, easeInOutSine, easeInQuint, easeOutQuint, linear, makePlugin, Vector2, waitFor, waitUntil } from '@motion-canvas/core';
import { Colors, float, Logo, setupView, slideIn, slideOut, WhiteLabel } from 'components';
import nixosLogo from "../assets/flake.webp";
import kinzoku from "../assets/kinzoku.webp";
import vimjoyer from "../assets/vimjoyerserver.png";

export default makeScene2D(function*(view) {
    setupView(view);
    const logoRef = createRef<Logo>();
    view.add(<Logo ref={logoRef} />)
    yield logoRef().animateToCorner();

    const nixosLogoRef = createRef<Img>();
    view.add(<Img src={nixosLogo} ref={nixosLogoRef} y={-2000} />)
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
    const flakesLogoRef = createRef<Txt>();
    view.add(
        <Txt
            {...WhiteLabel}
            ref={flakesLogoRef}
            fontSize={175}
            y={-50}
            zIndex={12}
        ></Txt>,
    );
    yield* flakesLogoRef().text("Flakes", 0.7);

    yield* waitUntil("other flake");

    const snowflake = createRef<Icon>();
    yield* view.add(<Icon icon={"uil:snowflake"} ref={snowflake} color={Colors.blue} scale={15} x={0} y={200} opacity={0} />)
    yield* snowflake().opacity(100, 1)

    yield* waitUntil("repo");
    const repo = createRef<Icon>();
    yield* view.add(<Icon icon={"ri:git-repository-fill"} ref={repo} color={Colors.mauve} scale={15} x={200} y={200} opacity={0} />)
    yield* snowflake().x(-200, 0.3)
    yield repo().opacity(100, 1)


    yield* waitUntil("packages");
    const packageRef = createRef<Icon>();
    yield* view.add(<Icon icon={"material-symbols:package-2"} ref={packageRef} color={Colors.rosewater} scale={15} x={0} y={-2000} opacity={100} />)
    yield* packageRef().y(-300, 0.7)

    yield* waitUntil("environments");
    const environments = createRef<Icon>();
    yield* view.add(<Icon icon={"mingcute:recycle-fill"} ref={environments} color={Colors.green} scale={15} x={0} y={-300} opacity={0} />)
    yield* packageRef().x(-300, 0.3)
    yield* environments().opacity(100, 0.7)

    yield* waitUntil("nixos-config");
    const config = createRef<Icon>();
    yield* view.add(<Icon icon={"icon-park-outline:setting-config"} ref={config} color={Colors.peach} scale={15} x={0} y={-300} opacity={0} />)
    yield* environments().x(300, 0.3)
    yield* config().opacity(100, 0.7)


    yield* waitUntil("remove_flake_section");

    yield* all(
        repo().y(2000, 1),
        snowflake().y(2000, 1),
        flakesLogoRef().y(2000, 1.3),

        packageRef().y(-2000, 0.7),
        config().y(-2000, 1),
        environments().y(-2000, 0.7)
    );
    yield* packageRef().remove()
    yield* config().remove()
    yield* repo().remove()
    yield* environments().remove()


    yield* waitUntil("flake up");
    yield* all(
        snowflake().x(0, 0.3),
        snowflake().y(0, 1),
        snowflake().scale(25, 0.001),
    );

    yield* waitUntil("copy-flake");
    const snowflake2 = createRef<Icon>();
    yield* view.add(<Icon icon={"uil:snowflake"} ref={snowflake2} color={Colors.blue} x={0} scale={25} y={0} />)
    yield* all(
        snowflake().x(-300, 0.3),
        snowflake2().x(300, 0.3)
    );

    yield* waitUntil("pinned");
    // const lock = createRef<Icon>();
    // yield* view.add(<Icon icon={"material-symbols:lock"} ref={lock} color={Colors.yellow} scale={20} x={0} y={2000} />)
    // yield* lock().y(250, 1)

    yield* waitUntil("exact");
    const equals = createRef<Icon>();
    yield* view.add(<Icon icon={"typcn:equals"} ref={equals} color={Colors.text} x={0} scale={15} y={0} opacity={0} />)
    yield* equals().opacity(100, 1.2)
    yield* all(
        snowflake().rotation(12, 0.3),
        snowflake2().rotation(12, 0.3)
    )
    yield* all(
        snowflake().rotation(-12, 0.3),
        snowflake2().rotation(-12, 0.3)
    )
    yield* all(
        snowflake().rotation(0, 0.3),
        snowflake2().rotation(0, 0.3)
    )

    yield* waitUntil("locked flakes out")
    yield* all(
        // lock().y(2000, 0.7),
        equals().y(2000, 0.9),
        snowflake().y(2000, 1),
        snowflake2().y(2000, 1)
    )

    // yield* lock().remove()
    yield* equals().remove()
    yield* snowflake().remove()
    yield* snowflake2().remove()

    yield* waitUntil("home-manager")
    const homeManager = createRef<Txt>();
    view.add(
        <Txt
            {...WhiteLabel}
            ref={homeManager}
            fontSize={175}
            y={0}
            zIndex={12}
        ></Txt>,
    );
    yield* homeManager().text("home-manager", 0.7);

    // ---------------------- Pathway -----------------------

    yield* waitUntil("pathway")
    yield* homeManager().text("", 0.5);

    yield* waitUntil("dev_tool")
    yield* homeManager().fontSize(75,);
    yield* homeManager().text("Nix as a development tool", 0.7);

    yield* waitUntil("nixpkgs")
    yield homeManager().text("Contribute to nixpkgs", 0.7);
    yield* waitUntil("pingme")
    const myping = createRef<Txt>();
    view.add(
        <Txt
            {...WhiteLabel}
            ref={myping}
            fontSize={75}
            y={150}
            zIndex={12}
        ></Txt>,
    );
    yield* myping().text("@IogaMaster", 0.7);

    yield* waitUntil("remove")
    yield* myping().text("", 0.7);
    yield homeManager().text("Research", 0.7);

    const arrow = createRef<Icon>();
    yield* view.add(<Icon icon={"material-symbols:arrow-downward-rounded"} ref={arrow} color={Colors.lavender} scale={15} x={0} y={300} opacity={0} />)
    yield* waitUntil("resources");
    yield* arrow().opacity(100, 1.4)
    yield* arrow().y(350, 0.3)
    yield* arrow().y(300, 0.3)
    yield* arrow().y(350, 0.3)
    yield* arrow().y(300, 0.3)
    yield* arrow().opacity(0, 1.4)

    yield* waitUntil("virtual machine")
    yield homeManager().text("Virtual Machine", 0.7);

    yield* waitUntil("theleap")
    yield homeManager().text("Taking the plunge", 0.7);

    yield* waitUntil("rollback")
    const rollback = createRef<Icon>();
    yield* view.add(<Icon icon={"ph:arrows-counter-clockwise-bold"} ref={rollback} color={Colors.text} scale={15} x={0} y={250} opacity={0} />)
    yield* rollback().opacity(100, 0.6)
    yield* rollback().rotation(-360, 1)
    yield* waitFor(0.4);
    yield rollback().y(2000, 1)

    yield* waitUntil("subscribe!")
    yield* homeManager().text("Subscribe!", 0.7);

    yield* waitUntil("emtpye")
    yield* homeManager().text("", 0.7);

    yield* waitUntil("finding shit")
    yield homeManager().text("Finding options and functions", 0.7);

    yield* waitUntil("search interface")
    yield myping().text("https://search.nixos.org", 0.6)
    yield myping().fill(Colors.blue)

    yield* waitUntil("nix cli")
    yield myping().text("nix search nixpkgs <searchterm>", 0.6)


    yield* waitUntil("mipmip")
    yield myping().fontSize(55, 0.6)
    yield myping().text("https://mipmip.github.io/home-manager-option-search/", 0.6)

    yield* waitUntil("manix")
    yield myping().fontSize(75, 0.6)
    yield myping().text("https://github.com/lecoqjacob/manix", 0.6)

    yield* waitUntil("nixpkgs-github")
    yield myping().fontSize(75, 0.6)
    yield myping().text("https://github.com/nixos/nixpkgs", 0.6)

    yield* waitUntil("empty")
    yield myping().fontSize(75, 0.6)
    yield myping().text("", 0.6)

    yield* waitUntil("join")
    yield homeManager().text("Join some Discords!", 0.7);

    yield* waitUntil("vimjoyer")
    yield homeManager().y(-300, 0.7);
    const vimjoyerRef = createRef<Img>();
    view.add(<Img src={vimjoyer} ref={vimjoyerRef} y={2000} radius={25} scale={1.4} />)
    yield* vimjoyerRef().y(100, 0.7)

    yield* waitUntil("Misc")
    yield homeManager().text("Miscellaneous", 0.7);
    yield homeManager().y(0, 0.7);
    yield* vimjoyerRef().y(2000, 0.7)

    yield* waitUntil("repl")
    yield myping().text("nix repl", 0.6)

    yield* waitUntil("buildmm")
    yield myping().text("sudo nixos-rebuild build-vm .#<hostname>", 1.6)

    yield* waitUntil("snowfall")
    yield myping().text("https://snowfall.org", 0.6)

    yield* waitUntil("Conclusion")
    yield homeManager().text("Conclusion", 0.7);
    yield myping().text("", 0.6)

    yield* waitUntil("support")
    yield homeManager().text("Special Thanks", 0.7);
    yield homeManager().y(325, 0.4);

    const kinzokuRef = createRef<Img>();
    view.add(<Img src={kinzoku} ref={kinzokuRef} y={-2000} radius={100} scale={4} />)
    yield* slideIn(kinzokuRef)

    yield* waitUntil("ending")
    yield homeManager().text("", 0.7);
    yield kinzokuRef().opacity(0, 0.6)

    yield* waitUntil("logosweep")
    yield* logoRef().animateToCenter()

    yield* waitUntil("cut")
});
