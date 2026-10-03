import { Rect, RectProps, initial, signal } from '@canvas-commons/2d';
import { SignalValue, SimpleSignal, useThread } from '@canvas-commons/core';
import { Colors, hexToRgba } from '../utils';

export interface StopwatchProps extends RectProps {
    /** 'up' counts elapsed time, 'down' counts the remaining time. */
    mode?: SignalValue<'up' | 'down'>;
    /** Total time. Drives the ring (and the end point of a countdown). 0 = none. */
    duration?: SignalValue<number>;
    running?: SignalValue<boolean>;
    /** Seconds elapsed. Set it to seek or reset: `watch().elapsed(0)`. */
    elapsed?: SignalValue<number>;
    /** Time scale: 2 = runs twice as fast as the scene (e.g. simulation time). */
    speed?: SignalValue<number>;
    /** Digits after the decimal point (0-3). */
    precision?: SignalValue<number>;
    /** Draw the progress ring. */
    ring?: SignalValue<boolean>;
    label?: SignalValue<string>;
    color?: SignalValue<string>;
    typeface?: SignalValue<string>;
}

/** A stopwatch / countdown driven by scene time, with a progress ring. */
export class Stopwatch extends Rect {
    @initial('up') @signal() public declare readonly mode: SimpleSignal<'up' | 'down', this>;
    @initial(0) @signal() public declare readonly duration: SimpleSignal<number, this>;
    @initial(true) @signal() public declare readonly running: SimpleSignal<boolean, this>;
    @initial(0) @signal() public declare readonly elapsed: SimpleSignal<number, this>;
    @initial(1) @signal() public declare readonly speed: SimpleSignal<number, this>;
    @initial(2) @signal() public declare readonly precision: SimpleSignal<number, this>;
    @initial(true) @signal() public declare readonly ring: SimpleSignal<boolean, this>;
    @initial('') @signal() public declare readonly label: SimpleSignal<string, this>;
    @initial(Colors.blue) @signal() public declare readonly color: SimpleSignal<string, this>;
    @initial('Libron, Bold')
    @signal() public declare readonly typeface: SimpleSignal<string, this>;

    public constructor(props?: StopwatchProps) {
        super({ size: 360, ...props });
        const thread = useThread();
        let last = thread.time();
        thread.spawn(
            (function*(self: Stopwatch) {
                while (true) {
                    yield;
                    const now = thread.time();
                    const dt = now - last;
                    last = now;
                    if (!self.running()) continue;
                    let e = self.elapsed() + dt * self.speed();
                    const d = self.duration();
                    if (d > 0 && self.mode() === 'down') e = Math.min(e, d);
                    self.elapsed(e);
                }
            })(this),
        );
    }

    /** Time shown on the display, in seconds. */
    public displayed(): number {
        const e = this.elapsed();
        const d = this.duration();
        return this.mode() === 'down' ? Math.max(d - e, 0) : e;
    }

    private format(t: number): string {
        const p = Math.min(3, Math.max(0, Math.round(this.precision())));
        const total = Math.max(0, t);
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = Math.floor((total % 60) * 10 ** p) / 10 ** p;
        const pad = (n: number) => String(n).padStart(2, '0');
        const sec = s.toFixed(p).padStart(p > 0 ? p + 3 : 2, '0');
        return (h > 0 ? `${h}:${pad(m)}:` : `${pad(m)}:`) + sec;
    }

    protected override drawShape(ctx: CanvasRenderingContext2D) {
        super.drawShape(ctx);
        const { width, height } = this.computedSize();
        const R = Math.min(width, height) / 2 - 14;
        const col = this.color();
        const d = this.duration();
        const e = this.elapsed();

        ctx.save();

        if (this.ring()) {
            const progress =
                d > 0
                    ? this.mode() === 'down'
                        ? 1 - Math.min(e / d, 1)
                        : Math.min(e / d, 1)
                    : (e % 60) / 60; // no duration: a second hand sweeping each minute
            ctx.lineWidth = 12;
            ctx.lineCap = 'round';
            ctx.strokeStyle = hexToRgba(Colors.text, 0.12);
            ctx.beginPath();
            ctx.arc(0, 0, R - 8, 0, Math.PI * 2);
            ctx.stroke();
            if (progress > 0) {
                ctx.strokeStyle = col;
                ctx.beginPath();
                ctx.arc(0, 0, R - 8, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
                ctx.stroke();
            }
        }

        // Digits drawn one by one on a fixed grid so they never jitter.
        const text = this.format(this.displayed());
        const fs = R * 0.36;
        const adv = (c: string) => (/\d/.test(c) ? fs * 0.62 : fs * 0.3);
        const total = [...text].reduce((w, c) => w + adv(c), 0);
        ctx.font = `${fs}px ${this.typeface()}`;
        ctx.fillStyle = Colors.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let x = -total / 2;
        for (const c of text) {
            ctx.fillText(c, x + adv(c) / 2, 0);
            x += adv(c);
        }

        if (this.label()) {
            ctx.font = `${fs * 0.42}px ${this.typeface()}`;
            ctx.fillStyle = hexToRgba(Colors.text, 0.78);
            ctx.fillText(this.label(), 0, fs * 0.95);
        }
        ctx.restore();
    }
}
