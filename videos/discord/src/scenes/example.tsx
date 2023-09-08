import { Img, makeScene2D } from '@motion-canvas/2d';
import { all, createRef, delay, easeOutBack, linear, waitFor, waitUntil } from '@motion-canvas/core';
import { setupView } from '../../../../styles'
import { Terminal } from '../../../../components/Terminal'

// Assets
import discordSvg from "../assets/discord.svg";

export default makeScene2D(function*(view) {
    setupView(view);

    const discordRef = createRef<Img>();
    view.add(<Img src={discordSvg} ref={discordRef} scale={2} y={-700} />);

    yield* waitUntil("discord");
    //yield* discordRef().y(0, 0.5)

    const term = createRef<Terminal>();
    view.add(
        <Terminal ref={term} size={0} padding={0} cursorType={'block'} />
    );
    yield* term().prompt();
    yield* waitFor(0.5);
    yield* all(
        term().padding(32, 0.5, easeOutBack),
        term().size([1200, 800], 0.5, easeOutBack),
        delay(0.8, term().type('npm install motion-canvas-components', 2, linear))
    );
    term().newline();
    yield* waitFor(1);
    term().line('Installing');
    yield* waitFor(1);
    term().line('.');
    yield* waitFor(1);
    term().line('.');
    yield* waitFor(1);
    term().line('.');
    yield* waitFor(1);
    term().line('done');
    term().newline();
    yield* waitFor(4);


    yield* waitFor(6);
});
