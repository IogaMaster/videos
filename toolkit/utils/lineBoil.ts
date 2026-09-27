export class LineBoil {
    private frame = 0;
    private interval: number;
    private gaps: number[];

    constructor(targetFPS = 4, baseFPS = 60, gaps = [5.5, 7.0, 8.5, 6.2, 7.8]) {
        this.interval = Math.round(baseFPS / targetFPS);
        this.gaps = gaps;
    }

    /** Automatically applies line boil to an array of ref getters OR a parent container reference */
    public apply(targets: (() => any)[] | (() => any)) {
        if (this.frame % this.interval === 0) {
            const tick = Math.floor(this.frame / this.interval);

            // Handle single container ref or array of refs
            let nodes: any[] = [];
            const targetVal = typeof targets === 'function' ? targets() : null;

            if (targetVal && targetVal.children) {
                // If it's a parent node, grab its children
                nodes = targetVal.children();
            } else if (Array.isArray(targets)) {
                nodes = targets.map(r => (typeof r === 'function' ? r() : r));
            }

            nodes.forEach((node, i) => {
                if (node && typeof node.roughHachureGap === 'function') {
                    const gap = this.gaps[(tick + i * 3) % this.gaps.length];
                    node.roughHachureGap(gap);
                }
            });
        }
        this.frame++;
    }
}

