import { makeProject } from '@motion-canvas/core';

import video from './scenes/video?scene';
import audio from './audio/audio.mp3'

export default makeProject({
    scenes: [video],
    audio: audio,
});
