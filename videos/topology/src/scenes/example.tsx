import { Circle, Icon, Img, Layout, Txt, makeScene2D } from '@motion-canvas/2d';
import { Vector2, all, createRef, delay, easeInOutCubic, easeInOutSine, waitFor, waitUntil } from '@motion-canvas/core';
import { CodeBlockStyle, Colors, Logo, WhiteLabel, Window, setupView, slideIn, slideOut } from 'components';

import {
    CodeBlock,
    insert,
    lines,
    remove,
} from "@motion-canvas/2d/lib/components/CodeBlock";

export default makeScene2D(function*(view) {
    setupView(view);

    const logoRef = createRef<Logo>();
    yield view.add(<Logo ref={logoRef} />)
    yield logoRef().animateToCorner();

    const nixosLogoRef = createRef<Img>();
    yield view.add(<Img src={(new URL("../assets/logo.png", import.meta.url)).href} ref={nixosLogoRef} scale={2} radius={25} y={-2000} />)
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
    yield* slideOut(nixosLogoRef, [0, -2000])

    yield* waitUntil("guests");
    const extract = createRef<Icon>();
    yield* view.add(<Icon icon={"fluent:document-text-extract-20-filled"} ref={extract} color={Colors.sky} scale={15} x={0} y={250} opacity={0} />)

    yield* extract().opacity(100, 0.6)
    yield* waitFor(0.4);
    yield extract().y(2000, 1)


    yield* waitUntil("interfaces");
    const interfaces = createRef<Icon>();
    yield* view.add(<Icon icon={"streamline:interface-hierarchy-2-node-organization-links-structure-link-nodes-network-hierarchy"} ref={interfaces} color={Colors.red} scale={15} x={0} y={250} opacity={0} />)
    yield* interfaces().opacity(100, 0.6)
    yield* waitFor(0.4);
    yield interfaces().y(-50, 0.6)

    yield* waitUntil("services");
    const services = createRef<Icon>();
    yield* view.add(<Icon icon={"material-symbols:electrical-services"} ref={services} color={Colors.mauve} scale={15} x={0} y={250} opacity={0} />)
    yield* services().opacity(100, 0.6)
    yield* waitFor(0.4);
    yield services().x(-275, 0.6)


    yield* waitUntil("microvm");
    const microvm = createRef<Icon>();
    yield* view.add(<Icon icon={"carbon:virtual-machine"} ref={microvm} color={Colors.blue} scale={15} x={0} y={250} opacity={0} />)
    yield* microvm().opacity(100, 0.6)
    yield* waitFor(0.4);
    yield microvm().x(275, 0.6)


    yield* waitUntil("container");
    const container = createRef<Icon>();
    yield* view.add(<Icon icon={"octicon:container-16"} ref={container} color={Colors.yellow} scale={15} x={0} y={250} opacity={0} />)
    yield* container().opacity(100, 0.6)
    yield* waitFor(0.4);

    yield container().y(2000, 1)
    yield services().y(2000, 1)
    yield microvm().y(2000, 1)
    yield* interfaces().y(2000, 1.3)


    yield* waitUntil("connections");
    const connections = createRef<Icon>();
    yield* view.add(<Icon icon={"icon-park-solid:connection-box"} ref={connections} color={Colors.peach} scale={15} x={0} y={250} opacity={0} />)
    yield* connections().opacity(100, 0.6)
    yield* connections().rotation(-20, 0.3)
    yield* connections().rotation(0, 0.3)
    yield* waitFor(0.4);
    yield connections().y(2000, 1)


    yield* waitUntil("netowerk");
    const netowerk = createRef<Icon>();
    yield* view.add(<Icon icon={"bx:bxs-network-chart"} ref={netowerk} color={Colors.red} scale={15} x={0} y={250} opacity={0} />)
    yield* netowerk().opacity(100, 0.6)
    yield* netowerk().rotation(-20, 0.3)
    yield* netowerk().rotation(0, 0.3)
    yield* waitFor(0.4);
    yield netowerk().y(2000, 1)


    yield* waitUntil("inputs");
    const windowRef = createRef<Window>();
    const codeBlockRef = createRef<CodeBlock>();
    yield view.add(<Window title={"Editor"} ref={windowRef} y={0} size={0}>
        <Layout direction={'column'} width={960} gap={40} layout>
            <CodeBlock {...CodeBlockStyle} ref={codeBlockRef} fontSize={30} language="nix" code={`
inputs = {
    nix-topology.url = "github:oddlama/nix-topology";
    ...
};
            `} />
        </Layout>
    </Window>)

    yield* windowRef().size([1000, 750], 0.6, easeInOutCubic, Vector2.arcLerp)


    yield* waitUntil("overlaty");
    yield* codeBlockRef().edit()`
${remove(`inputs = {
    nix-topology.url = "github:oddlama/nix-topology";
    ...
};
`)}${insert(`pkgs = import nixpkgs {
  inherit system;
  overlays = [ nix-topology.overlays.default ];
};
`)}
`

    yield* waitUntil("module");
    yield* codeBlockRef().edit()`
${remove(`pkgs = import nixpkgs {
  inherit system;
  overlays = [ nix-topology.overlays.default ];
};
`)}${insert(`imports = [
    nix-topology.nixosModules.default
    ...
];
`)}
`

    yield* waitUntil("flake iunputs");
    yield* codeBlockRef().edit()`
${remove(`imports = [
    nix-topology.nixosModules.default
    ...
];
`)}${insert(`topology = import nix-topology {
  inherit pkgs; 
  modules = [
    ./topology.nix
    { nixosConfigurations = self.nixosConfigurations; }
  ];
};
`)}
`

    yield* waitUntil("whole");
    yield* codeBlockRef().selection(lines(4), 0.4)

    yield* waitUntil("sd");
    yield* codeBlockRef().selection(lines(0, 231), 0.4)


    yield* waitUntil("dsias");
    yield* codeBlockRef().edit()`
${remove(`topology = import nix-topology {
  inherit pkgs; 
  modules = [
    ./topology.nix
    { nixosConfigurations = self.nixosConfigurations; }
  ];
};
`)}${insert(`# topology.nix
`)}
`


    yield* waitUntil("add");
    yield* codeBlockRef().edit()`
# topology.nix
${insert(`
# mkInternet
# mkRouter
# mkConnection
`)}
`


    yield* waitUntil("used");
    yield* codeBlockRef().edit()`
# topology.nix
${remove(`# mkInternet
# mkRouter
# mkConnection
`)
        }${insert(`  nodes.internet = mkInternet {
    connections = mkConnection "router" "wan1";
  };
  nodes.router = mkRouter "linksys" {
    info = "Linksys0218";
    interfaceGroups = [
      ["eth1" "eth2"]
    ];
    connections.eth1 = mkConnection "aurora" "enp0s31f6";
    connections.eth2 = mkConnection "equinox" "eno1";
    interfaces.eth1.network = "home";
    interfaces.eth2.network = "home";
  };
`)
        }
    `

    yield* waitUntil("windowcloas3e");
    const command = createRef<Txt>();
    view.add(
        <Txt
            {...WhiteLabel}
            ref={command}
            fontSize={45}
            y={0}
            zIndex={12}
            fill={Colors.blue}
        ></Txt>,
    );

    yield* windowRef().close();
    yield* command().text("nix build .#topology.config.output", 0.7);
    yield command().scale(1)
    yield command().y(0)

    yield* waitUntil("windreds");
    yield* command().text("", 0.7);

    yield* waitUntil("Thanks");
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
    yield* title().y(-350, 0.3);
    yield* title().text("Thanks", 0.4);
    yield* command().text("", 0.7);
    yield command().scale(2)


    yield* waitUntil("hauskens");
    yield* command().fill(Colors.lavender);
    yield* command().text("Hauskens | $5/mo", 0.7);


    yield* waitUntil("kinzoku");
    yield* command().fill(Colors.lavender);
    yield* command().text("Kinzoku | $5/mo", 0.7);

    yield* waitUntil("xorlop");
    yield* command().fill(Colors.lavender);
    yield* command().text("xorlop | $5/mo", 0.7);


    yield* waitUntil("aksh1618");
    yield command().fill(Colors.green, 0.3);
    yield* command().text("aksh1618 | $1/mo", 0.7);


    yield* waitUntil("haseeb");
    yield* command().fill(Colors.peach);
    yield* command().text("Haseeb | $5 ", 0.7);

    yield* waitUntil("thanksOut");
    yield slideOut(command, [0, 1000])
    yield* waitFor(0.1);
    yield* slideOut(title, [0, 1000])

    yield* logoRef().animateToCenter();
    yield* waitUntil("DONE!!!");
});
