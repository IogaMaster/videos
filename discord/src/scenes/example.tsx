import { Img, makeScene2D } from '@motion-canvas/2d';
import { createRef, waitFor, waitUntil } from '@motion-canvas/core';
import { setupView } from '../../../styles'

// Assets
import discordSvg from "../assets/discord.svg";

export default makeScene2D(function*(view) {
    setupView(view);

    const discordRef = createRef<Img>();
    view.add(<Img src={discordSvg} ref={discordRef} scale={2} y={-700} />);

    yield* waitUntil("discord");
    yield* discordRef().y(0, 0.5)

    yield* waitFor(6);
});
