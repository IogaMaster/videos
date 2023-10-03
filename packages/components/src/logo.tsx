import { Circle, Img, Node, NodeProps, Rect, Txt } from '@motion-canvas/2d/lib/components';
import { easeInExpo, easeInOutCubic, easeInOutElastic, easeInOutExpo, easeInOutQuint, tween } from '@motion-canvas/core/lib/tweening';
import {
    Color,
    ColorSignal,
    PossibleColor,
} from '@motion-canvas/core/lib/types/Color';
import { colorSignal, initial, signal } from '@motion-canvas/2d/lib/decorators';
import {
    createSignal,
    SignalValue,
    SimpleSignal,
} from '@motion-canvas/core/lib/signals';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all } from '@motion-canvas/core/lib/flow';

import { Colors, WhiteLabel } from './styles';
import profile from './assets/profile.png';
import { Vector2 } from '@motion-canvas/core';

export interface LogoProps extends NodeProps { }

export class Logo extends Node {

    private logoContainerRef = createRef<Rect>();
    private textRef = createRef<Txt>();
    private logoScale = createSignal(1);
    private radius = createSignal(625 * this.logoScale());

    public constructor(props?: LogoProps) {
        super({
            ...props,
        });

        this.add(
            <Rect ref={this.logoContainerRef} scale={1} y={0} zIndex={-15}>
                <Circle
                    width={() => this.radius()}
                    height={() => this.radius()}
                    fill={Colors.text}
                />
                <Img src={profile} scale={2 * this.logoScale()} radius={360} />
                <Txt
                    {...WhiteLabel}
                    ref={this.textRef}
                    fontSize={98}
                    y={390}
                >
                    IogaMaster
                </Txt>
            </Rect>,
        );
    }

    public *animateToCorner() {
        yield* all(
            this.textRef().opacity(0, 0.45),
            this.logoContainerRef().scale(0.2, 0.6, easeInOutCubic),
            this.logoContainerRef().opacity(0.5, 0.6),
            this.logoContainerRef().position([875, 455], 0.6, easeInOutQuint, Vector2.arcLerp),
            this.logoContainerRef().size(
                [1920 - 160, 1080 - 160],
                0.6,
                easeInOutCubic,
                Vector2.polarLerp,
            ),
        )
    }

    public *animateToCenter() {
        yield* all(
            this.textRef().opacity(1, 0.45),
            this.logoContainerRef().scale(1, 0.6, easeInOutCubic),
            this.logoContainerRef().opacity(1, 0.6),
            this.logoContainerRef().position(0, 0.6, easeInOutQuint, Vector2.arcLerp),
            this.logoContainerRef().size(
                [1920 - 160, 1080 - 160],
                0.6,
                easeInOutCubic,
                Vector2.polarLerp,
            ),
        )
    }
}
