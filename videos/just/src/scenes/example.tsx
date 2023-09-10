import { Img, makeScene2D, Rect, Txt, Video } from '@motion-canvas/2d';
import { all, createRef, delay, easeOutBack, linear, waitFor, waitUntil } from '@motion-canvas/core';

import { Colors, WhiteLabel, BaseFont, setupView, Container } from '../../../../styles';

import makeLogo from "../assets/gnu.png";
import makefile from "../assets/makefile.png";
import error from '../assets/light.png';
import rotate from '../assets/rotate.png';
import crane from '../assets/crane.png';

import python from '../assets/python.svg';
import js from '../assets/js.png';

import video from "../assets/c.mp4";

export default makeScene2D(function*(view) {
    setupView(view);

    const logoContainerRef = createRef<Rect>();
    const logoTextRef = createRef<Txt>();
    view.add(<Rect ref={logoContainerRef} scale={1.5} y={-1000} zIndex={-15}>
        <Img src={makeLogo} scale={0.4} />
        <Txt {...WhiteLabel} ref={logoTextRef} fontSize={58} y={245}>Make</Txt>
    </Rect>);

    yield* waitUntil("make");
    yield* logoContainerRef().y(0, 0.5)

    yield* waitUntil("makefiles");
    const webpageScrollRef = createRef<Img>();
    view.add(<Img src={makefile} ref={webpageScrollRef} y={1200} opacity={0} scale={2.5}></Img>);
    yield* all(
        logoContainerRef().opacity(0, 0.3),
        webpageScrollRef().y(-300, 4.36, linear),
        webpageScrollRef().opacity(1, 0.6),
    )
    yield* webpageScrollRef().opacity(0, 0.3)

    yield* waitUntil("just");
    const justLogoRef = createRef<Txt>();
    view.add(<Txt {...WhiteLabel} ref={justLogoRef} fontSize={88} y={0} zIndex={12}></Txt>);
    yield* justLogoRef().text("Just", 0.7)

    yield* waitUntil("errors");
    const errorsLogoRef = createRef<Img>();
    view.add(<Img src={error} ref={errorsLogoRef} opacity={0} scale={0.3} y={250} zIndex={-12} />)
    yield* errorsLogoRef().opacity(1, 0.2);
    yield* waitFor(1);
    yield* errorsLogoRef().x(-150, 0.4)

    yield* waitUntil("circular");
    const rotateLogoRef = createRef<Img>();
    view.add(<Img src={rotate} ref={rotateLogoRef} opacity={0} scale={0.3} y={250} x={150} />)
    yield* rotateLogoRef().opacity(1, 0.2);
    yield* waitFor(2);
    yield* all(
        errorsLogoRef().opacity(0, 0.1),
        rotateLogoRef().opacity(0, 0.2)
    );

    yield* waitUntil("simplicity");
    const craneLogoRef = createRef<Img>();
    view.add(<Img src={crane} ref={craneLogoRef} opacity={0} scale={0.3} y={250} x={0} />)
    yield* craneLogoRef().opacity(1, 0.2);
    yield* waitFor(5);
    yield* craneLogoRef().opacity(0, 0.2)


    yield* waitUntil("python");
    const pythonLogoRef = createRef<Img>();
    view.add(<Img src={python} ref={pythonLogoRef} opacity={0} scale={1.5} y={250} x={0} />)
    yield* pythonLogoRef().opacity(1, 0.2);

    yield* waitUntil("nodejs");
    const jsLogoRef = createRef<Img>();
    view.add(<Img src={js} ref={jsLogoRef} opacity={0} scale={0.15} y={250} x={150} />)
    yield* pythonLogoRef().x(-150, 0.4)
    yield* jsLogoRef().opacity(1, 0.15);
    yield* waitFor(2);
    yield* all(
        pythonLogoRef().opacity(0, 0.1),
        jsLogoRef().opacity(0, 0.2)
    );


    yield* waitUntil("real-world");
    yield* justLogoRef().text("", 0.7);

    yield* waitUntil("c-project");
    const videoRef = createRef<Video>();
    view.add(<Video src={video} ref={videoRef} scale={1} y={-1150} />)
    videoRef().play();
    videoRef().seek(6);
    yield* videoRef().y(-10, 1)

    yield* waitUntil("-r flag");
    yield* justLogoRef().fontSize(58)
    yield* justLogoRef().y(420)
    yield* justLogoRef().text("'-r' means to restart on changes", 1.2)
    yield* waitFor(2);
    yield* justLogoRef().text("", 1.2)

    yield* waitUntil("outro");
    videoRef().pause();
    yield* videoRef().x(2000, 0.6);
    yield* justLogoRef().fontSize(78)
    yield* justLogoRef().y(0)
    yield* justLogoRef().text('Thanks for watching!', 0.6)

    yield* waitUntil("end");
});
