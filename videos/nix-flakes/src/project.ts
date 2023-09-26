import { makeProject } from "@motion-canvas/core";

import example from "./scenes/example?scene";
import audio from "./audio/audio.mp3";

export default makeProject({
  scenes: [example],
  audio: audio,
});
