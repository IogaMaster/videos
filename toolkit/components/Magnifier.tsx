import { Node, initial, signal, vector2Signal } from '@canvas-commons/2d';
import {
    PossibleVector2,
    SignalValue,
    SimpleSignal,
    Vector2,
    Vector2Signal,
} from '@canvas-commons/core';
import { FocusFrame, FocusFrameProps } from './FocusFrame';

export interface MagnifierProps extends FocusFrameProps {
    /**
     * The node to magnify. Put the things you want magnified inside one Node and
     * pass it here. It must NOT contain the magnifier, and should share the
     * magnifier's parent (so both use the same coordinate space).
     */
    source: Node;
    /** Point (in the shared parent's coordinates) shown at the lens center. */
    focus?: SignalValue<PossibleVector2>;
    zoom?: SignalValue<number>;
}

/**
 * A lens that shows a zoomed-in copy of `source`, with FocusFrame's animated
 * border. Set `fill` if you want a solid background behind the zoomed content.
 *
 *   <Magnifier source={world()} focus={() => dot().position()} zoom={3} />
 */
export class Magnifier extends FocusFrame {
    @initial(Vector2.zero)
    @vector2Signal('focus')
    public declare readonly focus: Vector2Signal<this>;

    @initial(2) @signal() public declare readonly zoom: SimpleSignal<number, this>;

    public source: Node;

    public constructor(props: MagnifierProps) {
        super({ size: [300, 300], radius: 9999, ...props });
        this.source = props.source;
    }

    protected override drawContent(ctx: CanvasRenderingContext2D) {
        const f = this.focus();
        const z = this.zoom();
        ctx.save();
        this.outline(ctx);
        ctx.clip();
        ctx.scale(z, z);
        ctx.translate(-f.x, -f.y);
        this.source.render(ctx);
        ctx.restore();
    }
}
