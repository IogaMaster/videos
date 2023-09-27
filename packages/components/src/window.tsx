import { RectProps, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { colorSignal, initial, signal } from "@motion-canvas/2d/lib/decorators";
import { SignalValue, SimpleSignal } from "@motion-canvas/core/lib/signals";

import { Colors, WhiteLabel } from "./styles";

export interface WindowProps extends RectProps {
  title?: SignalValue<string>;
}

export class Window extends Rect {
  @initial("Window")
  @signal()
  public declare readonly title: SimpleSignal<string, this>;

  public constructor(props?: WindowProps) {
    super({
      ...props,
    });

    this.add(
      <Rect
        fill={Colors.base}
        radius={25}
        size={() => this.size()}
        direction={"column"}
        clip
        layout
      >
        <Rect
          fill={Colors.mantle}
          height={"10%"}
          width={"100%"}
          offsetY={10.1}
          layout
        >
          <Rect padding={10} layout>
            <Txt {...WhiteLabel} text={this.title} />
          </Rect>
        </Rect>
        <Rect padding={10}>{this.children()}</Rect>
      </Rect>,
    );
  }
}
