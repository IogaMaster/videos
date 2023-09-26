import { Circle, Img, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import { Colors, Container, setupView, WhiteLabel } from "../../../../styles";

// Assets
import profile from "./assets/profile.png";

export default makeScene2D(function* (view) {
  setupView(view);

  const outlineRef = createRef<Rect>();
  view.add(
    <Txt {...WhiteLabel} fontSize={58} rotation={0} y={-472} x={-600}>
      Voyagers Roundtable:
    </Txt>,
  );

  yield* waitUntil("End");
});
