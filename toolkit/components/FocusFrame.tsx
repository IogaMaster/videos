import { Rect, RectProps, initial, signal } from '@canvas-commons/2d';
import { SignalValue, SimpleSignal, useThread } from '@canvas-commons/core';
import { Colors } from '../utils';

export type BorderMode = 'none' | 'solid' | 'shift' | 'dashed';

export interface FocusFrameProps extends RectProps {
    /** 'none' | 'solid' | 'shift' (hue cycles) | 'dashed' (dashes spin around). */
    borderMode?: SignalValue<BorderMode>;
    borderColor?: SignalValue<string>;
    borderWidth?: SignalValue<number>;
    /** Speed multiplier for the shifting / spinning animation. */
    borderSpeed?: SignalValue<number>;
    dashLength?: SignalValue<number>;
    dashGap?: SignalValue<number>;
    /** Starting hue (0-360) for 'shift' mode. */
    borderHue?: SignalValue<number>;
}

/**
 * A rounded rectangle (use a huge `radius` for a circle) with an animated
 * border. Used as the shape for Spotlight and Magnifier, but works alone.
 */
export class FocusFrame extends Rect {
    @initial('dashed')
    @signal() public declare readonly borderMode: SimpleSignal<BorderMode, this>;
    @initial(Colors.blue)
    @signal() public declare readonly borderColor: SimpleSignal<string, this>;
    @initial(4) @signal() public declare readonly borderWidth: SimpleSignal<number, this>;
    @initial(1) @signal() public declare readonly borderSpeed: SimpleSignal<number, this>;
    @initial(24) @signal() public declare readonly dashLength: SimpleSignal<number, this>;
    @initial(14) @signal() public declare readonly dashGap: SimpleSignal<number, this>;
    @initial(200) @signal() public declare readonly borderHue: SimpleSignal<number, this>;

    private borderTime = 0;

    public constructor(props?: FocusFrameProps) {
        super(props ?? {});
        const thread = useThread();
        const start = thread.time();
        thread.spawn(
            (function*(self: FocusFrame) {
                while (true) {
                    self.borderTime = thread.time() - start;
                    yield;
                }
            })(this),
        );
    }

    /** Subclasses draw their content here (clipped drawing is their job). */
    protected drawContent(_ctx: CanvasRenderingContext2D) { }

    /** Path of the frame in local coordinates. */
    protected outline(ctx: CanvasRenderingContext2D) {
        const { width, height } = this.computedSize();
        ctx.beginPath();
        ctx.roundRect(-width / 2, -height / 2, width, height, this.radius().top);
    }

    protected override drawShape(ctx: CanvasRenderingContext2D) {
        super.drawShape(ctx); // fill
        this.drawContent(ctx);
        this.drawBorder(ctx);
    }

    private drawBorder(ctx: CanvasRenderingContext2D) {
        const mode = this.borderMode();
        if (mode === 'none') return;

        const t = this.borderTime * this.borderSpeed();
        ctx.save();
        this.outline(ctx);
        ctx.lineWidth = this.borderWidth();
        ctx.lineJoin = 'round';

        if (mode === 'shift') {
            ctx.strokeStyle = `hsl(${(this.borderHue() + t * 90) % 360}, 90%, 60%)`;
        } else {
            ctx.strokeStyle = this.borderColor();
        }

        if (mode === 'dashed') {
            // Stretch the pattern slightly so it tiles the perimeter without a seam.
            const { width, height } = this.computedSize();
            const r = Math.min(this.radius().top, width / 2, height / 2);
            const perimeter = 2 * (width + height) - (8 - 2 * Math.PI) * r;
            const unit = this.dashLength() + this.dashGap();
            const k = perimeter / Math.max(1, Math.round(perimeter / unit)) / unit;
            ctx.setLineDash([this.dashLength() * k, this.dashGap() * k]);
            ctx.lineDashOffset = -t * 100;
        }

        ctx.stroke();
        ctx.restore();
    }
}
