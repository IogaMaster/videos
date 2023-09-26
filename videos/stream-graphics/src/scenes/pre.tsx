import { Circle, Img, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  waitFor,
} from "@motion-canvas/core";

import { Colors, Container, setupView, WhiteLabel } from "../../../../styles";

// Assets
import profile from "./assets/profile.png";

export default makeScene2D(function* (view) {
  setupView(view);

  const logoContainerRef = createRef<Rect>();
  const streamTextRef = createRef<Txt>();
  const circleRef = createRef<Circle>();
  const radius = createSignal(575);
  view.add(
    <Rect ref={logoContainerRef} scale={1} y={0} zIndex={-15}>
      <Circle
        ref={circleRef}
        width={() => radius()}
        height={() => radius()}
        fill={Colors.text}
      />
      <Img src={profile} scale={2} radius={360} />
      <Txt
        {...WhiteLabel}
        ref={streamTextRef}
        fontSize={58}
        rotation={1.1}
        y={350}
      >
        Stream starting soon...
      </Txt>
    </Rect>,
  );

  yield* all(
    streamTextRef().scale(1.05, 1, easeInOutCubic).to(1, 1, easeInOutCubic),
    streamTextRef()
      .rotation(-1.1, 1, easeInOutCubic)
      .to(1.1, 1, easeInOutCubic),
    delay(0.2, radius(600, 1, easeInOutCubic).to(575, 1, easeInOutCubic)),
  );
});
