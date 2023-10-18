import { makeScene2D } from '@motion-canvas/2d';
import { waitFor } from '@motion-canvas/core';

import { setupView } from "components"


export default makeScene2D(function*(view) {
    // Create your animations here
    setupView(view);

    yield* waitFor(5);
});
