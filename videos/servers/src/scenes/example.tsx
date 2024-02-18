import { Circle, Icon, Img, Txt, makeScene2D } from '@motion-canvas/2d';
import { createRef, easeInOutSine, waitFor, waitUntil } from '@motion-canvas/core';
import { Colors, Logo, WhiteLabel, setupView, slideIn, slideOut } from "components";

export default makeScene2D(function*(view) {
    setupView(view);
    const logoRef = createRef<Logo>();
    view.add(<Logo ref={logoRef} />)
    yield logoRef().animateToCorner();

    const nixosLogoRef = createRef<Img>();
    view.add(<Img src={(new URL("../assets/flake.webp", import.meta.url)).href} ref={nixosLogoRef} y={-2000} />)
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



    yield* waitUntil("kexec");
    const title = createRef<Txt>();
    view.add(
        <Txt
            {...WhiteLabel}
            ref={title}
            fontSize={175}
            y={0}
            zIndex={12}
        ></Txt>,
    );
    yield* title().text("kexec", 0.7);
    yield* title().y(-300, 0.3);

    yield* waitUntil("reboot");
    const reboot = createRef<Icon>();
    yield* view.add(<Icon icon={"ph:arrows-counter-clockwise-bold"} ref={reboot} color={Colors.green} scale={15} x={0} y={250} opacity={0} />)
    yield* reboot().opacity(100, 0.6)
    yield* reboot().rotation(-360, 1)
    yield* waitFor(0.4);
    yield reboot().y(2000, 1)


    yield* waitUntil("no drive");
    const drive = createRef<Icon>();
    yield* view.add(<Icon icon={"solar:flash-drive-outline"} ref={drive} color={Colors.red} scale={15} x={0} y={250} opacity={0} />)
    yield* drive().opacity(100, 0.6)
    yield* drive().rotation(-20, 0.3)
    yield* drive().rotation(0, 0.3)
    yield* waitFor(0.4);
    yield drive().y(2000, 1)

    yield* waitUntil("images");
    const myping = createRef<Txt>();
    view.add(
        <Txt
            {...WhiteLabel}
            ref={myping}
            fontSize={65}
            y={150}
            zIndex={12}
        ></Txt>,
    );
    yield myping().fill(Colors.blue)
    yield* myping().text("https://github.com/nix-community/nixos-images", 0.7);
    yield* waitFor(6)
    yield* myping().text("", 0.7);

    yield* waitUntil("anywhere");
    yield* title().text("nixos-anywhere", 0.7);

    yield* waitUntil("shake");
    const disk = createRef<Icon>();
    yield* view.add(<Icon icon={"material-symbols:hard-drive-2"} ref={disk} color={Colors.mauve} scale={15} x={0} y={250} opacity={0} />)
    yield* disk().opacity(100, 0.6)

    yield* waitUntil("install");
    const install = createRef<Icon>();
    yield* view.add(<Icon icon={"material-symbols:install-desktop"} ref={install} color={Colors.green} scale={15} x={0} y={250} opacity={0} />)
    yield* disk().x(-250, 0.3);
    yield* install().opacity(100, 0.6)

    yield* waitUntil("upload");
    const upload = createRef<Icon>();
    yield* view.add(<Icon icon={"material-symbols:drive-file-move-rounded"} ref={upload} color={Colors.blue} scale={15} x={0} y={250} opacity={0} />)
    yield* install().x(250, 0.3);
    yield* upload().opacity(100, 0.6)

    yield* waitUntil("remove icons");
    yield disk().y(2000, 1)
    yield upload().y(2000, 1.3)
    yield install().y(2000, 1)

    yield* waitUntil("disko");
    yield* myping().text("https://github.com/nix-community/disko", 0.7);
    yield* waitFor(5)
    yield* myping().text("", 0.7);

    const arrow = createRef<Icon>();
    yield* view.add(<Icon icon={"material-symbols:arrow-downward-rounded"} ref={arrow} color={Colors.lavender} scale={15} x={0} y={300} opacity={0} />)
    yield* waitUntil("vimj");
    yield* arrow().opacity(100, 0.7)
    yield* arrow().y(350, 0.3)
    yield* arrow().y(300, 0.3)
    yield* arrow().y(350, 0.3)
    yield* arrow().y(300, 0.3)
    yield* arrow().opacity(0, 0.7)

    yield* waitUntil("deploy");
    yield* title().text("deploy-rs", 0.7);

    yield* waitUntil("installation");
    yield* title().text("Installation", 0.7);

    const tips = createRef<Txt>();
    view.add(
        <Txt
            {...WhiteLabel}
            ref={tips}
            fontSize={75}
            y={-145}
            zIndex={12}
        ></Txt>,
    );
    yield* tips().text("Run on server", 0.7);

    yield* waitUntil("install command");
    yield* myping().scale(0.8)
    yield* myping().text("curl -L github:nix-community/... | tar -xzf- -C /root", 0.7);
    yield* waitFor(3)
    yield* myping().text("/root/kexec/run", 0.7);
    yield* waitFor(2)
    yield* myping().text("", 0.7);

    yield* waitUntil("hostname");
    yield* myping().text("while true; do ping -c1 nixos > /dev/null && break; done", 0.7);

    yield* waitUntil("copy");
    yield myping().scale(0.67, 0.4)
    yield* myping().text("nixos-generate-config --show-hardware-config --root /mnt", 0.7);

    yield* waitUntil("anywhere useage");
    yield tips().text("Run on host", 0.7);
    yield* myping().text("nix run github:nix-community/nixos-anywhere -- --flake .#name root@nixos", 0.7);

    yield* waitUntil("doneinstall");
    yield tips().text("", 0.7);
    yield* myping().text("", 0.7);

    yield* waitUntil("deploy-rs");
    yield* title().text("Using deploy-rs", 0.7);


    yield* waitUntil("mkDeplot-rs");
    yield* arrow().opacity(100, 0.7)
    yield* arrow().y(350, 0.3)
    yield* arrow().y(300, 0.3)
    yield* arrow().y(350, 0.3)
    yield* arrow().y(300, 0.3)
    yield* arrow().opacity(0, 0.7)

    yield* myping().scale(1.5)
    yield* myping().text("deploy", 0.7);
    yield* waitFor(2)
    yield* myping().text("deploy .#hostname", 0.7);

    yield* waitFor(4.5)
    yield* myping().text("deploy .#hostname --skip-checks", 0.7);

    yield* waitFor(2)
    yield* myping().text("", 0.7);


    yield* waitUntil("additional");
    yield* title().text("Additional Tips", 0.7);


    yield* waitUntil("testcommand");
    yield myping().scale(0.6)
    yield* myping().text("nix build .#nixosConfigurations.<HOSTNAME>.config.system.build.installTest -L", 0.7);
    yield* waitFor(5)
    yield* myping().text("", 0.7);



    yield* waitUntil("Thanks");
    yield* title().text("Thanks", 0.7);
    yield myping().scale(2)


    yield* waitUntil("hauskens");
    yield* myping().fill(Colors.lavender);
    yield* myping().text("Hauskens | $5/mo", 0.7);


    yield* waitUntil("kinzoku");
    yield* myping().fill(Colors.lavender);
    yield* myping().text("Kinzoku | $5/mo", 0.7);


    yield* waitUntil("aksh1618");
    yield myping().fill(Colors.green, 0.3);
    yield* myping().text("aksh1618 | $1/mo", 0.7);

    yield* waitUntil("thanksOut");
    yield slideOut(myping, [0, 1000])
    yield* waitFor(0.1);
    yield* slideOut(title, [0, 1000])
    yield* logoRef().animateToCenter();

    yield* waitUntil("DONE!!!");
});
