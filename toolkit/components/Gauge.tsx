import { Rect, RectProps, initial, signal } from '@canvas-commons/2d';
import { SignalValue, SimpleSignal, useThread } from '@canvas-commons/core';
import { Colors } from '../utils';

export interface GaugeZone {
    /** Zone ends at this value (zones are listed in ascending order). */
    to: number;
    color: string;
}

export interface GaugeProps extends RectProps {
    value: SignalValue<number>;
    min?: SignalValue<number>;
    max?: SignalValue<number>;
    label?: SignalValue<string>;
    unit?: SignalValue<string>;
    /** Colored ranges, e.g. [{to: 60, color: '#83C167'}, {to: 100, color: '#FC6255'}] */
    zones?: SignalValue<GaugeZone[]>;
    color?: SignalValue<string>;
    typeface?: SignalValue<string>;
    decimals?: SignalValue<number>;
    /** Show a marker at the highest value reached. */
    showPeak?: SignalValue<boolean>;
}

/** A 270° dial gauge with needle, zones, ticks and a peak marker. */
export class Gauge extends Rect {
    @signal() public declare readonly value: SimpleSignal<number, this>;
    @initial(0) @signal() public declare readonly min: SimpleSignal<number, this>;
    @initial(100) @signal() public declare readonly max: SimpleSignal<number, this>;
    @initial('') @signal() public declare readonly label: SimpleSignal<string, this>;
    @initial('') @signal() public declare readonly unit: SimpleSignal<string, this>;
    @initial([]) @signal() public declare readonly zones: SimpleSignal<GaugeZone[], this>;
    @initial(Colors.blue) @signal() public declare readonly color: SimpleSignal<string, this>;
    @initial('Libron')
    @signal() public declare readonly typeface: SimpleSignal<string, this>;
    @initial(0) @signal() public declare readonly decimals: SimpleSignal<number, this>;
    @initial(true) @signal() public declare readonly showPeak: SimpleSignal<boolean, this>;

    private peak = -Infinity;

    public constructor(props: GaugeProps) {
        super({ size: 420, ...props });
        // Track the peak value once per frame.
        useThread().spawn(
            (function*(self: Gauge) {
                while (true) {
                    self.peak = Math.max(self.peak, self.value());
                    yield;
                }
            })(this),
        );
    }

    public resetPeak() {
        this.peak = -Infinity;
    }

    protected override drawShape(ctx: CanvasRenderingContext2D) {
        super.drawShape(ctx);
        const { width, height } = this.computedSize();
        const R = Math.min(width, height) / 2 - 24;
        const ringW = R * 0.16;
        const rc = R - ringW / 2; // ring centerline radius
        const a0 = 0.75 * Math.PI;
        const sweep = 1.5 * Math.PI;

        const min = this.min();
        const max = this.max();
        const v = this.value();
        const frac = (x: number) =>
            Math.min(1, Math.max(0, (x - min) / (max - min || 1)));
        const ang = (x: number) => a0 + frac(x) * sweep;
        const arc = (radius: number, from: number, to: number) => {
            ctx.beginPath();
            ctx.arc(0, 0, radius, from, to);
            ctx.stroke();
        };
        const font = (px: number) => `${px}px ${this.typeface()}`;
        const zones = this.zones();

        ctx.save();
        ctx.lineCap = 'round';

        // Track
        ctx.lineWidth = ringW;
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        arc(rc, a0, a0 + sweep);

        // Zone strip just outside the ring
        ctx.lineCap = 'butt';
        ctx.lineWidth = 6;
        let prev = min;
        for (const z of zones) {
            ctx.strokeStyle = z.color;
            arc(R + 8, ang(prev), ang(Math.min(z.to, max)));
            prev = z.to;
        }

        // Value arc, colored by the zone it is in
        const zone = zones.find(z => v <= z.to) ?? zones[zones.length - 1];
        const col = zone ? zone.color : this.color();
        ctx.lineCap = 'round';
        ctx.lineWidth = ringW;
        ctx.strokeStyle = col;
        if (frac(v) > 0) arc(rc, a0, ang(v));

        // Ticks + numbers
        ctx.lineCap = 'butt';
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = font(Math.max(12, R * 0.09));
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i <= 5; i++) {
            const x = min + ((max - min) * i) / 5;
            const a = ang(x);
            const c = Math.cos(a);
            const s = Math.sin(a);
            const r1 = R - ringW - 6;
            ctx.beginPath();
            ctx.moveTo(c * r1, s * r1);
            ctx.lineTo(c * (r1 - 10), s * (r1 - 10));
            ctx.stroke();
            const rt = r1 - 26;
            ctx.fillText(String(+x.toFixed(2)), c * rt, s * rt);
        }

        // Peak marker
        if (this.showPeak() && isFinite(this.peak)) {
            const a = ang(this.peak);
            ctx.strokeStyle = Colors.yellow;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * (rc - ringW / 2 - 4), Math.sin(a) * (rc - ringW / 2 - 4));
            ctx.lineTo(Math.cos(a) * (rc + ringW / 2 + 4), Math.sin(a) * (rc + ringW / 2 + 4));
            ctx.stroke();
        }

        // Needle + hub
        const a = ang(v);
        const needle = R - ringW * 1.6;
        ctx.strokeStyle = Colors.text;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * needle, Math.sin(a) * needle);
        ctx.stroke();
        ctx.fillStyle = Colors.text;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();

        // Readout in the open gap at the bottom
        ctx.fillStyle = col;
        ctx.font = font(R * 0.26);
        ctx.fillText(v.toFixed(this.decimals()), 0, R * 0.62);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = font(R * 0.1);
        const caption = [this.label(), this.unit()].filter(Boolean).join(' · ');
        if (caption) ctx.fillText(caption, 0, R * 0.62 + R * 0.24);

        ctx.restore();
    }
}
