import { makeProject } from "@motion-canvas/core";

import main from "./scenes/main?scene";
import audio from "./audio/audio.mp3";

export default makeProject({
  scenes: [main],
  audio: audio,
});
