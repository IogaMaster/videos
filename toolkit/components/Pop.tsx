import { Line, Node, NodeProps, initial, signal } from '@canvas-commons/2d';
import {
    SimpleSignal,
    SignalValue,
    all,
    easeInOutCubic,
    easeOutCubic,
    tween,
} from '@canvas-commons/core';

export interface PopProps extends NodeProps {
    radius?: SignalValue<number>;
    rays?: SignalValue<number>;
    color?: SignalValue<string>;
    lineWidth?: SignalValue<number>;
    startRadius?: SignalValue<number>;
}

export class Pop extends Node {
    @initial(60) @signal()
    public declare readonly radius: SimpleSignal<number, this>;

    @initial(8) @signal()
    public declare readonly rays: SimpleSignal<number, this>;

    @initial('white') @signal()
    public declare readonly color: SimpleSignal<string, this>;

    @initial(5) @signal()
    public declare readonly lineWidth: SimpleSignal<number, this>;

    @initial(15) @signal()
    public declare readonly startRadius: SimpleSignal<number, this>;

    public constructor(props: PopProps = {}) {
        super(props);

        const rays = props.rays ?? 8;
        const color = props.color ?? 'white';
        const lineWidth = props.lineWidth ?? 5;
        const startRadius = props.startRadius ?? 15;

        for (let i = 0; i < rays; i++) {
            const angle = (i / rays) * Math.PI * 2;

            this.add(
                <Line
                    points={[
                        [startRadius, 0],
                        [startRadius, 0],
                    ]}
                    stroke={color}
                    lineWidth={lineWidth}
                    lineCap="round"
                    opacity={1}
                    rotation={(angle * 180) / Math.PI}
                />,
            );
        }
    }

    public *pop(duration = 0.6) {
        yield* all(
            ...this.children().map(ray =>
                tween(duration, value => {
                    const start = this.startRadius();
                    const end = this.radius();

                    // Outer edge shoots outward quickly.
                    const outerT = easeOutCubic(value);
                    const outer =
                        start + (end - start) * outerT;

                    // Inner edge starts exactly at the same
                    // position and catches up more slowly.
                    const innerT = easeInOutCubic(value);
                    const inner =
                        start + (end - start) * innerT;

                    ray.points([
                        [inner, 0],
                        [outer, 0],
                    ]);

                    // Fade only after the burst has extended.
                    ray.opacity(
                        value < 0.7
                            ? 1
                            : 1 - (value - 0.7) / 0.3,
                    );
                }),
            ),
        );
    }
}
