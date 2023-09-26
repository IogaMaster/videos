import { makeProject } from "@motion-canvas/core";

import pre from "./scenes/pre?scene";
import waiting from "./scenes/waiting?scene";
import end from "./scenes/end?scene";
import roundtable from "./scenes/roundtable?scene";

export default makeProject({
  scenes: [pre, waiting, end, roundtable],
});
