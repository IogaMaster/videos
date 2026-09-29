import { makeProject } from '@canvas-commons/core';

import title from './scenes/_title?scene';
import sorting from './scenes/sorting?scene';
import physics2d from './scenes/physics2d?scene';
import physics3d from './scenes/physics3d?scene';
import boids from "./scenes/boids?scene";
import endcard from "./scenes/_endcard?scene"

export default makeProject({
    scenes: [
        title,
        sorting, physics2d, physics3d,
        boids,
        endcard
    ],
});
