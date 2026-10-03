import { Rect, RectProps, initial, signal, vector2Signal } from '@canvas-commons/2d';
import {
    PossibleVector2,
    SignalValue,
    SimpleSignal,
    Vector2,
    Vector2Signal,
    useThread,
} from '@canvas-commons/core';
import { Colors, hexToRgba } from '../utils';

export interface GridBackgroundProps extends RectProps {
    spacing?: SignalValue<number>;
    kind?: SignalValue<'dots' | 'lines'>;
    color?: SignalValue<string>;
    /** Dot radius, or line width. */
    thickness?: SignalValue<number>;
    /** Every Nth dot/line is drawn brighter and bigger. 0 = none. */
    majorEvery?: SignalValue<number>;
    /** Constant drift in px/s. */
    drift?: SignalValue<PossibleVector2>;
    /** Manual offset in px. Link it to a camera for parallax: scroll={() => cam.position().mul(0.3)} */
    scroll?: SignalValue<PossibleVector2>;
    /** 0..1 darkening toward the edges. */
    vignette?: SignalValue<number>;
}

/** A subtle drifting dot/line grid with a vignette. Fill the frame with it. */
export class GridBackground extends Rect {
    @initial(80) @signal() public declare readonly spacing: SimpleSignal<number, this>;
    @initial('dots') @signal() public declare readonly kind: SimpleSignal<'dots' | 'lines', this>;
    @initial(hexToRgba(Colors.text, 0.15)) @signal() public declare readonly color: SimpleSignal<string, this>;
    @initial(2.5) @signal() public declare readonly thickness: SimpleSignal<number, this>;
    @initial(0) @signal() public declare readonly majorEvery: SimpleSignal<number, this>;
    @initial(Vector2.zero) @vector2Signal('drift') public declare readonly drift: Vector2Signal<this>;
    @initial(Vector2.zero) @vector2Signal('scroll') public declare readonly scroll: Vector2Signal<this>;
    @initial(0.2) @signal() public declare readonly vignette: SimpleSignal<number, this>;

    private gridTime = 0;

    public constructor(props?: GridBackgroundProps) {
        super({ size: [1920, 1080], fill: Colors.crust, ...props });
        const thread = useThread();
        const start = thread.time();
        thread.spawn(
            (function*(self: GridBackground) {
                while (true) {
                    self.gridTime = thread.time() - start;
                    yield;
                }
            })(this),
        );
    }

    protected override drawShape(ctx: CanvasRenderingContext2D) {
        super.drawShape(ctx); // background fill
        const { width, height } = this.computedSize();
        const s = Math.max(4, this.spacing());
        const sc = this.scroll();
        const dr = this.drift();
        const tx = sc.x + dr.x * this.gridTime;
        const ty = sc.y + dr.y * this.gridTime;
        const major = Math.round(this.majorEvery());
        const th = this.thickness();
        const isMajor = (j: number) => major > 0 && ((j % major) + major) % major === 0;
        const jx0 = Math.floor((-width / 2 - tx) / s);
        const jx1 = Math.ceil((width / 2 - tx) / s);
        const jy0 = Math.floor((-height / 2 - ty) / s);
        const jy1 = Math.ceil((height / 2 - ty) / s);

        ctx.save();
        ctx.beginPath();
        ctx.rect(-width / 2, -height / 2, width, height);
        ctx.clip();
        ctx.fillStyle = ctx.strokeStyle = this.color();

        if (this.kind() === 'lines') {
            for (let j = jx0; j <= jx1; j++) {
                ctx.lineWidth = isMajor(j) ? th * 2 : th;
                ctx.beginPath();
                ctx.moveTo(j * s + tx, -height / 2);
                ctx.lineTo(j * s + tx, height / 2);
                ctx.stroke();
            }
            for (let j = jy0; j <= jy1; j++) {
                ctx.lineWidth = isMajor(j) ? th * 2 : th;
                ctx.beginPath();
                ctx.moveTo(-width / 2, j * s + ty);
                ctx.lineTo(width / 2, j * s + ty);
                ctx.stroke();
            }
        } else {
            for (let i = jx0; i <= jx1; i++) {
                for (let j = jy0; j <= jy1; j++) {
                    ctx.beginPath();
                    ctx.arc(i * s + tx, j * s + ty, isMajor(i) && isMajor(j) ? th * 1.8 : th, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        const vig = this.vignette();
        if (vig > 0) {
            const g = ctx.createRadialGradient(0, 0, Math.min(width, height) * 0.3, 0, 0, Math.hypot(width, height) / 2);
            g.addColorStop(0, 'rgba(0,0,0,0)');
            g.addColorStop(1, `rgba(0,0,0,${vig})`);
            ctx.fillStyle = g;
            ctx.fillRect(-width / 2, -height / 2, width, height);
        }
        ctx.restore();
    }
}
