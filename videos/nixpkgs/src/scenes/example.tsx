import { Circle, Img, makeScene2D } from '@motion-canvas/2d';
import { createRef, waitFor } from '@motion-canvas/core';
import { Logo, setupView, slideIn } from 'components';

export default makeScene2D(function*(view) {
    yield setupView(view);
    const logoRef = createRef<Logo>();
    view.add(<Logo ref={logoRef} />)
    yield logoRef().animateToCorner();


    const nixosLogoRef = createRef<Img>();
    view.add(<Img src={(new URL("../assets/reproducable.svg", import.meta.url)).href} ref={nixosLogoRef} scale={8} y={-2000} />)
    yield* slideIn(nixosLogoRef)

    yield* waitFor(1000)
});
