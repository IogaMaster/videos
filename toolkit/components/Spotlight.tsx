import { Node, NodeProps, Rect, initial, signal } from '@canvas-commons/2d';
import { PossibleVector2, SignalValue, SimpleSignal } from '@canvas-commons/core';
import { FocusFrame, FocusFrameProps } from './FocusFrame';
import { Colors, hexToRgba } from '../utils';

export interface SpotlightProps extends NodeProps {
    /** Color of the dimmed area (include alpha). */
    dim?: SignalValue<string>;
    /** 0..1 fade of the whole effect. Tween it to switch the spotlight on/off. */
    amount?: SignalValue<number>;
    /** Size of the dimming layer; should cover the whole frame. */
    cover?: PossibleVector2;
    /** Props for the spotlight shape (size, position, radius, borderMode...). */
    frame?: FocusFrameProps;
}

/**
 * Dims everything under it except a cut-out shape.
 * Add it LAST so it sits on top, and keep the Spotlight itself at the origin;
 * move/resize the cut-out through `spotlight.frame`.
 *
 *   spot().frame.position([300, 100], 1);
 *   spot().frame.size([200, 200], 1);
 */
export class Spotlight extends Node {
    @initial(hexToRgba(Colors.crust, 0.7))
    @signal() public declare readonly dim: SimpleSignal<string, this>;
    @initial(1) @signal() public declare readonly amount: SimpleSignal<number, this>;

    /** The shape of the spotlight (a FocusFrame): animate it freely. */
    public readonly frame: FocusFrame;

    public constructor(props: SpotlightProps = {}) {
        super(props);

        this.frame = new FocusFrame({ size: [420, 260], radius: 24, ...props.frame });
        this.frame.opacity(() => this.amount());

        const overlay = new Rect({
            size: props.cover ?? [2400, 1400],
            fill: () => this.dim(),
            cache: true,
            opacity: () => this.amount(),
        });
        // The hole mirrors the frame's geometry and erases the dim layer.
        overlay.add(
            new Rect({
                fill: Colors.text,
                compositeOperation: 'destination-out',
                position: () => this.frame.position(),
                size: () => this.frame.size(),
                radius: () => this.frame.radius().top,
                rotation: () => this.frame.rotation(),
            }),
        );

        this.add(overlay);
        this.add(this.frame);
    }
}
