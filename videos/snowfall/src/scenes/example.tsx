import { Icon, Img, Layout, Rect, Txt, makeScene2D } from '@motion-canvas/2d';
import { createRef, waitFor, waitUntil } from '@motion-canvas/core';
import { Colors, Logo, WhiteLabel, setupView, slideIn, slideOut } from 'components';

import snowfall_logo from '../assets/lib.jpg';
import system_structure_png from '../assets/system_structure.png';
import module_structure_png from '../assets/module_structure.png';
import package_structure_png from '../assets/package_structure.png';
import module_code_png from '../assets/module_code.png';
import lib_code_png from '../assets/lib_code.png';
import store_png from '../assets/store.png';

export default makeScene2D(function*(view) {
    // Create your animations here

    setupView(view);
    const logoRef = createRef<Logo>();
    view.add(<Logo ref={logoRef} />)
    yield logoRef().animateToCorner();

    yield* waitUntil("snowfall");
    const snowfall = createRef<Img>();
    yield view.add(<Img src={snowfall_logo} ref={snowfall} scale={0.2} radius={360} y={-2000} />)
    yield* slideIn(snowfall)



    yield* waitUntil("template");
    yield* slideOut(snowfall, [0, 2000])

    yield* waitUntil("bios");
    const chip = createRef<Icon>();
    yield* view.add(<Icon icon={"bx:bxs-microchip"} ref={chip} color={Colors.text} scale={25} x={0} y={0} opacity={0} />)
    yield* chip().opacity(100, 0.3)

    yield* waitUntil("nix cli");
    const snowflake = createRef<Icon>();
    yield* view.add(<Icon icon={"uil:snowflake"} ref={snowflake} color={Colors.blue} scale={25} x={0} y={0} opacity={0} />)
    yield* chip().x(-400, 0.3)
    yield* snowflake().opacity(100, 0.3)


    yield* waitUntil("audio");
    const audio = createRef<Icon>();
    yield* view.add(<Icon icon={"mingcute:speaker-fill"} ref={audio} color={Colors.lavender} scale={22} x={0} y={0} opacity={0} />)
    yield* snowflake().x(400, 0.3)
    yield* audio().opacity(100, 0.3)

    yield* waitUntil("networking");
    const network = createRef<Icon>();
    yield* view.add(<Icon icon={"lucide:network"} ref={network} color={Colors.maroon} scale={20} x={0} y={-350} opacity={0} />)
    yield* network().opacity(100, 0.3)

    yield* waitUntil("nvidia");
    const nvidia = createRef<Icon>();
    yield* view.add(<Icon icon={"bi:nvidia"} ref={nvidia} color={Colors.green} scale={20} x={0} y={350} opacity={0} />)
    yield* nvidia().opacity(100, 0.3)

    yield* waitUntil("battery");
    const battery = createRef<Icon>();
    yield* view.add(<Icon icon={"solar:battery-charge-minimalistic-bold"} ref={battery} color={Colors.peach} scale={20} x={250} y={350} opacity={0} />)
    yield* nvidia().x(-250, 0.3)
    yield* battery().opacity(100, 0.3)

    yield* waitUntil("remove icons");

    yield nvidia().y(2000, 1)
    yield battery().y(2000, 1)

    yield* waitFor(0.1);
    yield chip().y(2000, 1)
    yield snowflake().y(2000, 1)
    yield audio().y(2000, 1)

    yield* waitFor(0.1);
    yield network().y(2000, 1)


    yield* waitUntil("links")
    const links = createRef<Txt>();
    view.add(
        <Txt
            {...WhiteLabel}
            ref={links}
            fontSize={100}
            y={0}
            zIndex={12}
        ></Txt>,
    );
    yield* links().text("github:jakehamilton/config", 0.7);
    yield* waitFor(0.1);
    yield* links().text("github:IogaMaster/dotfiles", 0.7);
    yield* waitFor(0.2);
    yield* links().text("", 0.7);

    yield* waitUntil("The Basics");
    yield* links().text("Building the Basics", 0.7);

    yield* waitUntil("directories");
    yield* links().y(-300, 0.7);
    yield links().text("Systems", 0.7);

    const system_structure = createRef<Img>();
    yield view.add(<Img src={system_structure_png} ref={system_structure} scale={2} radius={25} y={1000} />)
    yield* slideIn(system_structure)


    yield* waitUntil("modules");
    yield links().text("Modules", 0.7);
    yield* slideOut(system_structure, [0, 1000])

    const module_structure = createRef<Img>();
    yield view.add(<Img src={module_structure_png} ref={module_structure} scale={2} radius={25} y={1000} />)
    yield* slideIn(module_structure)



    yield* waitUntil("module_code");
    yield links().text("", 0.7);
    yield* slideOut(module_structure, [0, 1000])

    const module_code = createRef<Img>();
    yield view.add(<Img src={module_code_png} ref={module_code} scale={1} radius={25} y={1000} />)
    yield* slideIn(module_code)

    yield* waitUntil("packages");
    yield links().text("Packages", 0.7);
    yield* slideOut(module_code, [0, 1000])

    const package_structure = createRef<Img>();
    yield view.add(<Img src={package_structure_png} ref={package_structure} scale={2} radius={25} y={1000} />)
    yield* slideIn(package_structure)

    yield* waitUntil("lib");
    yield links().text("", 0.7);
    yield* slideOut(package_structure, [0, 1000])

    const lib_code = createRef<Img>();
    yield view.add(<Img src={lib_code_png} ref={lib_code} scale={1.3} radius={25} y={1000} />)
    yield* slideIn(lib_code)

    yield* waitUntil("homes");
    yield links().y(0, 0.7);
    yield* slideOut(lib_code, [0, 1000])
    yield links().text("A note on Homes", 0.7);

    yield* waitUntil("Getting help");
    yield links().text("Getting Help", 0.7);

    yield* waitUntil("store_page");
    yield* links().y(-350, 0.7);

    const store = createRef<Img>();
    yield view.add(<Img src={store_png} ref={store} scale={1.3} radius={25} y={1000} />)
    yield* slideOut(store, [0, 100])


    yield* waitUntil("thanks");
    yield links().text("Thanks", 0.7);
    yield* slideOut(store, [0, -1000])

    yield* waitUntil("kin");
    const names = createRef<Txt>();
    view.add(
        <Txt
            {...WhiteLabel}
            ref={names}
            fontSize={100}
            y={1000}
            zIndex={12}
        ></Txt>,
    );
    yield names().text("Kinzoku | $5/mo",);
    yield* slideIn(names)

    yield* waitUntil("aksh");
    yield* slideOut(names, [0, 1000])
    yield names().text("aksh1618 | $1/mo",);
    yield* slideIn(names)


    yield* waitUntil("lepage");
    yield* slideOut(names, [0, 1000])
    yield names().text("Gaétan Lepage | $3 one time",);
    yield* slideIn(names)

    yield* waitUntil("thanksOut");
    yield slideOut(names, [0, 1000])
    yield* waitFor(0.1);
    yield* slideOut(links, [0, 1000])
    yield* logoRef().animateToCenter();

    yield* waitUntil("end");
});
