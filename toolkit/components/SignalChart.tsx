import { Circle, Rect, RectProps, initial, signal } from '@canvas-commons/2d';
import { SignalValue, SimpleSignal, useThread } from '@canvas-commons/core';
import { Colors, hexToRgba } from '../utils';

export interface SignalChartProps extends RectProps {
    /** Signal (or function returning a number) to plot. */
    value: SignalValue<number>;
    label?: SignalValue<string>;
    color?: SignalValue<string>;
    /** Font family for all chart text. The font must be loaded in your project. */
    typeface?: SignalValue<string>;
    /** Fixed time axis: 0..duration seconds. The line draws across it. */
    duration?: SignalValue<number>;
    /** Scrolling window of N seconds (overrides duration). */
    window?: SignalValue<number>;
    /** Fixed Y range. Leave unset to auto-fit. */
    min?: SignalValue<number>;
    max?: SignalValue<number>;
}

/** Round tick positions covering [lo, hi]. */
function ticks(lo: number, hi: number, n = 5): number[] {
    const raw = (hi - lo) / n;
    const p = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 5, 10].map(m => m * p).find(s => s >= raw)!;
    const out: number[] = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) {
        out.push(+v.toFixed(10));
    }
    return out;
}

/**
 * Manim-style axes plotting a signal over time. Records automatically.
 *
 * `chart.point` is a Circle that follows the latest sample, so other nodes
 * can track it:  `<Line points={[() => chart().point.absolutePosition(), ...]} />`
 */
export class SignalChart extends Rect {
    @signal() public declare readonly value: SimpleSignal<number, this>;
    @initial('') @signal() public declare readonly label: SimpleSignal<string, this>;
    @initial(Colors.blue) @signal() public declare readonly color: SimpleSignal<string, this>;
    @initial('Libron, Bold')
    @signal() public declare readonly typeface: SimpleSignal<string, this>;
    @initial(0) @signal() public declare readonly duration: SimpleSignal<number, this>;
    @initial(0) @signal() public declare readonly window: SimpleSignal<number, this>;
    @initial(NaN) @signal() public declare readonly min: SimpleSignal<number, this>;
    @initial(NaN) @signal() public declare readonly max: SimpleSignal<number, this>;

    /** The dot at the latest sample. Read `.position()` / `.absolutePosition()`. */
    public readonly point = new Circle({ size: 12, fill: Colors.blue, opacity: 0 });

    private times: number[] = [];
    private values: number[] = [];
    private lo = Infinity;
    private hi = -Infinity;

    public constructor(props: SignalChartProps) {
        super({ size: [700, 400], ...props });
        this.add(this.point);

        const thread = useThread();
        const start = thread.time();
        // Runs alongside your scene and samples once per frame.
        thread.spawn(
            (function*(self: SignalChart) {
                while (true) {
                    const v = self.value();
                    self.times.push(thread.time() - start);
                    self.values.push(v);
                    self.lo = Math.min(self.lo, v);
                    self.hi = Math.max(self.hi, v);

                    const g = self.plot();
                    if (g) {
                        self.point.position([g.X(Math.min(g.now, g.x1)), g.Y(v)]);
                        self.point.opacity(1);
                    }
                    yield;
                }
            })(this),
        );
    }

    /** Axis ranges and data -> local-coordinate mapping. */
    private plot() {
        const n = this.times.length;
        if (n < 2) return null;

        const { width, height } = this.computedSize();
        const l = -width / 2 + 60;
        const r = width / 2 - 30;
        const t = -height / 2 + 40;
        const b = height / 2 - 40;

        // X range
        const now = this.times[n - 1];
        const win = this.window();
        const dur = this.duration();
        const x0 = win > 0 ? now - win : 0;
        const x1 = win > 0 ? now : dur > 0 ? dur : Math.max(now, 1e-6);

        // Y range
        let lo = this.min();
        let hi = this.max();
        const autoLo = Number.isNaN(lo);
        const autoHi = Number.isNaN(hi);
        if (autoLo) lo = this.lo;
        if (autoHi) hi = this.hi;
        if (hi - lo < 1e-9) [lo, hi] = [lo - 0.5, hi + 0.5];
        const m = (hi - lo) * 0.1;
        if (autoLo) lo -= m;
        if (autoHi) hi += m;

        const X = (x: number) => l + ((x - x0) / (x1 - x0)) * (r - l);
        const Y = (y: number) => b - ((y - lo) / (hi - lo)) * (b - t);
        const axisY = Math.min(b, Math.max(t, Y(0))); // x-axis sits at y=0 if visible

        return { n, width, height, l, r, t, b, x0, x1, lo, hi, now, X, Y, axisY };
    }

    protected override drawShape(ctx: CanvasRenderingContext2D) {
        super.drawShape(ctx);
        const g = this.plot();
        if (!g) return;
        const { n, height, l, r, t, b, x0, x1, lo, hi, now, X, Y, axisY } = g;
        const font = (px: number) => `${px}px ${this.typeface()}`;

        ctx.save();
        ctx.strokeStyle = ctx.fillStyle = Colors.text;
        ctx.lineWidth = 4.5;
        ctx.font = font(22);

        // Axes + arrowheads
        const arrow = (x: number, y: number, dx: number, dy: number) => {
            ctx.beginPath();
            ctx.moveTo(x + dx * 12, y + dy * 12);
            ctx.lineTo(x - dy * 6, y + dx * 6);
            ctx.lineTo(x + dy * 6, y - dx * 6);
            ctx.closePath();
            ctx.fill();
        };
        ctx.beginPath();
        ctx.moveTo(l, axisY);
        ctx.lineTo(r, axisY);
        ctx.moveTo(l, b);
        ctx.lineTo(l, t);
        ctx.stroke();
        arrow(r, axisY, 1, 0);
        arrow(l, t, 0, -1);

        // Ticks + numbers
        ctx.fillStyle = hexToRgba(Colors.text, 0.85);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        for (const v of ticks(x0, x1)) {
            ctx.beginPath();
            ctx.moveTo(X(v), axisY - 5);
            ctx.lineTo(X(v), axisY + 5);
            ctx.stroke();
            ctx.fillText(String(+v.toFixed(2)), X(v), axisY + 10);
        }
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (const v of ticks(lo, hi)) {
            ctx.beginPath();
            ctx.moveTo(l - 5, Y(v));
            ctx.lineTo(l + 5, Y(v));
            ctx.stroke();
            ctx.fillText(String(+v.toFixed(2)), l - 12, Y(v));
        }

        // Curve
        ctx.save();
        ctx.beginPath();
        ctx.rect(l, t, r - l, b - t);
        ctx.clip();
        ctx.strokeStyle = this.color();
        ctx.lineWidth = 6;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
            const x = X(this.times[i]);
            const y = Y(this.values[i]);
            i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // Label
        ctx.fillStyle = Colors.text;
        ctx.font = "'Libron', Bold";
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        if (this.label() != "") {
            ctx.fillText(
                `${this.label()} = ${this.values[n - 1].toFixed(2)}`,
                l + 16,
                -height / 2 + 4,
            );
        }
        ctx.restore();
    }
}
