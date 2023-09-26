import { Img, Rect, Txt, Video } from "@motion-canvas/2d/lib/components";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { all, waitFor, waitUntil } from "@motion-canvas/core/lib/flow";
import { createRef } from "@motion-canvas/core/lib/utils";
import {
    CodeBlock,
    insert,
    lines,
    remove,
} from "@motion-canvas/2d/lib/components/CodeBlock";
import { Vector2 } from "@motion-canvas/core/lib/types";
import { easeInOutCubic, linear } from "@motion-canvas/core/lib/tweening";

import { Colors, Container, setupView, WhiteLabel } from "components";

// Assets
import nixImg from "../assets/nix-snowflake.svg";
import tubeImg from "../assets/testtube-twemoji.svg";
import inboxImg from "../assets/inbox.svg";
import outboxImg from "../assets/outbox.svg";
import pinImg from "../assets/pin.svg";
import showVideo from "../assets/show.mp4";

export default makeScene2D(function*(view) {
    setupView(view);

    const nixlogoRef = createRef<Img>();
    view.add(
        <>
            <Img src={nixImg} ref={nixlogoRef} y={-1000} />
        </>,
    );

    yield* waitUntil("nix fly down");
    yield* nixlogoRef().y(0, 1);

    yield* waitUntil("experimental feature");
    const tubeRef = createRef<Img>();
    view.add(
        <>
            <Img src={tubeImg} ref={tubeRef} y={-1000} scale={2.5} />
        </>,
    );
    yield* all(nixlogoRef().y(1000, 1), tubeRef().y(0, 1));

    yield* waitUntil("inputs and outputs");
    const containerRef = createRef<Rect>();
    view.add(
        <Rect {...Container} ref={containerRef} fill="#00000000" gap={350} x={1500}>
            <Img src={inboxImg} scale={2.5} />
            <Img src={outboxImg} scale={2.5} />
        </Rect>,
    );
    yield* all(containerRef().x(0, 1), tubeRef().x(-1500, 1));

    yield* waitUntil("pinned");
    const pinRef = createRef<Img>();
    view.add(<Img src={pinImg} ref={pinRef} y={700} scale={1.5} />);
    yield* pinRef().y(350, 1);

    yield* waitUntil("enable flakes");
    yield* all(containerRef().opacity(0, 0.3), pinRef().opacity(0, 0.3));

    containerRef().removeChildren();
    containerRef().fill(Colors.base);
    yield* all(
        containerRef().opacity(1, 0.3),
        containerRef().size(
            [1920 - 160, 1080 - 160],
            0.6,
            easeInOutCubic,
            Vector2.arcLerp,
        ),
    );

    yield* waitUntil("add this to your nix.conf");
    const nixconfRef = createRef<CodeBlock>();
    containerRef().add(
        <CodeBlock
            code={`
    extra-experimental-features = nix-command flakes
    `}
            ref={nixconfRef}
            opacity={0}
        />,
    );
    yield* nixconfRef().opacity(1, 0.2);

    yield* waitUntil("two options");
    yield* nixconfRef().opacity(0, 0.2);
    containerRef().removeChildren();

    yield* waitUntil("basic flake");
    const flakeCodeRef = createRef<CodeBlock>();
    yield* containerRef().add(
        <CodeBlock
            language="nix"
            ref={flakeCodeRef}
            opacity={0}
            fontSize={38}
            code={`
{
    inputs = {

    };

    outputs = { self }: 
    {

    };
}
    `}
        />,
    );
    yield* flakeCodeRef().opacity(1, 0.3);

    yield* waitUntil("add nixpkgs");
    yield flakeCodeRef().edit(1.2)`
{
    inputs = {
        ${insert("nixpkgs.url = github:nixos/nixpkgs/nixos-unstable;")}
    };

    outputs = { self }: 
    {

    };
}
    `;

    yield* waitUntil("also alias");
    const subtitleRef = createRef<Txt>();
    view.add(
        <Txt {...WhiteLabel} fontSize={58} y={500} opacity={0} ref={subtitleRef}>
            {" "}
            Also alias packages using a let binding.
        </Txt>,
    );
    yield* subtitleRef().opacity(1, 0.4);
    yield* flakeCodeRef().edit(1.2)`
{
    inputs = {
        nixpkgs.url = github:nixos/nixpkgs/nixos-unstable;
    };

    outputs = { self${insert(", nixpkgs")} }:
    ${insert(`
        let 
         pkgs = nixpkgs.legacyPackages.x86_64-linux;
        in
    `)}{

    };
}`;

    yield* waitUntil("creating a development environment");
    yield* all(subtitleRef().text("", 1), flakeCodeRef().opacity(0, 0.3));
    yield* flakeCodeRef().edit(1.2)`
    outputs = { self, nixpkgs }: 
        let 
         pkgs = nixpkgs.legacyPackages.x86_64-linux;
        in
    {
        
    };
    `;
    yield* flakeCodeRef().selection(lines(0, 1233));
    yield* flakeCodeRef().opacity(1, 0.3);

    yield* waitUntil("add devshells set");
    yield* flakeCodeRef().edit(1.2)`
    outputs = { self, nixpkgs }: 
        let 
         pkgs = nixpkgs.legacyPackages.x86_64-linux;
        in
    {
    ${insert(`
        devShells = pkgs.mkShell {
            nativeBuildInputs = with pkgs; [
                rustup
                rust-analyzer
            ];
        }
    `)}};
    `;

    yield* waitUntil("arch");
    yield* flakeCodeRef().edit(1.2)`
    outputs = { self, nixpkgs }: 
        let 
         pkgs = nixpkgs.legacyPackages.x86_64-linux;
        in
    {
        devShells${insert(".x86_64-linux")} = pkgs.mkShell {
            nativeBuildInputs = with pkgs; [
                rustup
                rust-analyzer
            ];
        }
    };`;

    yield* waitUntil("name");
    yield* flakeCodeRef().edit(1.2)`
    outputs = { self, nixpkgs }: 
        let 
         pkgs = nixpkgs.legacyPackages.x86_64-linux;
        in
    {
        devShells.x86_64-linux${insert(".default")} = pkgs.mkShell {
            nativeBuildInputs = with pkgs; [
                rustup
                rust-analyzer
            ];
        }
    };
    `;
    yield* flakeCodeRef().selection(lines(0, 123), 1);

    yield* waitFor(2);
    yield* flakeCodeRef().opacity(0, 0.3);

    yield* waitUntil("building a package is simple");
    yield* flakeCodeRef().edit(0.001)`
outputs = { self, nixpkgs }: 
    let 
     pkgs = nixpkgs.legacyPackages.x86_64-linux;
    in
{

};`;
    yield* flakeCodeRef().selection(lines(0, 1233));
    yield* flakeCodeRef().opacity(1, 0.3);

    yield* waitFor(3);

    yield* flakeCodeRef().edit(1.2)`
    outputs = { self, nixpkgs }: 
        let 
         pkgs = nixpkgs.legacyPackages.x86_64-linux;
        in
    {
        ${insert(`
        packages.x86_64-linux.default = pkgs.stdenv.mkDerivation {
            nativeBuildInputs = with pkgs; [ gnumake ];
            name = "my-project";
            src = ./.;

            buildPhase = ''
              make all
            '';

            installPhase = ''
              cp ./my-project $out
            '';
        }
        `)}
    };
    `;

    yield* subtitleRef().fontSize(34);
    yield* subtitleRef().text(
        "I have linked some resources that go in depth about packaging applications with Nix.",
        2.5,
        linear,
    );

    yield* waitUntil("flake-utils first mention");
    yield* all(
        subtitleRef().text("", 2),
        flakeCodeRef().edit(1.2)`${remove(`outputs = { self, nixpkgs }: 
    let 
     pkgs = nixpkgs.legacyPackages.x86_64-linux;
    in
{
    packages.x86_64-linux.default = pkgs.stdenv.mkDerivation {
        nativeBuildInputs = with pkgs; [ gnu make ];
        name = "my-project";
        src = ./.;

        buildPhase = ''
          make all
        '';

        installPhase = ''
          cp ./my-project $out
        '';
    }

};`)}
    `,
    );

    yield* waitUntil("add flake utils");

    yield* flakeCodeRef().opacity(0, 0.3);
    yield* flakeCodeRef().edit(0.000001)`
{
  inputs = {
    nixpkgs.url = github:NixOS/nixpkgs/nixos-unstable;
  
  };

}
    `;
    yield* flakeCodeRef().selection(lines(0, 1233));
    yield* flakeCodeRef().opacity(1, 0.3);
    yield* waitFor(2);
    yield* flakeCodeRef().edit(1.2)`
{
  inputs = {
    nixpkgs.url = github:NixOS/nixpkgs/nixos-unstable;
    ${insert("flake-utils.url = github:numtide/flake-utils;")}
  };

}
    `;

    yield* waitUntil("make your outputs look like this");
    yield* flakeCodeRef().edit(1.2)`
{
  inputs = {
    nixpkgs.url = github:NixOS/nixpkgs/nixos-unstable;
    flake-utils.url = github:numtide/flake-utils;
  };
  ${insert(`

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.\${system};
      in
      {

      }
    );`)}
}
    `;

    yield* waitUntil("add the outputs");
    yield* flakeCodeRef().edit(1.2)`
${remove(`{
  inputs = {
    nixpkgs.url = github:NixOS/nixpkgs/nixos-unstable;
    flake-utils.url = github:numtide/flake-utils;
  };`)}

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.\${system};
      in
      {
        ${insert(`
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [ gnumake gcc ];

          buildInputs = with pkgs; [ ];
        };`)}
      }
    );
${remove(`}`)}
    `;

    yield* waitUntil("outputs");
    const showvideoRef = createRef<Video>();
    view.add(<Video src={showVideo} ref={showvideoRef} opacity={0} />);
    yield* showvideoRef().opacity(1, 0.3);
    yield showvideoRef().play();

    yield* waitUntil("outro");
    yield* containerRef().remove();
    yield* showvideoRef().opacity(0, 1);
    showvideoRef().remove();

    yield* waitUntil("thanks for watching");
    yield* subtitleRef().position(0);
    yield* subtitleRef().fontSize(78);
    yield* subtitleRef().text("Thanks for watching!", 2);

    yield* waitUntil("end");
});
